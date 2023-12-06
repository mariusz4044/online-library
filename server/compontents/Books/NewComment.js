import Books from "../../database/models/Books.js";
import { getFullSession } from "../user/session/getSession.js";
import getSingleBook from "./GetSingleBook.js";
import mongoose from "mongoose";

const newComment = async ({ comment, session, bookId } = {}) => {
  if (!comment || !session || !bookId) {
    return { error: "Brak wymaganych danych!" };
  }

  const user = await getFullSession(session);

  if (user.error) {
    return user;
  }

  const book = await getSingleBook(bookId);

  if (book.error) {
    return book;
  }

  const lastComments = book.comments.find((el) => {
    return el.nick === user.nick;
  });

  if (lastComments?.date + 60 * 60 * 1000 > Date.now()) {
    return { error: "Możesz dodać komentarz raz na godzinę!" };
  }

  let isRead = false;

  if (user.booksRead[book._id]) {
    if (user.booksRead[book._id].isEnd) isRead = true;
  }

  const objectComment = {
    id: mongoose.Types.ObjectId(),
    nick: user.nick,
    text: comment,
    date: Date.now(),
    rank: user.rank,
    read: isRead,
    avatar: user.avatar,
    dislike: [],
    like: [],
  };

  const result = await Books.updateOne(
    { _id: bookId },
    {
      $push: { comments: objectComment },
    }
  );

  objectComment.dislike = objectComment.dislike.length;
  objectComment.like = objectComment.like.length;

  return { success: "Pomyślnie skomentowano!", comment: objectComment };
};

export default newComment;
