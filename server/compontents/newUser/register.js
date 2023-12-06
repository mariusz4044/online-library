import User from "../../database/models/User.js";
import crypto from "crypto";

export const register = async (body) => {
  const required = ["nick", "login", "email", "password","captcha"];

  let { nick, login, password, email, ip,captcha } = body;


  //if field is empty
  for (let i in required) {
    const field = required[i];
    if (!body[field]) {
      return {error:"Uzupełnij wszystkie pola!"};
    }
  }

  let match = nick.match(/[A-Za-z0-9 ]+/);

  if (match && !(match[0] === nick)) {
    return {error:"Login zawiera niedozwolone znaki [A-Z 0-9]!"};
  }

  if (nick.length > 13 || nick.length < 4) {
    return {error:"Nazwa użytkownika powinna posiadać od 4 do 13 znaków!"};
  }

  if (login.length > 13 || login.length < 4) {
    return {error:"Login powinien posiadać od 4 do 13 znaków!"};
  }

  if (password.length < 4 || password.length > 25) {
    return {error:"Hasło powinno posiadać posiadać od 4 do 25 znaków!"};
  }

  if (!email.includes("@") || password.length > 60) {
    return {error:"Niepoprawny adres email!"};
  }

  let findNick = await User.findOne({ nick: nick });
  let findLogin = await User.findOne({ login: login });

  if(findLogin) {
    return {error:"Login jest zajęty!"};
  }

  if(findNick) {
    return {error:"Nazwa użytkownika jest zajęta!"};
  }

  password = crypto.createHash("sha256").update(password).digest("base64");

  let newUser = await new User({
    login,
    password,
    email,
    nick,
    session: '',
    registerDate : new Date(),
  });

  await newUser.save();

  return {
    success : "Stworzono konto pomyślnie, możesz się zalogować!"
  }
};
