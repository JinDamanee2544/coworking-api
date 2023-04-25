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
    .route("/")
    .get(protect, getSpaces)
    .post(protect, authorize("admin"), createSpace);

router
    .route("/:id")
    .get(protect, getSpace)
    .put(protect, authorize("admin"), updateSpace)
    .delete(protect, authorize("admin"), deleteSpace);

module.exports = router;
