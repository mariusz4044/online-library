import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import getFullBook from "./GetFullBook.js";

const newComment = async ({ commentId, session, bookId, rate } = {}) => {
  if (!commentId || !session || !bookId || !rate) {
    return { error: "Brak wymaganych danych!" };
  }

  if (![-1, 1].includes(rate)) {
    return { error: "Błędny sposób oceny komentarza!" };
  }

  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  const book = await getFullBook(bookId);

  if (book.error) {
    return book;
  }

  console.log(book);
  const findComment = book.comments.find((el) => {
    return el.id == commentId;
  });

  if (!findComment) {
    return { error: "Nie znaleziono komentarza!" };
  }

  //Equals compare mongodb two object's _id.
  const findDislike = findComment.dislike.find((el) => {
    return el["userId"].equals(user._id);
  });

  const findlike = findComment.like.find((el) => {
    return el["userId"].equals(user._id);
  });

  if (findDislike || findlike) {
    return { error: "Oceniłeś już ten komentarz!" };
  }

  const rateObject = {
    userId: user._id,
    ts: Date.now(),
  };

  if (rate === -1) findComment.dislike.push(rateObject);
  if (rate === 1) findComment.like.push(rateObject);

  const res = await Books.updateMany(
    { _id: book._id },
    { $set: { comments: book.comments } }
  );

  return { success: "Pomyślnie dodano ocene!" };
};

export default newComment;
