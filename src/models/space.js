const mongoose = require("mongoose");
const validator = require("validator");

const SpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    tel: {
        type: String,
        required: [true, "Please provide a telephone"],
        validate: [validator.isMobilePhone, "Please provide a valid telephone"],
    },
    openTime: {
        type: String,
        required: [true, "Please provide an open time"],
        validator: [validator.isTime, "Please provide a valid time"],
    },
    closeTime: {
        type: String,
        required: [true, "Please provide a close time"],
        validator: [validator.isTime, "Please provide a valid time"],
    },
});

module.exports = mongoose.model("Space", SpaceSchema);
