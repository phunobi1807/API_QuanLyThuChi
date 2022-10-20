import { Sequelize } from "sequelize";
import db from "../config/database";

const {DataTypes} = Sequelize;

const Thuchi = db.define('thuchi', {
    noidungthuchi: {
        type: DataTypes.STRING
    },
    sotienthu: {
        type: DataTypes.BIGINT
    },
    sotienchi: {
        type: DataTypes.BIGINT
    },
    nhomthuchi: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Thuchi;