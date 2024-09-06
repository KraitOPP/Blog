const {validateToken} = require("../services/auth");

function CheckforAuthCookie(cookieName){
    return (req,res,next) =>{
        const cookieValue = req.cookies[cookieName];
        if(!cookieValue){
            return next();
        }
        
        try {
            const UserPayload = validateToken(cookieValue);
            req.user = UserPayload;
        } catch (error) {
            
        }
        return next();
    }
}

module.exports = {
    CheckforAuthCookie,
}