import { Sequelize } from "sequelize";
import db from "../config/database";

const {DataTypes} = Sequelize;

const Users = db.define('users', {
    code_number: {
        type: DataTypes.STRING
    },
    fullname: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.BIGINT
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    password_txt: {
        type: DataTypes.STRING
    },
    salt: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    refresh_token: {
        type: DataTypes.TEXT
    },  
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Users;