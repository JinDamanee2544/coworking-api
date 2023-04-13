const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token || token == "null") {
        return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "User role not authorized to access this route",
            });
        }
        next();
    };
};
