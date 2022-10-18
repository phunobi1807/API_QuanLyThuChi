import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { getUserByCodeNumber, getUsers, Login, Logout, Register } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const router = express.Router();

router.get("/users" ,getUsers);
router.get("/users/:id", getUserByCodeNumber); // HERE
router.post('/users', Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);


export default router;