import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import getSingleBook from "./GetSingleBook.js";

const GetFavBooks = async ({ session }) => {
  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  let temp = {};

  for (let i in user.likeBooks) {
    const book = await getSingleBook(user.likeBooks[i].toString());

    if (!book.error && book) temp[i] = book;
  }

  return temp;
};

export default GetFavBooks;
