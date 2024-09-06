const jwt = require("jsonwebtoken");

const secret = "$kRa&t$p";

function generateTokenForUser(user){
    const payload = {
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role
    }
    const token = jwt.sign(payload,secret);
    return token;
}

function validateToken(token){
    const user = jwt.verify(token,secret);
    return user;
}

module.exports = {
    generateTokenForUser,
    validateToken
}