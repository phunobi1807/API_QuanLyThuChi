import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database";
import router from "./routes";
import Users from "./models/UserModel";
dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database connected...');
    await Users.sync();
} catch (error) {
    console.error('Connection error:', error);
}

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// }

// app.use(allowCrossDomain);
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.listen(8080, () => console.log('Server running at http://localhost:8080'));