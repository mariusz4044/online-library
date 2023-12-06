import { Router } from "express";
const router = Router();
import { getUserProfile } from "../../compontents/user/GetUserProfile.js";

router.get("/:nickname", async function (req, res, next) {
  const answer = await getUserProfile({ ...req.body, ...req.params });
  return res.json(answer);
});

export default router;
