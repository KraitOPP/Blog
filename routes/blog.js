const {Router} = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();


const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, path.resolve(`./assets/blog`))
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage })


router.get("/add-new",(req,res)=>{
    return res.render("addnewBlog",{
        user:req.user,
    });
});

router.post("/add-new",upload.single("coverImageUrl"),async(req,res)=>{
    const {Title, Body} = req.body;
    const blog = await Blog.create({
        Title,
        Body,
        CreatedBy:req.user._id,
    });
    if(req.file){
        await Blog.findOneAndUpdate(
            { _id: blog._id },
            { $set: { coverImageUrl: `/assets/blog/${req.file.filename}` } }
        );
    }
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:id",async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        CreatedBy:req.user._id,
        BlogID:req.params.id,
    });
    return res.redirect(`/blog/${req.params.id}`);
})

router.get("/:id",async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("CreatedBy");
    const comments = await Comment.find({BlogID:req.params.id}).populate("CreatedBy");
    if(!blog) return res.redirect("/");
    return res.render("blog",{
        user:req.user,
        blog:blog,
        comments,
    });
})

module.exports = router