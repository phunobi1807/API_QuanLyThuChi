import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Sequelize, Op, NUMBER } from "sequelize";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'code_number', 'fullname', 'phone_number', 'email', 'status']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getUserByPhone = async (req, res) => {
    const phone_number = req.params.phone_number;
    Users.findAll({
        where: {
            [Op.and]: [
                {
                    phone_number: {
                        [Op.like]: "%" + phone_number + "%"
                    }
                }
            ]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
}
export const getUserByCodeNumber = async (req, res) => {
    const code_number = req.params.code_number; 
    Users.findAll({
        where: {
            [Op.and]: [
                {
                    code_number: {
                        [Op.like]: "%" + code_number + "%"
                    }
                }
            ]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

export const getUserByEmail = async (req, res) => {
    const email = req.params.email; 
    Users.findAll({
        where: {
            [Op.and]: [
                {
                    email: {
                        [Op.like]: "%" + email + "%"
                    }
                }
            ]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

export const getUserByFullName = async (req, res) => {
    const fullname = req.params.fullname; 
    Users.findAll({
        where: {
            [Op.and]: [
                {
                    fullname: {
                        [Op.like]:"%" + fullname + "%"
                    }
                }
            ]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
}


export const Register = async (req, res) => {
    const { code_number, fullname, phone_number, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });
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
        res.json({ msg: "Register Successful" });
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                code_number: req.body.code_number
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user[0].id;
        const fullname = user[0].fullname;
        const userCode = user[0].code_number;
        const accessToken = jwt.sign({ userId, fullname, userCode }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, fullname, userCode }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "User code not true" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

