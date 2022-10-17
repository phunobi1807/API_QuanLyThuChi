import { Sequelize } from "sequelize";
 
const db = new Sequelize('quanlythuchi', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;