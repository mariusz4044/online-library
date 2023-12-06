import mongoose from "mongoose";

const Report = mongoose.model("Report", {
  author: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
});

export default Report;
