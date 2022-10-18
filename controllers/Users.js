import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
 
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','code_number','fullname', 'phone_number', 'email', 'status']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getUserByCodeNumber = async(req, res) =>{
    try {
        const response = await Users.findOne({
            where:{
                code_number: req.params.code_number
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// export const getUserByFullName = async(req, res) =>{
//     try {
//         const response = await Users.findOne({
//             where:{
//                 fullname: req.params.fullname
//             }
//         });
//         res.status(200).json(response);
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// export const getUserById = async (req, res) => {
//     try {
//         const user = await Users.findOne({
//             where: {
//                 id: req.params.id,
//                 // code_number: req.params.code_number,
//                 // phone_numer: req.params.phone_numer,
//                 // email: req.params.email
//             }
//         });
//         res.json(user);
//     } catch(error) {
//         res.json({ message: error.message });
//     }
// }
// export const getUserByEmail = async (req, res) => {
//     try {
//         const user = await Users.findAll({
//             where: {
//                 email: req.params.email,
//             }
//         });
//         res.json(user[0]);
//     } catch(error) {
//         res.json({ message: error.message });
//     }
// }
// export const getUserByName = async (req, res) => {
//     try {
//         const user = await Users.findAll({
//             where: {
//                 fullname: req.params.fullname,
//             }
//         });
//         res.json(user[0]);
//     } catch(error) {
//         res.json({ message: error.message });
//     }
// }

export const Register = async(req, res) => {
    const { code_number, fullname, phone_number ,email , password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            code_number: code_number,
            fullname: fullname,
            email: email,
            phone_number: phone_number,
            password: hashPassword
        });
        res.json({msg: "Register Successful"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                code_number: req.body.code_number
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const fullname = user[0].fullname;
        const userCode = user[0].code_number;
        const accessToken = jwt.sign({userId, fullname, userCode}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, fullname, userCode}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"User code not true"});
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}