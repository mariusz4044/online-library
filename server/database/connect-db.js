import mongoose from "mongoose";

const url = process.env.DB_URL;

const db = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
