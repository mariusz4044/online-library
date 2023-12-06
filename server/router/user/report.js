import { Router } from "express";
const router = Router();
import { ReportBug } from "../../compontents/user/Report.js";

router.post("/", async function (req, res, next) {
  const answer = await ReportBug(req.body);
  return res.json(answer);
});

export default router;
