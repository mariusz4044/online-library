import { Router } from "express";
const router = Router();
import GetBooks from "../../compontents/Books/GetBooks.js";

router.get("/:page", async function (req, res, next) {
  if (req.query?.page) {
    delete req.query.page;
  }
  const answer = await GetBooks({ ...req.params, ...req.query });
  return res.json(answer);
});

export default router;
