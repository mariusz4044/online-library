import Books from "../../database/models/Books.js";

const getSingleBook = async (id) => {
  if (!id) {
    return { error: "Nie odnaleziono ID ksiązki!" };
  }

  if (id.length !== 24) {
    //Mongo object _id have 24 characters.
    return { error: "Błędne ID ksiązki!" };
  }

  let book = await Books.findOne({ _id: id });

  if (!book) {
    return { error: "Nie znaleziono książki!" };
  }

  book = book.toObject();

  //Date comments sort.
  book.comments = book.comments.reverse();

  //Don't show users id.
  for (let i in book.comments) {
    const comment = book.comments[i];
    comment.like = comment.like.length;
    comment.dislike = comment.dislike.length;
  }

  //Show only rate
  if (book.rate.length) {
    const rates = Object.entries(book.rate).map((el) => el[1].rate);
    const avg = rates.reduce((a, c) => a + c) / book.rate.length;
    book.rate = avg;
  }

  if (typeof book.rate === "object") {
    //empty rate array.
    book.rate = 0;
  }

  book.commentsPages = Math.floor(
    book.comments.length / process.env.COMMENTS_PER_PAGE
  );
  book.comments = book.comments.splice(0, process.env.COMMENTS_PER_PAGE);
  //

  return book;
};

export default getSingleBook;
