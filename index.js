import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database";
import routerUsers from "./routes/Users";
import routerThuchi from "./routes/thuchiRoutes";
import Users from "./models/UserModel";
import Thuchi from "./models/thuchiModel";
dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database connected...');
    await Users.sync();
    await Thuchi.sync();
} catch (error) {
    console.error('Connection error:', error);
}

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(cors({ credentials:true, origin:true }));
app.use(cookieParser());
app.use(express.json());
app.use(routerUsers, routerThuchi);
// app.use(routerThuchi);
app.listen(8080, () => console.log('Server running at http://localhost:8080'));