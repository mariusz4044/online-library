import { Router } from "express";
const router = Router();
import { getSession } from "../../compontents/user/session/getSession.js";

router.get("/", async function (req, res, next) {
  const answer = await getSession(req.session.id);
  return res.json(answer);
});

export default router;
