import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { changePassword, createUser, deleteUsers, getSendMail, getUserByPhone, getUsers, Login, Logout, updateUsers } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const routerUsers = express.Router();

routerUsers.get("/users" ,getUsers);
routerUsers.post("/users/" , createUser);
routerUsers.patch('/users/:id', updateUsers);
routerUsers.delete('/users/:id', deleteUsers);
routerUsers.get("/users/search", getUserByPhone); // HERE
routerUsers.post("/login", Login);
routerUsers.post("/sendMail", getSendMail);
routerUsers.post("/changePassword", changePassword);
routerUsers.get("/token", refreshToken);
routerUsers.delete("/logout", Logout);



export default routerUsers;