const Reservation = require("../models/reservation");
const Space = require("../models/space");
const { isTimeBetween, isOverlap, timeToInt } = require("../utils/index");
exports.getReservations = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: "space",
            select: "name province tel",
        });
    } else {
        query = Reservation.find().populate({
            path: "space",
            select: "name province tel",
        });
    }
    try {
        const reservations = await query;
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Reservation" });
    }
};
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: "space",
            select: "name description tel",
        });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservations with the id of ${req.params.id}`,
            });
        }
        res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find reservation" });
    }
};
exports.addReservation = async (req, res, next) => {
    try {
        req.body.space = req.params.spaceId;
        req.body.resvDate = new Date(req.body.resvDate);
        const space = await Space.findById(req.params.spaceId);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: `No space with the id of ${req.params.spaceId}`,
            });
        }
        if (timeToInt(req.body.startTime) > timeToInt(req.body.endTime)) {
            return res.status(400).json({
                success: false,
                message: "You can only reserve start time before end time",
            });
        }
        if (
            !isTimeBetween(
                space.openTime,
                space.closeTime,
                req.body.startTime,
                req.body.endTime
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You can only reserve time when Co-Working space is open",
            });
        }
        req.body.user = req.user.id;
        const existedReservations = await Reservation.find({
            user: req.user.id,
        });
        if (existedReservations.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`,
            });
        }
        const allReservations = await Reservation.find();
        for (let i = 0; i < allReservations.length; i++) {
            const id = allReservations[i].space._id.toString();
            if (
                allReservations[i].resvDate.toDateString() ==
                    req.body.resvDate.toDateString() &&
                id === req.body.space.toString() &&
                isOverlap(
                    req.body.startTime,
                    req.body.endTime,
                    allReservations[i].startTime,
                    allReservations[i].endTime
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot reserve with time overlap to other reservations",
                });
            }
        }
        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "Cannot create reservation" });
    }
};
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);
        req.body.resvDate = new Date(req.body.resvDate);
        const space = await Space.findById(req.body.space);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: `No space with the id of ${req.body.space}`,
            });
        }
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`,
            });
        }
        if (
            reservation.user._id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`,
            });
        }
        if (timeToInt(req.body.startTime) > timeToInt(req.body.endTime)) {
            return res.status(400).json({
                success: false,
                message: "You can only reserve start time before end time",
            });
        }
        if (
            !isTimeBetween(
                space.openTime,
                space.closeTime,
                req.body.startTime,
                req.body.endTime
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You can only reserve time when Co-Working space is open",
            });
        }
        const allReservations = await Reservation.find();
        for (let i = 0; i < allReservations.length; i++) {
            const id = allReservations[i].space._id.toString();
            if (
                allReservations[i]._id !== req.params.id &&
                allReservations[i].resvDate.toDateString() ==
                    req.body.resvDate.toDateString() &&
                id === req.body.space.toString() &&
                isOverlap(
                    req.body.startTime,
                    req.body.endTime,
                    allReservations[i].startTime,
                    allReservations[i].endTime
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot reserve with time overlap to other reservations",
                });
            }
        }
        reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "Cannot update reservation" });
    }
};
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`,
            });
        }
        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this bootcamp`,
            });
        }
        await reservation.remove();
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "Cannot delete reservation" });
    }
};
