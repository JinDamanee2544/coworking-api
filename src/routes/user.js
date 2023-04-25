const { deleteUser, getUsers, updateUser } = require("../controllers/user");

const { Router } = require("express");
const { authorize, protect } = require("../middlewares/auth");
const router = Router();

router.route("/").get(protect, authorize("admin"), getUsers);

router
    .route("/:id")
    .delete(protect, authorize("admin"), deleteUser)
    .put(protect, authorize("admin"), updateUser);

module.exports = router;
