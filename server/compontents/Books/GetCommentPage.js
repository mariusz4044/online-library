import Books from "../../database/models/Books.js";

const getCommentPage = async ({ bookId, page }) => {
  if (!bookId) {
    return { error: "Nie odnaleziono ID ksiązki!" };
  }

  if (+page < 0) {
    return { error: "Podaj odpowiednią strone komentarzy!" };
  }

  if (bookId.length !== 24) {
    //Mongo object _id have 24 characters.
    return { error: "Błędne ID ksiązki!" };
  }

  if (page < 0) {
    return { error: "Podano błędną stone komentarzy!" };
  }

  const book = (await Books.findOne({ _id: bookId })).toObject();

  if (!book) {
    return { error: "Nie znaleziono książki!" };
  }

  const comments = book.comments.reverse();

  for (let i in comments) {
    const comment = comments[i];
    comment.like = comment.like.length;
    comment.dislike = comment.dislike.length;
  }

  const data = {
    currentPage: page,
    maxPage: Math.floor(comments.length / process.env.COMMENTS_PER_PAGE),
    comments: comments.splice(
      page * process.env.COMMENTS_PER_PAGE,
      process.env.COMMENTS_PER_PAGE
    ),
  };

  if (page > data.maxPage) {
    return { error: "Podano nieprawidłową strone komentarzy!" };
  }

  return data;
};

export default getCommentPage;
