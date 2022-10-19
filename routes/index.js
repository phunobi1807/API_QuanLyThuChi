import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { getUserByCodeNumber, getUserByEmail, getUserByFullName, getUserByPhone, getUsers, Login, Logout, Register } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const router = express.Router();

router.get("/users" ,getUsers);
router.get("/users/phoneNumber/:phone_number", getUserByPhone); // HERE
router.get("/users/codeNumber/:code_number", getUserByCodeNumber); // HERE
router.get("/users/searchEmail/:email", getUserByEmail); // HERE
router.get("/users/searchFullName/:fullname", getUserByFullName); // HERE
router.post('/users', Register);
// router.post('/users/reset_password', ResetPassword);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);


export default router;