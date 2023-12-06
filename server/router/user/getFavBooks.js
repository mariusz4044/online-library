import { Router } from "express";
const router = Router();
import GetFavBooks from "../../compontents/Books/GetFavBooks.js";

router.get("/", async function (req, res, next) {
  const answer = await GetFavBooks(req.body);
  return res.json(answer);
});

export default router;
