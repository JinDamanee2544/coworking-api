const Space = require("../models/space");
const { isTimeBetween } = require("../utils/index");

exports.createSpace = async (req, res, next) => {
    const { name, address, tel, openTime, closeTime } = req.body;
    if(openTime>closeTime){
        return res.status(400).json({success:false,message:"Open time must come before close time"});
    }
    const space = await Space.create({
        name,
        address,
        tel,
        openTime,
        closeTime,
    });
    res.status(201).json({
        success: true,
        data: space,
    });
};

exports.getSpaces = async (req, res, next) => {
    const { startTime, endTime } = req.query;
    let spaces;

    if (req.user.role === "admin") {
        spaces = await Space.find().select("-__v");
    } else {
        spaces = await Space.find({}).select("-_id -__v");
    }

    if (!startTime || !endTime) {
        return res.status(200).json({
            success: true,
            count: spaces.length,
            data: spaces,
        });
    }

    const filtered = spaces.filter((space) => {
        return (
            isTimeBetween(space.openTime, space.closeTime, startTime) &&
            isTimeBetween(space.openTime, space.closeTime, endTime)
        );
    });
    res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
    });
};

exports.getSpaceByID = async (req, res, next) => {
    const spaceID = req.params.id;
    try {
        const space = await Space.findById(spaceID);
        res.status(200).json({
            success: true,
            data: space,
        });
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            success: false,
            message: "Space not found",
        });
    }
};

exports.updateSpace = async (req, res, next) => {
    const spaceID = req.params.id;
    const { name, address, tel, openTime, closeTime } = req.body;

    try {
        const space = await Space.findById(spaceID);
        if (!space)
            return res.status(404).json({
                success: false,
                message: "Space not found",
            });

        const newSpace = await Space.findByIdAndUpdate(
            spaceID,
            {
                name,
                address,
                tel,
                openTime,
                closeTime,
            },
            {
                runValidators: true,
                new: true,
            }
        );
        return res.status(200).json({
            success: true,
            data: newSpace,
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

exports.deleteSpace = async (req, res, next) => {
    const spaceID = req.params.id;
    try {
        const space = Space.findById(spaceID);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: "Space not found",
            });
        }
        await space.remove();
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
