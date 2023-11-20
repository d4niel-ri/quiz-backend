const express = require('express');
const { login, getAllUser, register, changePassword, createAdmin, 
        deleteUser, changeProfile, getUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');
const { confirmation } = require('../middlewares/confirmation');

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", authenticate, authorize([1]), getAllUser);
router.get("/:id", getUser);

router.use(authenticate);
router.put("/", changeProfile);
router.put("/change-password", changePassword);
router.post("/create-admin", authorize([1]), createAdmin);
router.delete("/delete-user/:id", authorize([1]), confirmation, deleteUser);

module.exports = router;