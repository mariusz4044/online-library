import { Router } from "express";
const router = Router();
import createBook from "../../compontents/Books/CreateBook.js";

router.post("/", async function (req, res, next) {
  const answer = await createBook(req.body);
  return res.json(answer);
});

export default router;
