import express from "express";
import { getThuChi } from "../controllers/Thuchi";


const routerThuchi = express.Router();

routerThuchi.get("/thuchi", getThuChi);

export default routerThuchi;