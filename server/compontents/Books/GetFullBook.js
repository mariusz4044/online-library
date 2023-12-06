import Books from "../../database/models/Books.js";

const getFullBook = async (id) => {
  if (!id) {
    return { error: "Nie odnaleziono ID ksiązki!" };
  }

  if (id.length !== 24) {
    //Mongo object _id have 24 characters.
    return { error: "Błędne ID ksiązki!" };
  }

  const book = (await Books.findOne({ _id: id })).toObject();

  if (!book) {
    return { error: "Nie znaleziono książki!" };
  }

  return book;
};

export default getFullBook;
