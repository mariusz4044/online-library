import { Router } from "express";
const router = Router();
import LikeBook from "../../compontents/Books/LikeBook.js";

router.post("/", async function (req, res, next) {
  const answer = await LikeBook(req.body);
  return res.json(answer);
});

export default router;
