import Books from "../../database/models/Books.js";
import User from "../../database/models/User.js";
import { getFullSession, getSession } from "../user/session/getSession.js";
import getSingleBook from "./GetSingleBook.js";

const CheckStart = async (user, book) => {
  let isBookReadExist = user.booksRead ? user.booksRead[book._id] : false;

  if (!isBookReadExist) {
    user.booksRead[book._id] = {
      bookId: book._id,
      startRead: Date.now(),
      secondsRead: 0,
      lastCfi: false,
      lastSave: 0,
      isEnd: false,
      bookOpenCount: 0,
      pageRead: 0,
      rated: false,
      canRate: false,
    };

    delete user.booksRead["template"];

    const res = await User.updateOne(
      { _id: user._id },
      {
        $set: { booksRead: user.booksRead },
      }
    );

    await Books.updateOne({ _id: book._id }, { $inc: { views: 1 } });
    return { ok: 1, msg: "Pierwsza wizyta." };
  }

  let bookInfo = user.booksRead[book._id];
  bookInfo.bookOpenCount++;

  const res = await User.updateOne(
    { _id: user._id },
    {
      $set: { booksRead: user.booksRead },
    }
  );

  return {
    ok: 1,
    cfi: bookInfo.lastCfi || false,
  };
};

const UpdateStatus = async (user, book, cfi, read, isEnd) => {
  if (!cfi) return { ok: 0 };

  if (!cfi.includes("epubcfi")) {
    //if user send wrong cfi.
    return {
      error:
        "Błędny 'cfi', jeżeli błąd się powtórzy zgłoś sprawe administratorowi!",
    };
  }

  let isBookReadExist = user.booksRead ? user.booksRead[book._id] : false;

  if (!isBookReadExist) {
    return { error: "Otwórz ponownie ksiązkę aby zapisywać postępy!" };
  }

  const booksRead = user.booksRead;
  const thisBook = booksRead[book._id];

  if (Date.now() - booksRead[book._id]["lastSave"] < 900) {
    return { ok: 0 };
  }

  booksRead[book._id]["lastCfi"] = cfi;
  booksRead[book._id]["secondsRead"] += 1;
  booksRead[book._id]["lastSave"] = Date.now();

  if (thisBook.isEnd && !thisBook.canRate) {
    return { ok: 3 };
  }

  if (read > 0) {
    booksRead[book._id]["pageRead"] += read;
  }

  if (isEnd) {
    booksRead[book._id]["isEnd"] = true;

    const readMinutes = thisBook.secondsRead / 60;
    booksRead[book._id]["canRate"] = true;

    //If user read page faster than average read 60s 2page,
    //Not allow rate and not give icon "read" in comments section,
    //But add book to user read history.
    if (thisBook.pageRead / readMinutes > 2) {
      booksRead[book._id]["canRate"] = false;
    }
  }

  if (booksRead[book._id]["canRate"] && !booksRead[book._id]["rated"]) {
    return { canRate: true };
  }

  const res = await User.updateOne(
    { _id: user._id },
    { $set: { booksRead: booksRead } }
  );

  return { ok: 1 };
};

const BookActions = async ({
  session,
  task,
  bookId,
  cfi,
  read,
  isEnd,
  atEnd,
} = {}) => {
  const taskList = ["startRead", "update"];

  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  if (!taskList.includes(task)) {
    return { error: "Podano nieprawidłowe zadanie!" };
  }

  const book = await getSingleBook(bookId);

  if (book.error) {
    return book;
  }

  if (task === "startRead") {
    return CheckStart(user, book);
  }

  if (task === "update") {
    return UpdateStatus(user, book, cfi, read, atEnd);
  }
};

export default BookActions;
