import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import User from "../../database/models/User.js";
import getSingleBook from "./GetSingleBook.js";

const UnLikeBook = async ({ session, bookId } = {}) => {
  const user = await getFullSession(session);

  if (user.error) return user;

  const book = await getSingleBook(bookId);

  if (book.error) return book;

  const findBook = Object.values(user.likeBooks).find((el) => {
    return el.toString() === bookId;
  });

  if (!findBook) {
    return { error: "Nie odnaleziono polubionej książki!" };
  }

  user.likeBooks.splice(user.likeBooks.indexOf(bookId), 1);

  await User.updateOne(
    { _id: user._id },
    { $set: { likeBooks: user.likeBooks } }
  );

  return { success: "Usunięto z ulubionych utwór!", likeBooks: user.likeBooks };
};

export default UnLikeBook;
