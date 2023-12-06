import Books from "../../database/models/Books.js";
import { getSession } from "../user/session/getSession.js";

const getBooks = async ({ page, name, year, filtrOne, filtrTwo } = {}) => {
  page = parseInt(page);
  if (!page) page = 0;

  console.log(page, name, year);
  let books = await Books.find().sort({ $natural: -1 });

  if (name) {
    books = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(name.toLowerCase()) ||
        book.author.toLowerCase().includes(name.toLowerCase())
      );
    });
  }

  if (year) {
    books = books.filter((book) => {
      return book.year === +year;
    });
  }

  if (filtrOne) {
    if (filtrOne == "komentarze") {
      books = books.sort((a, b) => {
        return a.comments.length - b.comments.length;
      });
      books = books.reverse();
    }

    if (filtrOne == "odsłony") {
      books = books.sort((a, b) => {
        return a.views - b.views;
      });
      books = books.reverse();
    }

    if (filtrOne == "polubione") {
      books = books.sort((a, b) => {
        return a.favorite - b.favorite;
      });
      books = books.reverse();
    }
    if (filtrOne == "oceny") {
      const avg = (arr) => {
        let rat = 0;
        if (arr.length === 0) return 0;
        for (let i in arr) {
          rat += arr[i].rate;
        }

        return rat / arr.length;
      };

      books = books.sort((a, b) => avg(a.rate) - avg(b.rate));
      books = books.reverse();
    }
  }

  if (filtrTwo) {
    books = books.filter((book) => {
      return book.type.includes(filtrTwo);
    });
  }

  let booksResponse = {};

  const returnInfo = {
    currentPage: page,
    maxPage: Math.floor(books.length / +process.env.BOOK_HOME_PAGE),
  };

  if (page > returnInfo.maxPage) {
    return { error: "Nie można uzyskać tej strony!" };
  }

  books = books.splice(
    page * +process.env.BOOK_HOME_PAGE,
    +process.env.BOOK_HOME_PAGE
  );

  for (let i in books) {
    const book = books[i].toObject();
    const { _id, rate } = book;

    book.comments = book.comments.length;

    if (rate.length) {
      const rates = Object.entries(rate).map((el) => el[1].rate);
      const avg = rates.reduce((a, c) => a + c) / rate.length;
      book.rate = avg;
    }

    if (typeof book.rate === "object") {
      //empty rate array.
      book.rate = 0;
    }

    booksResponse[_id] = book;
  }

  return { books: booksResponse, pageInfo: returnInfo };
};

export default getBooks;
