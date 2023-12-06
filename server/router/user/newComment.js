import { Router } from "express";
const router = Router();
import newComment from "../../compontents/Books/NewComment.js";

router.post("/", async function (req, res, next) {
  const answer = await newComment(req.body);
  return res.json(answer);
});

export default router;
