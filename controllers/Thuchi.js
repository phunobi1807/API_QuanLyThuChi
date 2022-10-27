import Thuchi from "../models/thuchiModel";
import { Sequelize, Op, NUMBER } from "sequelize";

export const getThuChi = async (req, res) => {
    try {
        const thuchi = await Thuchi.findAll({
            attributes: ['id', 'title', 'userID','nhomID', 'types', 'sotien', 'time']
        });
        res.json(thuchi);
    } catch (error) {
        console.log(error);
    }
}

export const AddThuChi = async(req, res) =>{
    try {
        await User.create(req.body);
        res.status(201).json({msg: "User Created"});
    } catch (error) {
        console.log(error.message);
    }
}