const { deleteUser, getAlluser, updateUser } = require("../controllers/user");

const { Router } = require("express");
const router = Router();

router.get("/", getAlluser).delete("/:id", deleteUser).put("/:id", updateUser);

module.exports = router;
