const AreaData = require("./area.data");

class AreaStore {

  static storeGuardarArea = async (objData) => {
    try {
      const resp = await AreaData.dataGuardarArea(objData);
      return resp[2];
    } catch (e) {
      return false;
    }
  };

  static storeObtenerListaArea = async (objData) => {
    try {
      const resp = await AreaData.dataObtenerListaArea(objData);
      return resp;
    } catch (e) {
      return false;
    }
  };

  static storeModificarArea = async (objData) => {
    try {
      const resp = await AreaData.dataModificarArea(objData);
      return resp;
    } catch (e) {
      return false;
    }
  };

  static storeDeshabilitarArea = async (objData) => {
    try {
      const resp = await AreaData.dataDeshabilitarArea(objData);
      return resp;
    } catch (e) {
      return false;
    }
  };

}

module.exports = AreaStore;
