import { Router } from "express";
const router = Router();
import getSingleBook from "../../compontents/Books/GetSingleBook.js";

router.get("/:id", async function (req, res, next) {
  const answer = await getSingleBook(req.params.id);
  return res.json(answer);
});

export default router;
