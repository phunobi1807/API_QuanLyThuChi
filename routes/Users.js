import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { createUser, deleteUsers, forgotPassword, getUserByPhone, getUsers, Login, Logout, resetPassword, updateUsers } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const routerUsers = express.Router();

routerUsers.get("/users", verifyToken ,getUsers);
routerUsers.post("/users/" , createUser);
routerUsers.patch('/users/:id', updateUsers);
routerUsers.delete('/users/:id', deleteUsers);
routerUsers.get("/users/search", getUserByPhone); // HERE
routerUsers.post("/login", Login);
routerUsers.post("/forgot-password", forgotPassword);
routerUsers.patch("/reset-password/:email", resetPassword);
routerUsers.get("/token", refreshToken);
routerUsers.delete("/logout", Logout);



export default routerUsers;