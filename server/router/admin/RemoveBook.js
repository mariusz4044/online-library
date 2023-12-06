import { Router } from "express";
const router = Router();
import removeBook from "../../compontents/Books/RemoveBook.js";

router.post("/", async function (req, res, next) {
  const answer = await removeBook(req.body);
  return res.json(answer);
});

export default router;
