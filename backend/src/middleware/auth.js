const jwt = require("jsonwebtoken");
const User = require("../models/user");

// authenticate our session token
const auth = async (req, res, next) => {
    try {
        // on every request we should add header field named Authorization with Bearer: session_token
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // check if user with the _id and token exists!
        const user = await User.findOne({
            googleUserId: decoded.googleUserId,
            "token": token
        });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: new Error("Authentication failed") });
    }
};


// authenticate our session token
const optional_auth = async (req, res, next) => {
    if (req.header("Authorization")) {
        auth(req, res, next);
    }
    else {
        next();
    }
};

module.exports = { auth, optional_auth };