import express from "express";
import { refreshToken } from "../controllers/RefreshToken";
import { createUser, deleteUsers, getUserByCodeNumber, getUserByEmail, getUserByFullName, getUserById, getUserByPhone, getUsers, Login, Logout, updateUsers } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";

const routerUsers = express.Router();

routerUsers.get("/users" ,getUsers);
routerUsers.get("/users/:id" ,getUserById);
routerUsers.post("/users/" , createUser);
routerUsers.patch('/users/:id', updateUsers);
routerUsers.delete('/users/:id', deleteUsers);
routerUsers.get("/users/searchPhoneNumber/:phone_number", getUserByPhone); // HERE
routerUsers.get("/users/searchCodeNumber/:code_number", getUserByCodeNumber); // HERE
routerUsers.get("/users/searchEmail/:email", getUserByEmail); // HERE
routerUsers.get("/users/searchFullName/:fullname", getUserByFullName); // HERE
// router.post('/users/reset_password', ResetPassword);
routerUsers.post("/login", Login);
// router.post("/users/changePassword/:codenumber", ChangePassword);
routerUsers.get("/token", refreshToken);
routerUsers.delete("/logout", Logout);


export default routerUsers;