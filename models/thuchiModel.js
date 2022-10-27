import { Sequelize } from "sequelize";
import db from "../config/database";

const {DataTypes} = Sequelize;

const Thuchi = db.define('thuchi', {
    title: {
        type: DataTypes.STRING
    },
    userID: {
        type: DataTypes.INTEGER
    },
    nhomID: {
        type: DataTypes.INTEGER
    },
    types: {
        type: DataTypes.BOOLEAN
    },
    sotien: {
        type: DataTypes.DOUBLE
    },
    time: {
        type: DataTypes.DATE
    },
    createAt: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Thuchi;