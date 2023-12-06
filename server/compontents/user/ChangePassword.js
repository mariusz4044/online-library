import User from "../../database/models/User.js";
import { getFullSession } from "./session/getSession.js";
import crypto from "crypto";

export const ChangePassword = async ({ session, oldPassword, password }) => {
  const user = await getFullSession(session);
  if (user.error) return user;

  if (!oldPassword || !password) {
    return { error: "Wypełnij wszystkie pola!" };
  }

  const oldPass = crypto
    .createHash("sha256")
    .update(oldPassword)
    .digest("base64");
  const newPass = crypto.createHash("sha256").update(password).digest("base64");

  if (oldPass !== user.password) {
    return { error: "Stare hasło jest błędne!" };
  }

  await User.updateOne({ _id: user._id }, { $set: { password: newPass } });
  return { success: "Hasło zostało zmienione!" };
};
