import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Sequelize, Op, NUMBER } from "sequelize";
import { refreshToken } from "./RefreshToken.js";


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


export const createUser = async (req, res) => {
    const { fullname, phone_number, email, status } = req.body;
    // if (password !== confPassword) return res.status(400).json({ msg: "Mật khẩu không trùng khớp, vui lòng nhập lại !" });
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.genSalt(10); //note

    const hashPassword = await bcrypt.hash(password, salt); //note

    const makeUserCode = (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    try {
        const user = await Users.findAll({
            where: {
                email: email,
                phone_number: phone_number
            }
        })
        if (email === user[0]?.email) return res.status(400).json({ msg: "Email đã tồn tại, vui lòng sử dụng email khác" });


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
        res.status(404).json({ msg: "Số điện thoại và email đã tồn tại" })
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
    const { query } = req.query;
    console.log(query);
    Users.findAll({
        attributes: ['id', 'code_number', 'fullname', 'phone_number', 'email', 'status'],
        where: {
            [Op.or]: [
                { id: { [Op.like]: `%${query}%` } },
                { code_number: { [Op.like]: `%${query}%` } },
                { fullname: { [Op.like]: `%${query}%` } },
                { phone_number: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } }

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
    const { code_number, password } = req.body;
    try {
        const user = await Users.findAll({
            where: {
                code_number: code_number
            }
        });
        if (user[0].status === true) {
            // const hashPassword = await bcrypt.hash(password, user[0].salt); //note
            const match = await bcrypt.compare(password, user[0].password); //note
            console.log(user[0].password);
            console.log(password);
            console.log(match);
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
        } else {
            res.status(404).json({ msg: "Tài khoản không được phép đăng nhập" })
        }
    } catch (error) {
        res.status(404).json({ msg: "Mã đăng nhập không đúng hoặc tài khoản không được phép đăng nhập ! " });
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

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                email: email
            }
        });
        if (!user) return res.json({ msg: "Email khong dung" });

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "phunobi1807@gmail.com",
                pass: "njreccjobvgbmzdc",
            },
        });
        await transporter.sendMail({
            from: "phunobi1807@gmail.com",
            to: `${email}`,
            subject: "Vui lòng nhấn vào link để đổi mật khẩu",
            text: `Mật khẩu cũ của bạn là  ${user.password_txt} \nVui lòng ấn vào link http://localhost:8080/reset-password/${email} để đổi mật khẩu`,
        });
        res.status(200).json(user[0]);
    } catch (error) {
        res.status(404).json({ msg: "Error" });
    }
}
// text: 'To reset your password, please click the link below.\n\nhttps://'+process.env.DOMAIN+'/user/reset-password?token='+encodeURIComponent(token)+'&email='+req.body.email

export const resetPassword = async (req, res) => {
    const { email } = req.params;
    const { oldPassword, newPassword, confNewPassword } = req.body;
    if (newPassword !== confNewPassword) return res.status(400).json({ msg: "Mật khẩu xác nhận không trùng khớp, vui lòng nhập lại" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt); //note
    try {
        await Users.update({
            password: hashPassword,
            password_txt: newPassword,
            salt: salt,
        }, {
            where: {
                email: email,
            }
        });
        res.json({
            "message": "Đổi mật khẩu thành công"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}