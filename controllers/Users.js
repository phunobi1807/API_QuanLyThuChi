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

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(user[0]);
    } catch(error) {
        res.json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    const { fullname, phone_number, email, status } = req.body;
    // if (password !== confPassword) return res.status(400).json({ msg: "Mật khẩu không trùng khớp, vui lòng nhập lại !" });
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.genSalt(); //note

    const hashPassword = await bcrypt.hash(password, salt); //note

    const  makeUserCode = (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
       
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
       
        return text;
      }
      
    try {
        await Users.create({
            code_number: makeUserCode(6),
            fullname: fullname,
            email: email,
            phone_number: phone_number,
            password: hashPassword,
            password_txt: password,
            salt: salt,
            status: status
        });
        res.json({ msg: "Tạo người dùng thành công" });
    } catch (error) {
        console.log(error);
    }
}
 
export const updateUsers = async (req, res) => {
    try {
        await Users.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Users Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}


export const deleteUsers = async (req, res) => {
    try {
        await Users.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Users Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
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




export const Login = async (req, res) => {
    const {code_number, password} = req.body;
    try {
        const user = await Users.findAll({
            where: {
                code_number: code_number
            }
        });
        if(user[0].status === true) {
            const hashPassword = await bcrypt.hash(password, user[0].salt); //note
            const match = await bcrypt.compare(hashPassword, user[0].password); //note
            console.log(typeof hashPassword);
            console.log(typeof user[0].password);
        if (!match) return res.status(400).json({ msg: "Sai mật khẩu, vui lòng nhập lại !" });
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
        } else  {
            res.status(404).json({msg: "Tài khoản không được phép đăng nhập"})
        }
    } catch (error) {
        res.status(404).json({ msg: "Mã đăng nhập không đúng" });
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


