const express = require("express");
const {
    addReservation,
    deleteReservation,
    getReservation,
    getReservations,
    updateReservation,
} = require("../controllers/reservation");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middlewares/auth");

router.route("/").get(protect, getReservations).post(protect, addReservation);
router
    .route("/:id")
    .get(protect, getReservation)
    .put(protect, updateReservation)
    .delete(protect, deleteReservation);
module.exports = router;
