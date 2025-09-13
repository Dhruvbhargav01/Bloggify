const { validateToken } = require("../services/authentication");

function checkForAuthentication(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]; // here we used cookie parser
        
        if (!tokenCookieValue) {
            return next(); // ✅ added return to prevent further code execution
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {}

        return next();
    };
}

module.exports = { checkForAuthentication };
