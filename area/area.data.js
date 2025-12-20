const { runQuery } = require("../conexion/utils.js");

class AreaData {

  static dataGuardarArea = async (objData) => {
    try {
      // console.log('dataGuardarArea');
      // console.log(objData);
      let arr = [];
      let query = "INSERT INTO Area VALUES (0,?,?,?,?,NOW(),NOW(),1);";
      arr.push(objData.descripcion);
      arr.push(objData.nota);
      arr.push(objData.idUsuario);
      arr.push(objData.idEmpresa);
      const resp = await runQuery(query, arr);

      return resp;
    } catch (err) {
      console.log("dataGuardarArea err");
      console.log(err);
    }
  };

  static dataObtenerListaArea = async (objData) => {
    try {
      // console.log('dataObtenerListaArea');
      // console.log(objData);
      let arr = [];
      let query = "SELECT id, descripcion, nota, fechaProceso " +
        " FROM Area " +
        " WHERE idEmpresa = ? AND habilitado = 1 ;";
      arr.push(objData.idEmpresa);
      const resp = await runQuery(query, arr);

      return resp;
    } catch (err) {
      console.log("dataObtenerListaArea err");
      console.log(err);
    }
  };

  static dataModificarArea = async (objData) => {
    try {
      console.log('dataModificarArea');
      console.log(objData);
      let arr = [];
      let query = " UPDATE Area " +
        " SET " +
        " descripcion = ?, " +
        " nota = ?, " +
        " idUsuario = ?, " +
        " fechaProceso = NOW() " +
        " WHERE idEmpresa = ? AND id = ? ;";
      arr.push(objData.descripcion);
      arr.push(objData.nota);
      arr.push(objData.idUsuario);
      arr.push(objData.idEmpresa);
      arr.push(objData.id);
      const resp = await runQuery(query, arr);

      return resp;
    } catch (err) {
      console.log("dataModificarArea err");
      console.log(err);
    }
  };

  static dataDeshabilitarArea = async (objData) => {
    try {
      // console.log('dataDeshabilitarArea');
      // console.log(objData);
      let arr = [];
      let query = " UPDATE Area " +
        " SET " +
        " habilitado = 0, " +
        " idUsuario = ?, " +
        " fechaProceso = NOW() " +
        " WHERE idEmpresa = ? AND id = ? ;";
      arr.push(objData.idUsuario);
      arr.push(objData.idEmpresa);
      arr.push(objData.id);
      const resp = await runQuery(query, arr);

      return resp;
    } catch (err) {
      console.log("dataDeshabilitarArea err");
      console.log(err);
    }
  };

}

module.exports = AreaData;
