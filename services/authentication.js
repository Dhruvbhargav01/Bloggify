const JWT = require("jsonwebtoken");

const secret = "$hriR@m123";

// creation of token
function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    }

    const token = JWT.sign(payload, secret);
    return token;
}

// varification of token

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}