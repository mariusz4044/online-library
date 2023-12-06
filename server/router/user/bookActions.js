import { Router } from "express";

import BookActions from "../../compontents/Books/BookActions.js";
const router = Router();

router.post("/", async function (req, res, next) {
  const answer = await BookActions(req.body);
  return res.json(answer);
});

export default router;
