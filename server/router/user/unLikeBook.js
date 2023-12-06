import { Router } from "express";
const router = Router();
import UnLikeBook from "../../compontents/Books/UnLikeBook.js";

router.post("/", async function (req, res, next) {
  const answer = await UnLikeBook(req.body);
  return res.json(answer);
});

export default router;
