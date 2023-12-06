import { Router } from "express";
const router = Router();
import ChangeBook from "../../compontents/Books/ChangeBook.js";

router.post("/", async function (req, res, next) {
  const answer = await ChangeBook(req.body);
  return res.json(answer);
});

export default router;
