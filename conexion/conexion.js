const mysql = require("mysql");

const conexion = mysql.createPool({
  connectionLimit: 16,
  host: "10.142.0.11",
  //host: "127.0.0.1",
  user: "userchecklist",
  password: "UserCheck1*",
  database: "bd_checklist",
  //timeout: 240000,
  multipleStatements: true,
});

module.exports = {
  conexion,
};