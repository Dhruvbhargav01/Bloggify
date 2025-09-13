const {Router} = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/logout", (req, res) => {
    res.clearCookie("token", { path: "/" }); // match path
    res.redirect("/");
});

router.post("/signup", async (req, res)=>{
    const {fullname, email, password} = req.body;
    await User.create({
        fullname,
        email,
        password,
    });
    res.redirect("/");
});

router.post("/signin", async (req, res)=>{
    const {email, password} = req.body;

    try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        });     
    }
});


module.exports = router;