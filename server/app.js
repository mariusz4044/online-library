import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import http from "http";
import session from "express-session";
const app = express();
const httpsServer = http.createServer(app);
import "./database/connect-db.js";

import MongoDBStore from "connect-mongodb-session";

app.use(express.json({ limit: "15mb" }));
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

import checkUserIp from "./middleware/checkUserIp.js";
import {
  limierLogin,
  limiterCaptcha,
  limiterGetBooks,
} from "./middleware/rateLimit.js";

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
    store: new MongoDBStore(session)({
      uri: process.env.DB_URL,
      collection: "user-express-sessions",
    }),
  })
);

//Middleware
import captcha from "./compontents/captcha.js";
import GetUserSession from "./middleware/GetUserSession.js";

app.use((err, req, res, next) => {
  //Error handler
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

//Compontents.
import register from "./router/register.js";
import login from "./router/login.js";
import getSession from "./router/user/session.js";
import createNewBook from "./router/admin/CreateNewBook.js";
import getBooks from "./router/user/getBooks.js";
import getSingleBook from "./router/user/getSingleBook.js";
import newComment from "./router/user/newComment.js";
import getCommentPage from "./router/user/getCommentPage.js";
import newRate from "./router/user/newRate.js";
import bookActions from "./router/user/bookActions.js";
import rateBook from "./router/user/rateBook.js";
import getUserProfile from "./router/user/getUserProfile.js";
import likeBook from "./router/user/likeBook.js";
import getFavBooks from "./router/user/getFavBooks.js";
import unLikeBook from "./router/user/unLikeBook.js";
import report from "./router/user/report.js";
import changePassword from "./router/user/changePassword.js";
import avatar from "./router/user/avatar.js";
import ChangeBook from "./router/admin/ChangeBook.js";
import RemoveBook from "./router/admin/RemoveBook.js";
import GetReports from "./router/admin/getReports.js";
import getReports from "./router/admin/getReports.js";

app.use("/", checkUserIp);
app.use("/", GetUserSession);

app.use("/user/register", limierLogin, register);
app.use("/user/login", limierLogin, login);
app.use("/user/captcha", limiterCaptcha, captcha);
app.use("/user/session", limiterCaptcha, getSession);
app.use("/user/getBooks", limiterGetBooks, getBooks);
app.use("/user/getBook", limiterGetBooks, getSingleBook);
app.use("/user/profile", limiterGetBooks, getUserProfile);
app.use("/user/comment/new", limiterGetBooks, newComment);
app.use("/user/comment/get", limiterGetBooks, getCommentPage);
app.use("/user/comment/rate", limiterGetBooks, newRate);
app.use("/user/book/action", limiterGetBooks, bookActions);
app.use("/user/book/rate", limiterGetBooks, rateBook);
app.use("/user/book/like", limiterGetBooks, likeBook);
app.use("/user/book/getFav", limiterGetBooks, getFavBooks);
app.use("/user/book/unLike", limiterGetBooks, unLikeBook);
app.use("/user/report", limiterGetBooks, report);
app.use("/user/avatar", limiterGetBooks, avatar);
app.use("/user/changePass", limiterGetBooks, changePassword);
app.use("/admin/createBook", limiterCaptcha, createNewBook);
app.use("/admin/changeBook", limiterCaptcha, ChangeBook);
app.use("/admin/getReports", limiterCaptcha, getReports);
app.use("/admin/removeBook", limiterCaptcha, RemoveBook);

app.use(express.static("public"));

app.use("/", async (req, res) => {
  console.log(req.body);
  res.status(404).send({
    error: `Nie odnaleziono strony.`,
  });
});

const port = process.env.PORT || 2137;

httpsServer.listen(port, () => {
  console.log(`Serwer został uruchomiony poprawnie na http://localhost:${port}/.`);
});
