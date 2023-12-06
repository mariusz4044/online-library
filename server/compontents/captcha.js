import {Router} from "express";
const router = Router();

import svgCaptcha from "svg-captcha";

const generateCaptcha = () => {
    const text = svgCaptcha.randomText().toLocaleLowerCase();

    const captcha = svgCaptcha(text,{
        width: 208,
        height: 80,
        background: `transparent`,
        noise: 0,
    });

    return { data: captcha, text: text };
};

router.get("/", function (req, res, next) {
    const captcha = generateCaptcha();
    req.session.captcha = captcha.text;
    res.type('svg');
    res.send(captcha.data);
});


export default router;