import { Router } from "express";
const router = Router();
import getReports from "../../compontents/user/getReports.js";

router.get("/", async function (req, res, next) {
    const answer = await getReports(req.body);
    return res.json(answer);
});

export default router;
