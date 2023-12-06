import { Router } from "express";
const router = Router();
import RateBook from "../../compontents/Books/RateBook.js";

router.post("/", async function (req, res, next) {
  const answer = await RateBook(req.body);
  return res.json(answer);
});

export default router;
