const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password must have length 4 or more"],
        minlength: 4,
    },
    tel: {
        type: String,
        required: [true, "Please provide a telephone"],
        validate: [validator.isMobilePhone, "Please provide a valid telephone"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

UserSchema.pre("save", async function (next) {
    const password = this.password;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
}
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", UserSchema);
