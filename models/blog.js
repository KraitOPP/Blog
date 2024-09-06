const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    Body:{
        type:String,
        required:true,
    },
    coverImageUrl:{
        type:String,
        required:false,
        default:"/assets/cover.jpg"
    },
    CreatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
},{timestamps:true});

const Blog = mongoose.model("Blog",BlogSchema);

module.exports = Blog;