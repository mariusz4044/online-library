import mongoose from "mongoose";

const User = mongoose.model("User", {
  login: String,
  password: String,
  nick: String,
  registerDate: Date,
  email: String,
  session: String,
  ban: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "default.png",
  },
  rank: {
    type: String,
    default: "USER",
  },
  likeBooks: {
    type: Array,
    default: [],
  },
  booksRead: {
    type: Object,
    default: {
      template: {
        bookId: "-",
      },
    },
  },
});

export default User;
