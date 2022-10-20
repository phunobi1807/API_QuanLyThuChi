import Thuchi from "../models/thuchiModel";
import { Sequelize, Op, NUMBER } from "sequelize";

export const getThuChi = async (req, res) => {
    try {
        const thuchi = await Thuchi.findAll({
            attributes: ['id', 'noidungthuchi', 'sotienthu','sotienchi', 'nhomthuchi']
        });
        res.json(thuchi);
    } catch (error) {
        console.log(error);
    }
}