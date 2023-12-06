import { Router } from "express";
const router = Router();
import { ChangeAvatar } from "../../compontents/user/ChangeAvatar.js";

router.post("/", async function (req, res, next) {
  const answer = await ChangeAvatar(req.body);
  return res.json(answer);
});

export default router;
