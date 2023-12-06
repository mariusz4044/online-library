import { Router } from "express";
import getCommentPage from "../../compontents/Books/GetCommentPage.js";
const router = Router();

router.post("/", async function (req, res, next) {
  const answer = await getCommentPage(req.body);
  return res.json(answer);
});

export default router;
