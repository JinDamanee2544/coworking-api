const {
    createSpace,
    getSpaceByID,
    getSpaces,
    updateSpace,
    deleteSpace,
} = require("../controllers/space");

const express = require("express");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
    .get("/", protect, getSpaces)
    .post("/", protect, authorize("admin"), createSpace);

router
    .get("/:id", protect, getSpaceByID)
    .put("/:id", protect, authorize("admin"), updateSpace)
    .delete("/:id", protect, authorize("admin"), deleteSpace);

module.exports = router;
