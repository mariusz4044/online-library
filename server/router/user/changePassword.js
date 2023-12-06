import { Router } from "express";
const router = Router();
import { ChangePassword } from "../../compontents/user/ChangePassword.js";

router.post("/", async function (req, res, next) {
  const answer = await ChangePassword(req.body);
  return res.json(answer);
});

export default router;
