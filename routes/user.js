const {Router} = require("express");
const USER = require("../models/user")



const router = Router();

router.get("/signin",async(req,res)=>{
    return res.render("signin",{
        user:req.user,
    });
})

router.get("/signup",async(req,res)=>{
    return res.render("signup",{
        user:req.user,
    });
})

router.post("/signup",async (req,res)=>{
    const {fullName, email, password} = req.body;
    try {
        await USER.create({
            fullName,
            email,
            password
        })
        return res.redirect("/user/signin");
    } catch (err) {
        if(err.code === 11000){
            console.log("Duplicate User Found !");
            return res.render("signup",{
                duplicateError:"Email Already Exists!"
            });
        }
    }
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await USER.matchPasswordandGenerateToken(email, password);

        if (token.error === "User Not Found!") {
            return res.render("signin",{
                error:"User Not Found"
            });
        }
        if (token.error === "Wrong Password!") {
            return res.render("signin",{
                error:"Incorrect Password, Try Again!"
            });
        }
        return res.cookie("token",token).render("signin",{
            success:"Login Successfull!"
        });

    } catch (err) {
        
        return res.redirect("/user/signin",{
            error:err.message
        });
    }
});

router.get("/signout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})


module.exports = router;