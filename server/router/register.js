import {Router} from "express";
const router = Router();
import {register} from "../compontents/newUser/register.js";

router.post("/", async function (req, res, next) {
    const {captcha} = req.body;

    if(!req.session.captcha) {
        //Captcha not exist.
        return res.json({error:"Nie odnaleziono captchy, odśwież stronę!"});
    }

    if(req.body.captcha !== req.session.captcha) {
        return res.json({error:"Captcha jest błędna!"});
    };

    const answer = await register(req.body);
    return res.json(answer);
});

export default router;