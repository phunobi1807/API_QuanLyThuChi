import express from "express";
import { AddThuChi, getThuChi } from "../controllers/Thuchi";


const routerThuchi = express.Router();

routerThuchi.get("/thuchi", getThuChi);
routerThuchi.post("/thuchi/", AddThuChi);

export default routerThuchi;