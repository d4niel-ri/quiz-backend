const express = require('express');
const { login, getAllUser, register, changePassword, createAdmin, 
        deleteUser, changeProfile, getUser, forgotPassword, resetPassword, verifyToken, getMyUserData } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');
const { confirmation } = require('../middlewares/confirmation');
const { upload } = require('../middlewares/storage');

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", authenticate, authorize([1]), getAllUser);
router.get("/my-data", authenticate, getMyUserData);
router.get("/:id", getUser);

router.use(authenticate);
router.post("/verify-token", verifyToken);
router.put("/", upload.single('image'), changeProfile);
router.put("/change-password", changePassword);
router.post("/create-admin", authorize([1]), createAdmin);
router.delete("/delete-user/:id", authorize([1]), confirmation, deleteUser);

module.exports = router;