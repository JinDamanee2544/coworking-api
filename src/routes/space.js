const {
    createSpace,
    getSpace,
    getSpaces,
    updateSpace,
    deleteSpace,
} = require("../controllers/space");

const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const reservationRouter = require("./reservation");
const router = express.Router();

router.use("/:spaceId/reservations", reservationRouter);
router
    .get("/", protect, getSpaces)
    .post("/", protect, authorize("admin"), createSpace);

router
    .get("/:id", protect, getSpace)
    .put("/:id", protect, authorize("admin"), updateSpace)
    .delete("/:id", protect, authorize("admin"), deleteSpace);

module.exports = router;
