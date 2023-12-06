import User from "../../database/models/User.js";
import crypto from "crypto";

export const login = async (body, connectSession) => {
  const required = ["login", "password", "captcha"];

  let { login, password, ip, captcha } = body;

  //if field is empty
  for (let i in required) {
    const field = required[i];
    if (!body[field]) {
      console.log(body[field], field);
      return { error: "Uzupełnij wszystkie pola!" };
    }
  }

  if (!connectSession) {
    return {
      error: "Nie wykryto sessji użytkownika, odśwież strone!",
      important: true,
    };
  }

  password = crypto.createHash("sha256").update(password).digest("base64");

  const user = await User.findOne({ login, password });

  if (!user) {
    return { error: "Błędny login lub hasło!" };
  }

  await User.updateOne(
    { login },
    {
      $set: {
        session: connectSession,
      },
    }
  );

  return {
    success: "Pomyślnie zalogowano!",
    login: user.login,
    avatar: user.avatar,
    rank: user.rank,
    nick: user.nick,
  };
};
