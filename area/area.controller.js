const { STRING_SUCCESS, STRING_FAILURE } = require("../utils/const-string.js");
const AreaStore = require("./area.store.js");

const controllerGuardarArea = async (req, res) => {
  try {
    let body = req.body;
    const { token } = req.user;
    const idEmpresa = token.idEmpresa;
    const idUsuario = token.idUsuario;
    if (idEmpresa === undefined || idEmpresa === null || String(idEmpresa).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID EMP",
      });
    }
    if (idUsuario === undefined || idUsuario === null || String(idUsuario).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID USU",
      });
    }
    if (body.descripcion === undefined || body.descripcion === null || String(body.descripcion).trim().length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR DESC",
      });
    }
    if (body.nota === undefined) {
      body.nota = null;
    }
    if (body.nota !== undefined && body.nota !== null && String(body.nota).length > 0) {
      body.nota = String(body.nota).trim();
    }

    let objData = {};
    objData.idUsuario = idUsuario;
    objData.idEmpresa = idEmpresa;
    objData.descripcion = String(body.descripcion).trim();
    objData.nota = body.nota;

    const resp = await AreaStore.storeGuardarArea(objData);
    if (resp) {
      return res.status(200).send({
        code: STRING_SUCCESS,
        message: "controllerGuardarArea was succesful",
        body: {
          id: resp,
        },
      });
    }

    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  } catch (err) {
    console.log("controllerGuardarArea err");
    console.log(err);
    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  }
};

const controllerObtenerListaArea = async (req, res) => {
  try {
    // const body = req.body;
    const { token } = req.user;
    const idEmpresa = token.idEmpresa;
    const idUsuario = token.idUsuario;
    if (idEmpresa === undefined || idEmpresa === null || String(idEmpresa).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID EMP",
      });
    }
    if (idUsuario === undefined || idUsuario === null || String(idUsuario).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID USU",
      });
    }

    let objData = {};
    objData.idUsuario = idUsuario;
    objData.idEmpresa = idEmpresa;

    const resp = await AreaStore.storeObtenerListaArea(objData);
    if (resp) {
      return res.status(200).send({
        code: STRING_SUCCESS,
        message: "controllerObtenerListaArea was succesful",
        body: resp
      });
    }

    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  } catch (err) {
    console.log("controllerObtenerListaArea err");
    console.log(err);
    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  }
};

const controllerModificarArea = async (req, res) => {
  try {
    let body = req.body;
    const { token } = req.user;
    const idEmpresa = token.idEmpresa;
    const idUsuario = token.idUsuario;
    if (idEmpresa === undefined || idEmpresa === null || String(idEmpresa).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID EMP",
      });
    }
    if (idUsuario === undefined || idUsuario === null || String(idUsuario).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID USU",
      });
    }
    if (body.descripcion === undefined || body.descripcion === null || String(body.descripcion).trim().length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR DESC",
      });
    }
    if (body.nota === undefined) {
      body.nota = null;
    }
    if (body.nota !== undefined && body.nota !== null && String(body.nota).length > 0) {
      body.nota = String(body.nota).trim();
    }

    let objData = {};
    objData.idUsuario = idUsuario;
    objData.idEmpresa = idEmpresa;
    objData.id = body.id;
    objData.descripcion = String(body.descripcion).trim();
    objData.nota = body.nota;

    const resp = await AreaStore.storeModificarArea(objData);
    if (resp) {
      return res.status(200).send({
        code: STRING_SUCCESS,
        message: "controllerModificarArea was succesful",
        // body: resp
      });
    }

    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  } catch (err) {
    console.log("controllerModificarArea err");
    console.log(err);
    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  }
};

const controllerDeshabilitarArea = async (req, res) => {
  try {
    const body = req.body;
    const { token } = req.user;
    const idEmpresa = token.idEmpresa;
    const idUsuario = token.idUsuario;
    if (idEmpresa === undefined || idEmpresa === null || String(idEmpresa).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID EMP",
      });
    }
    if (idUsuario === undefined || idUsuario === null || String(idUsuario).length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID USU",
      });
    }
    if (body.id === undefined || body.id === null || String(body.id).trim().length === 0) {
      return res.status(400).send({
        code: STRING_FAILURE,
        message: "ERROR ID",
      });
    }

    let objData = {};
    objData.idUsuario = idUsuario;
    objData.idEmpresa = idEmpresa;
    objData.id = body.id;

    const resp = await AreaStore.storeDeshabilitarArea(objData);
    if (resp) {
      return res.status(200).send({
        code: STRING_SUCCESS,
        message: "controllerDeshabilitarArea was succesful",
        // body: resp
      });
    }

    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  } catch (err) {
    console.log("controllerDeshabilitarArea err");
    console.log(err);
    return res.status(400).send({
      code: STRING_FAILURE,
      message: "ERROR",
    });
  }
};

module.exports = {
  controllerGuardarArea,
  controllerObtenerListaArea,
  controllerModificarArea,
  controllerDeshabilitarArea,
};
