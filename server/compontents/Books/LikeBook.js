import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import User from "../../database/models/User.js";
import getSingleBook from "./GetSingleBook.js";

const LikeBook = async ({ session, bookId } = {}) => {
  const user = await getFullSession(session);

  if (user.error) return user;

  const book = await getSingleBook(bookId);

  if (book.error) return book;

  if (user.likeBooks.includes(bookId)) {
    return { error: "Polubiłeś już tą ksiązkę!" };
  }

  await Books.updateOne({ _id: book._id }, { $inc: { favorite: 1 } });
  await User.update({ _id: user._id }, { $push: { likeBooks: book._id } });

  user.likeBooks.push(bookId);
  return { success: "Polubiono utwór!", likeBooks: user.likeBooks };
};

export default LikeBook;
