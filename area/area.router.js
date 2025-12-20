// "use strict";
const { Router } = require("express");

const { withToken } = require("../middleware/withToken.js");
const { controllerGuardarArea,
    controllerObtenerListaArea,
    controllerModificarArea,
    controllerDeshabilitarArea, } = require("./area.controller.js");

const AreaRouter = Router();

AreaRouter.use(withToken);

AreaRouter.route("/guardar-area").post(controllerGuardarArea);
AreaRouter.route("/obtener-lista-area").post(controllerObtenerListaArea);
AreaRouter.route("/modificar-area").put(controllerModificarArea);
AreaRouter.route("/deshabilitar-area").put(controllerDeshabilitarArea);

module.exports = AreaRouter;
