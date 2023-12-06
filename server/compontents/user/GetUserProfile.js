import User from "../../database/models/User.js";
import { getFullSession } from "./session/getSession.js";
import getSingleBook from "../Books/GetSingleBook.js";

export const getUserProfile = async ({ session, nickname }) => {
  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  const findUser = await User.findOne({ nick: nickname });

  if (!findUser) {
    return { error: "Nie odnaleziono użytkownika!" };
  }

  let avgVisit = 0;
  let avgPerPage = 0;
  let spendTime = 0;
  let readBooks = 0;
  let readTime = 0;
  let readPages = 0;

  let rateCount = Object.values(findUser.booksRead).filter((el) => {
    return el.rated;
  });

  for (let i in findUser.booksRead) {
    const { secondsRead, isEnd, bookOpenCount, pageRead } =
      findUser.booksRead[i];

    avgVisit += bookOpenCount;
    avgPerPage += pageRead;
    readTime += secondsRead;
    readPages += pageRead;

    if (isEnd === true) {
      readBooks++;
    }
  }

  avgVisit = avgVisit / readBooks;

  let bookList = {};

  const bks = Object.values(findUser.booksRead).reverse().splice(0, 4);

  for (let i in bks) {
    const { secondsRead, isEnd, bookOpenCount, pageRead, bookId } = bks[i];

    avgPerPage = parseInt(readTime / readPages);

    const book = await getSingleBook(bookId.toString());

    if (!book.error) bookList[bookId] = book;
  }

  for (let x in bookList) {
    bookList[x].comments = bookList[x].length;
  }

  return {
    nick: findUser.nick,
    avatar: findUser.avatar,
    rateCount: rateCount.length,
    spendTime: readTime,
    readBooks: Object.values(findUser.booksRead).length,
    readEnd: readBooks,
    avgVisit,
    avgPerPage,
    readPages,
    bookList,
  };
};
