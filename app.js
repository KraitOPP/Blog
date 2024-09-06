require('dotenv').config()


const express = require("express");
const path = require("path");
const router = require("./routes/user")
const Blogrouter = require("./routes/blog")
const cookieParser = require("cookie-parser");


const app=express();
const {connectMongoDB} = require("./connection")
const { CheckforAuthCookie } = require("./middlewares/auth")
const Blog = require("./models/blog")

const PORT = process.env.PORT;

//Decode Form Data
//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(CheckforAuthCookie("token"));
// app.use(express.static(path.resolve("/assets")));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


//Connection
connectMongoDB(process.env.MONGO_URL)
    .then(()=> console.log("MongoDB Connected!"))
    .catch((err)=> console.log("Error Connecting MongoDB",err));

//Set View Engine
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


//Routes
app.use("/user",router);
app.use("/blog",Blogrouter);
app.get("/",async (req,res)=>{
    const Blogs = await Blog.find({}).populate("CreatedBy");

    return res.render("home",{
        user:req.user,
        Blogs: Blogs,
    })
});

//Listen Server
app.listen(PORT,()=> console.log(`Server is Running on PORT:${PORT}`));