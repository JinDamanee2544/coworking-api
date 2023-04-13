const { Error } = require("mongoose");
const User = require("../models/User");

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, tel } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role,
            tel,
        });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.log(err.stack);
        if (err?.code === 11000) {
            return res.status(400).json({
                message: "Duplicated Email",
            });
        }
        if (err instanceof Error.ValidationError) {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({
                message: messages.join(","),
            });
        }
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide an email and password",
        });
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        sendTokenResponse(user, 201, res);
    } catch {
        res.status(401).json({
            success: false,
            msg: "Cannot convert email or password to string",
        });
    }
};

exports.logout = async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ message: "Logged out" });
};

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ data: user });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // in milliseconds
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        // for frontend
        // _id: user._id,
        // name: user.name,
        // email: user.email,
    });
};
