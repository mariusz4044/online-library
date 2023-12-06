import User from "../../database/models/User.js";
import { getFullSession } from "./session/getSession.js";
import sharp from "sharp";
import fs from "fs";

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

export const ChangeAvatar = async ({ session, avatar }) => {
  const user = await getFullSession(session);
  if (user.error) return user;

  if (
    !avatar.startsWith("data:image/png;") &&
    !avatar.startsWith("data:image/jpg;")
  ) {
    return { error: "Dozwolony format to JPG oraz PNG!" };
  }

  const uri = Buffer.from(avatar.split(";base64,").pop(), "base64");
  const sharpImg = await sharp(uri);

  const height = sharpImg.options.tiffTileHeight;
  const width = sharpImg.options.tiffTileWidth;

  if (height === 0 || width === 0) {
    return { error: "Niepoprawny rozmiar zdjęcia!" };
  }

  let finalImage = await sharpImg
    .resize({ width: 250, height: 250 })
    .jpeg({ quality: 50 });
  const buffer = await sharpImg.toBuffer();

  const avatarID = `${user.nick}-${makeid(6)}.png`;

  const res = await finalImage.toFile(`../front/public/avatars/${avatarID}`);

  await User.updateOne({ _id: user.id }, { $set: { avatar: avatarID } });

  return { success: "Pomyślnie zmieniono avatar!" };
};
