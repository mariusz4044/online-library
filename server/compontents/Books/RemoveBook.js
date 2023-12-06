import Books from "../../database/models/Books.js";
import { getSession } from "../user/session/getSession.js";
import getSingleBook from "./GetSingleBook.js";

const removeBook = async ({ session, bookId } = {}) => {
  const user = await getSession(session);

  if (user.error) {
    return error;
  }

  if (user.rank !== "ADMIN") {
    return { error: "Brak uprawnień!" };
  }

  const book = await getSingleBook(bookId);

  if (book.error) return book;

  await Books.deleteOne({ _id: book._id });

  return { success: "Usunięto ksiązkę!" };
};

export default removeBook;
