const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        surname: {
            type: String,
            required: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        score: {
            type: Array,
            default: [0, 0, 0, 0, 0, 0, 0, 0],        
        },
        avatar: {
            avatarIdx: {
                type: Number,
                default: 0
            },
            avatarColor: {
                type: String,
                default: '#000',
                trim: true
            }
        },
        // our seesion token (with jwt)
        token: {
            type: String,
            trim: true
        },
        // google user id - to check if user exist on login request
        googleUserId: {
            type: String,
            required: true,
            trim: true
        }
    },
);


userSchema.query.byGoogleUserId = function(userId) {
    return this.where({ googleUserId: new RegExp(userId, 'i') });
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign(
        { googleUserId: user.googleUserId },
        process.env.JWT_SECRET,
        {expiresIn: "30d"}
    );
    user.token = token;

    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;