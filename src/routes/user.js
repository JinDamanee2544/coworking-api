const { deleteUser, getAlluser, updateUser } = require("../controllers/user");

const { Router } = require("express");
const { authorize, protect } = require("../middlewares/auth");
const router = Router();

router.get("/", protect, authorize("admin"), getAlluser);

router
    .delete("/:id", protect, authorize("admin"), deleteUser)
    .put("/:id", protect, authorize("admin"), updateUser);

module.exports = router;
