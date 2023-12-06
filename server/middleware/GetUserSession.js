import { Router } from "express";
const router = Router();

router.use((req, res, next) => {
  req.body.session = req.session?.id;
  next();
});

export default router;
