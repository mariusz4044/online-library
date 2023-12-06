import Books from "../../database/models/Books.js";
import { getSession } from "../user/session/getSession.js";
import sharp from "sharp";
import { promises as fs } from "fs";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function saveBookImage(base64) {
  if (!base64) return { error: "Brak base64 zdjęcia!" };
  const uri = Buffer.from(base64.split(";base64,").pop(), "base64");
  const sharpImg = await sharp(uri);

  const height = sharpImg.options.tiffTileHeight;
  const width = sharpImg.options.tiffTileWidth;

  if (height === 0 || width === 0) {
    return { error: "Niepoprawny rozmiar zdjęcia!" };
  }

  let finalImage = await sharpImg
    .resize({ width: 250, height: 350 })
    .jpeg({ quality: 70 });
  const buffer = await sharpImg.toBuffer();

  const bookUri = `${makeid(16)}.png`;

  const res = await finalImage.toFile(`../front/public/books/${bookUri}`);

  return bookUri;
}

const createBook = async ({
  session,
  image,
  author,
  name,
  year,
  language,
  tags,
  desc,
  epub,
} = {}) => {
  const user = await getSession(session);

  if (user.error) {
    return error;
  }

  if (user.rank !== "ADMIN") {
    return { error: "Brak uprawnień!" };
  }

  const bookImg = await saveBookImage(image);

  if (bookImg.error) return bookImg;

  let temp = {
    upload: user.nick,
    image: bookImg,
    author: author,
    title: name,
    language: language,
    description: desc,
    year: year,
  };

  if (tags.includes(";")) {
    temp["type"] = tags.split(";");
  }

  const findBook = await Books.findOne({ title: name });

  if (findBook) return { error: "Książka z takim tytułem już istnieje!" };

  const newBook = await new Books(temp);

  await newBook.save();

  if (!epub) {
    return { error: "Plik epub jest wymagany!" };
  }

  const epubBase64 = epub.replace("data:application/epub+zip;base64,", "");

  await fs.writeFile(
    `../front/public/epubs/${name}.epub`,
    epubBase64,
    "base64",
    function (err) {
      console.log(err);
    }
  );

  return { success: "Pomyślnie dodano książkę!" };
};

export default createBook;
