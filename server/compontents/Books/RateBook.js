import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import getFullBook from "./GetFullBook.js";
import User from "../../database/models/User.js";

const newComment = async ({ session, bookId, rate } = {}) => {
  if (!rate || !bookId) {
    return { error: "Brak wymaganych danych!" };
  }

  if (![1, 2, 3, 4, 5].includes(rate)) {
    return { error: "Błędny sposób oceny książki!" };
  }

  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  const findBook = user.booksRead[bookId];

  if (!findBook) {
    return { error: "Nie możesz ocenić tej książki!" };
  }

  if (!findBook.canRate) {
    return { error: "Ocena jest niemożliwa!" };
  }

  const book = await getFullBook(bookId);

  const res = await Books.updateOne(
    { _id: book._id },
    {
      $push: {
        rate: {
          userId: user._id,
          rate,
          date: Date.now(),
        },
      },
    }
  );

  findBook["rated"] = rate;

  const resUser = await User.updateOne(
    { _id: user._id },
    { $set: { booksRead: user.booksRead } }
  );

  return { success: "Pomyślnie oceniono ksiązkę!" };
};

export default newComment;
