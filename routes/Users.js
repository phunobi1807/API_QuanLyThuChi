import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { createUser, deleteUsers, getUserByPhone, getUsers, Login, Logout, updateUsers } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const routerUsers = express.Router();

routerUsers.get("/users",verifyToken ,getUsers);
routerUsers.post("/users/" , createUser);
routerUsers.patch('/users/:id', updateUsers);
routerUsers.delete('/users/:id', deleteUsers);



routerUsers.get("/users/search", getUserByPhone); // HERE



routerUsers.post("/login", Login);
routerUsers.get("/token", refreshToken);
routerUsers.delete("/logout", Logout);


export default routerUsers;