const mongoose = require("mongoose");
const { createHmac,randomBytes } = require('crypto');
const {generateTokenForUser} = require("../services/auth")

const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
        // required:true
    },
    ProfileImageURL:{
        type:String,
        default:"../assets/avatar.png"
    },
    role:{
        type:String,
        enum:["ADMIN", "USER"],
        default:"USER"
    }
},{timestamps:true});

UserSchema.pre("save",function (next){
    const user = this;
    if(!user.isModified('password')) return next();
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
            .update(user.password)
            .digest('hex');
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

UserSchema.static("matchPasswordandGenerateToken", async function (email, password) {
    const user = await this.findOne({ email: email });
    if (!user) {
        return { error: "User Not Found!" };
    }

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHash) {
        return { error: "Wrong Password!" };
    }

    const token = generateTokenForUser(user);
    return token;
});


const USER = mongoose.model("user",UserSchema);

module.exports = USER;