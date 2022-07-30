const express = require('express')
const router = new express.Router();
const UserModel = require("../models/user");
const { auth } = require("../middleware/auth");
const googleAuth = require("../middleware/googleAuth");

// ------------------------------------ GET ------------------------------------
router.get("/me", auth, async (req, res) => {
    const userInfo = {
        fullname: req.user.fullname,
        score: req.user.score,
        avatar: req.user.avatar
    }
    res.send(userInfo);
});

// ------------------------------------ POST ------------------------------------
router.post("/login", googleAuth, async (req, res) => {

    try {
        let user = await UserModel.findOne().byGoogleUserId(req.googleUserId);
        if (!user) { // create new user
            user = new UserModel({
                firstname: req.payload.given_name,
                surname: req.payload.family_name,
                fullname: req.payload.name,
                email: req.payload.email,
                googleUserId: req.googleUserId
            });
        }
        const token = await user.generateAuthToken();
        await user.save();
        // in the front end we must save this token with AsyncStorage. 
        // than we must append this token to every request that uses auth as middleware (see format in auth.js).
        res.status(201).send(user);

    }
    catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.post("/logout", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne().byGoogleUserId(req.user.googleUserId);
        if (user) {
            user.token = "";
            await user.save();
        }

        res.send({status: "LOGGED OUT"});
    } catch (e) {
        res.status(500).send();
    }
});

// ------------------------------------ PATCH ------------------------------------
router.patch("/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["avatar", "score"];
    const isValidParams = updates.every(update =>
        allowedUpdates.includes(update)
    );

    if (!isValidParams) {
        return res.status(500).send({ error: "Invalid Updates" });
    }
    try {
        updates.forEach(update => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = router;