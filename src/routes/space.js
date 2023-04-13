const {
    createSpace,
    getSpaceByID,
    getSpaces,
    updateSpace,
    deleteSpace,
} = require("../controllers/space");

const express = require("express");

const router = express.Router();

router
    .get("/", getSpaces)
    .post("/", createSpace)
    .get("/:id", getSpaceByID)
    .put("/:id", updateSpace)
    .delete("/:id", deleteSpace);

module.exports = router;
