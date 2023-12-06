import mongoose from "mongoose";

const Books = mongoose.model("Books", {
  image: { type: String, required: true },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    default: "Nieznany",
  },
  description: {
    type: String,
    default: "Brak opisu...",
  },
  upload: {
    type: String,
    default: "Anonim",
  },
  year: {
    type: Number,
    default: 1900,
  },
  type: {
    type: Array,
    default: [],
  },
  views: {
    type: Number,
    default: 0,
  },
  favorite: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
  },
  rate: {
    type: Array,
    default: [],
  },
});

export default Books;
