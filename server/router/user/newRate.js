import { Router } from "express";
const router = Router();
import NewRate from "../../compontents/Books/NewRate.js";

router.post("/", async function (req, res, next) {
  const answer = await NewRate(req.body);
  return res.json(answer);
});

export default router;
