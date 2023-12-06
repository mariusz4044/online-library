import {Router} from "express";
const router = Router();


router.use( (req, res, next) => {
    const cfIP = req.header("cf-connecting-ip");
    let ip = cfIP || req.connection.remoteAddress.replace("::ffff:", "");
    req.body.ip = ip;
    next();
});

export default router;