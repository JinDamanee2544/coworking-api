const { Error } = require("mongoose");
const User = require("../models/User");

exports.getAlluser = async (req, res) => {
    const users = await User.find({}).select("name email tel role");
    return res.status(200).json({
        count: users.length,
        data: users,
    });
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await user.remove();
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password, tel, role } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const newUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                password,
                tel,
                role,
            },
            {
                runValidators: true,
                new: true,
            }
        );
        return res.status(200).json({
            success: true,
            data: newUser,
        });
    } catch (err) {
        console.log(err.message);
        if (err instanceof Error.ValidationError) {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({
                success: false,
                message: messages.join(","),
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
