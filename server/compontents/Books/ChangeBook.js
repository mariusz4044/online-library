import Books from "../../database/models/Books.js";
import { getSession } from "../user/session/getSession.js";
import getSingleBook from "./GetSingleBook.js";

const changeBook = async ({
  session,
  author,
  name,
  year,
  language,
  tags,
  desc,
  bookId,
} = {}) => {
  const user = await getSession(session);

  if (user.error) {
    return error;
  }

  if (user.rank !== "ADMIN") {
    return { error: "Brak uprawnień!" };
  }

  const book = await getSingleBook(bookId);

  if (book.error) return book.error;

  let temp = {
    author: author,
    title: name,
    language: language,
    description: desc,
    year: year,
  };

  if (tags.includes(";")) {
    temp["type"] = tags.split(";");
  }

  const res = await Books.updateMany({ _id: book._id }, { $set: temp });

  console.log(res);
  return { success: "Pomyślnie zmieniono dane książki!" };
};

export default changeBook;
