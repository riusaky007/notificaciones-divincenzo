const { conexion } = require("../conexion/conexion.js");
const uuid = require('uuid');
const { AVANZADO_FORMULARIO_CHECKLIST, FORMULARIO_CHECKLIST } = require("../utils/const-formulario.js");
const moment = require('moment');

const runQuery = async (query, arrayValue) => {
  const newPromise = new Promise(function (resolve, reject) {
    conexion.query(query, arrayValue, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
  const resp = await newPromise;
  return Object.values(JSON.parse(JSON.stringify(resp)));
};

const runQueryConnectionRegular = async (query, arrayValue, connection) => {
  try {
    const newPromise = new Promise((resolve, reject) => {
      connection.query(query, arrayValue, (err, rows) => {
        if (err) {
          return reject(err);  // Reject with the error if query fails
        }
        resolve(rows);  // Resolve with the query result
      });
    });

    const resp = await newPromise;
    return {
      success: true,
      data: Object.values(JSON.parse(JSON.stringify(resp))),
      insertId: resp.insertId || null,  // Get the inserted ID if available
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const runMultipleQueryWithTransaction = async (listQueries, listParams) => {
  const connection = await new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });

  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        return reject(err);
      }

      try {
        let results = [];
        for (let i = 0; i < listQueries.length; i++) {
          const query = listQueries[i];
          const params = listParams[i];
          const result = await new Promise((resolve, reject) => {
            connection.query(query, params, (err, rows) => {
              if (err) {
                return reject(err);
              }
              resolve(rows);
            });
          });
          results.push(result);
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              reject(err);
            });
          }
          connection.release();
          resolve(results); // Return the results of all queries
        });
      } catch (err) {
        connection.rollback(() => {
          connection.release();
          reject(err);
        });
      }
    });
  });
};

const runQueryConnection = async (query, arrayValue, connection) => {
  try {
    const newPromise = new Promise((resolve, reject) => {
      connection.query(query, arrayValue, (err, rows) => {
        if (err) {
          return reject(err);  // Reject with the error if query fails
        }
        resolve(rows);  // Resolve with the query result
      });
    });

    const resp = await newPromise;
    return {
      success: true,
      data: Object.values(JSON.parse(JSON.stringify(resp)))
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const insertIntoRespuestasChecklist = async (data, connection) => {
  // console.log('insertIntoRespuestasChecklist');
  // console.log(data);
  let query = 'INSERT INTO RespuestasChecklist VALUES (?,?,?,?,? ,?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,? ,?,NOW(),NOW(),?,1,?,?,?,?,?, ?,?,?,?,? ,?,?);';
  let arr = [];
  const idPK = uuid.v4();
  const codigo = moment().unix();
  arr.push(idPK);
  arr.push(data.idChecklist);
  arr.push(data.codigoVehiculo);
  arr.push(data.valueVehiculo);
  arr.push(data.labelVehiculo);
  arr.push(data.odometroActual);
  arr.push(data.odometroProximo);
  arr.push(data.fechaActualChecklist);
  arr.push(data.fechaProximoChecklist);
  arr.push(data.codigoConductor);
  arr.push(data.valueConductor);
  arr.push(data.labelConductor);
  arr.push(data.idArea);
  arr.push(data.idTipoChecklist);
  arr.push(data.idTipoVehiculo);
  arr.push(data.idMarcaVehiculo);
  arr.push(data.idTipoCarroceria);
  arr.push(data.idTipoCombustible);
  arr.push(data.idCiudad);
  arr.push(data.idUsuario);
  arr.push(data.idEmpresa);
  arr.push(data.nota);
  arr.push(data.ultimoOdometroRegistrado);
  arr.push(data.ultimaTemperaturaRegistrada);

  arr.push(data.idNivelCombustible);
  arr.push(data.idMotivo);
  arr.push(data.numeroDeConocimiento);

  arr.push(data.idGeocercaOrigen);
  arr.push(data.nombreGeocercaOrigen);
  arr.push(data.idGeocercaDestino);
  arr.push(data.nombreGeocercaDestino);
  arr.push(data.fechaProgramadaViaje);
  arr.push(data.odometroProximoMantenimiento);

  arr.push(codigo);
  const result = await runQueryConnection(query, arr, connection);
  // console.log('result');
  // console.log(result);
  if (result.success) {
    return { success: true, insertId: idPK };
  } else {
    return { success: false, error: result.error };
  }
};

const insertIntoDetalleRespuestasChecklist = async (data, idRespuestaChecklist, idUsuario, idEmpresa, connection) => {
  // console.log('insertIntoDetalleRespuestasChecklist');
  let query = 'INSERT INTO DetalleRespuestasChecklist VALUES (UUID(),?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),1,?,?,?,?)';
  for (let item of data) {
    // console.log('item');
    // console.log(item);
    let fecha = null;
    if (item.fecha !== undefined) {
      fecha = item.fecha;
    }
    let arr = [];
    arr.push(idRespuestaChecklist);
    arr.push(item.idChecklist);
    arr.push(item.idSeccion);
    arr.push(item.idPreguntaSeccion);
    arr.push(item.idTipoPregunta);
    arr.push(item.labelPregunta);
    arr.push(item.respuesta);
    arr.push(item.idOpcionRespuesta);
    arr.push(item.esArchivo);
    arr.push(item.urlArchivo);
    arr.push(idUsuario);
    arr.push(idEmpresa);
    arr.push(item.urlFotoRespuesta);
    arr.push(item.detalleNotaObservacionRespuesta);
    arr.push(item.correos);
    arr.push(fecha);
    const result = await runQueryConnection(query, arr, connection);
    if (!result.success) {
      return { success: false, error: result.error };
    }
  }
  return { success: true };
};

const updateOrdenFormularioChecklist = async (data, id, orden, connection) => {
  let query = " UPDATE FormularioChecklist SET " +
    " orden = ?," +
    " fechaProceso = NOW(), " +
    " idUsuario = ? " +
    " WHERE id = ? AND idEmpresa = ? ;";
  let arr = [];
  arr.push(orden);
  arr.push(data.idUsuario);
  arr.push(id);
  arr.push(data.idEmpresa);
  const result = await runQueryConnection(query, arr, connection);
  // console.log('result');
  // console.log(result);
  if (result.success) {
    return { success: true, insertId: result.data[2] };
  } else {
    return { success: false, error: result.error };
  }
};

const insertIntoRespuestasRespuestaPieDePagina = async (data, connection) => {
  // console.log('insertIntoRespuestasChecklist');
  // console.log(data);
  const idPK = uuid.v4();
  let query = 'INSERT INTO RespuestaPieDePagina VALUES (?,?,?,NOW(),NOW(),?,?,1);';
  let arr = [];
  arr.push(idPK);
  arr.push(data.idRespuestaChecklist);
  arr.push(data.idChecklist);
  arr.push(data.idEmpresa);
  arr.push(data.idUsuario);
  const result = await runQueryConnection(query, arr, connection);
  // console.log('result');
  // console.log(result);
  if (result.success) {
    return { success: true, insertId: idPK };
  } else {
    return { success: false, error: result.error };
  }
};

const insertIntoDetalleRespuestasRespuestaPieDePagina = async (data, idRespuestaPieDePagina, idUsuario, idEmpresa, connection) => {
  // console.log('insertIntoDetalleRespuestasRespuestaPieDePagina');
  let query = 'INSERT INTO DetalleRespuestaPieDePagina VALUES (?,?,?, ?,?,?, ?, NOW(),NOW(),?,?,1)';
  for (let item of data) {
    const idPK = uuid.v4();
    let arr = [];
    arr.push(idPK);
    arr.push(idRespuestaPieDePagina);
    arr.push(item.idDetallePieDePagina);
    arr.push(item.idConcepto);
    arr.push(item.esImagen);
    arr.push(item.urlImagen);
    arr.push(item.respuesta);
    arr.push(idEmpresa);
    arr.push(idUsuario);
    const result = await runQueryConnection(query, arr, connection);
    if (!result.success) {
      return { success: false, error: result.error };
    }
  }
  return { success: true };
};

const runQueryGuardarRespuestasChecklist = async (objData) => {
  const connection = await new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
  try {
    await connection.beginTransaction(); // Start the transaction
    // Insert into Table A and get the inserted ID
    const insertResultA = await insertIntoRespuestasChecklist(objData.respuestaChecklist, connection);
    if (!insertResultA.success) {
      throw new Error(`Failed to insert into RespuestasChecklist: ${insertResultA.error}`);
    }
    const insertedId = insertResultA.insertId;
    // console.log('insertedId');
    // console.log(insertedId);
    // console.log('objData');
    // console.log(objData);

    // console.log('objData.idUsuario');
    // console.log(objData.idUsuario);

    // console.log('objData.idEmpresa');
    // console.log(objData.idEmpresa);
    // Insert into Table B using the ID from Table A
    const insertResultB = await insertIntoDetalleRespuestasChecklist(objData.detalleRespuestaChecklist, insertedId, objData.idUsuario, objData.idEmpresa, connection);
    if (!insertResultB.success) {
      throw new Error(`Failed to insert into DetalleRespuestasChecklist: ${insertResultB.error}`);
    }
    const objRepuestaPieDePagina = {
      idRespuestaChecklist: insertedId,
      idChecklist: objData.respuestaChecklist.idChecklist,
      idEmpresa: objData.idEmpresa,
      idUsuario: objData.idUsuario
    };
    const insertResultC = await insertIntoRespuestasRespuestaPieDePagina(objRepuestaPieDePagina, connection);
    if (!insertResultC.success) {
      throw new Error(`Failed to insert into RespuestaPieDePagina: ${insertResultC.error}`);
    }
    const idRespuestaPieDePagina = insertResultC.insertId;
    const insertResultD = await insertIntoDetalleRespuestasRespuestaPieDePagina(objData.detallePieDePagina, idRespuestaPieDePagina, objData.idUsuario, objData.idEmpresa, connection);
    if (!insertResultD.success) {
      throw new Error(`Failed to insert into DetalleRespuestaPieDePagina: ${insertResultD.error}`);
    }
    await connection.commit(); // Commit the transaction
    console.log('Transaction successful: All data inserted successfully');
    return {
      success: true,
      message: 'All data inserted successfully',
      id: insertedId,
    };
  } catch (err) {
    await connection.rollback();  // Rollback the transaction in case of an error
    console.error('Transaction failed:', err.message);
    return {
      success: false,
      error: err.message
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

const runQueryIntercambiarOrden = async (objData) => {
  const connection = await new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
  try {
    await connection.beginTransaction(); // Start the transaction
    // Insert into Table A and get the inserted ID
    const insertResultA = await updateOrdenFormularioChecklist(objData, objData.idB, objData.ordenA, connection);

    if (!insertResultA.success) {
      throw new Error(`Failed to insert into RespuestasChecklist: ${insertResultA.error}`);
    }
    // Insert into Table B using the ID from Table A
    const insertResultB = await updateOrdenFormularioChecklist(objData, objData.idA, objData.ordenB, connection);

    if (!insertResultB.success) {
      throw new Error(`Failed to insert into DetalleRespuestasChecklist: ${insertResultB.error}`);
    }

    await connection.commit(); // Commit the transaction
    console.log('Transaction successful: All data inserted successfully');
    return {
      success: true,
      message: 'All data inserted successfully'
    };
  } catch (err) {
    await connection.rollback();  // Rollback the transaction in case of an error
    console.error('Transaction failed:', err.message);
    return {
      success: false,
      error: err.message
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

const runQueryTransaction = async (query, arr) => {
  const connection = await new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
  try {
    await connection.beginTransaction(); // Start the transaction
    const result = await runQueryConnectionRegular(query, arr, connection);
    // console.log('result');
    // console.log(result);
    if (result.success) {
      await connection.commit();
      return result;
    } else {
      throw (result.error);
    }
  } catch (err) {
    await connection.rollback();  // Rollback the transaction in case of an error
    console.error('Transaction failed:', err);
    console.log(query);
    return {
      success: false,
      message: err.message
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

const insertFormularioChecklist = async (objData, connection) => {
  // console.log('insertFormularioChecklist');
  // console.log(data);

  let arr = [];
  let query = "INSERT INTO FormularioChecklist VALUES (?,?,?,?,?,?,NOW(),NOW(),1);";
  arr.push(objData.idPK);
  arr.push(objData.idChecklist);
  arr.push(objData.idConcepto);
  arr.push(objData.orden);
  arr.push(objData.idUsuario);
  arr.push(objData.idEmpresa);
  const result = await runQueryConnection(query, arr, connection);
  // console.log('result');
  // console.log(result);
  if (result.success) {
    return { success: true, insertId: objData.idPK };
  } else {
    console.log('insertFormularioChecklist err');
    console.log(result);
    return { success: false, error: result.error };
  }
};

const insertAvanzadoFormularioChecklist = async (objData, connection, idConcepto) => {
  // console.log('insertFormularioChecklist');
  // console.log(data);

  let arr = [];
  let query = "INSERT INTO AvanzadoFormularioChecklist VALUES (UUID(),?,?,?,NOW(),NOW(),?,?,0,?,?);";
  arr.push(objData.idPK);
  arr.push(objData.idChecklist);
  arr.push(idConcepto);
  arr.push(objData.idEmpresa);
  arr.push(objData.idUsuario);
  arr.push(JSON.stringify(null));
  arr.push(JSON.stringify(null));
  const result = await runQueryConnection(query, arr, connection);
  // console.log('result');
  // console.log(result);
  if (result.success) {
    return { success: true, insertId: objData.idPK };
  } else {
    console.log('insertFormularioChecklist err');
    console.log(result);
    return { success: false, error: result.error };
  }
};

const runQueryInterFormularioChecklist = async (objData) => {
  const connection = await new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
  try {
    await connection.beginTransaction(); // Start the transaction
    // Insert into Table A and get the inserted ID
    const idPK = uuid.v4();
    objData.idPK = idPK;
    const insertResultA = await insertFormularioChecklist(objData, connection);
    if (!insertResultA.success) {
      throw new Error(`Failed to insert into RespuestasChecklist: ${insertResultA.error}`);
    }
    if (objData.idConcepto === FORMULARIO_CHECKLIST.SELECCIONAR_CONDUCTOR) {
      const insertResultB = await insertAvanzadoFormularioChecklist(objData, connection, AVANZADO_FORMULARIO_CHECKLIST.VALIDAR_CONDUCTOR);
      if (!insertResultB.success) {
        throw new Error(`Failed to insert into DetalleRespuestasChecklist: ${insertResultB.error}`);
      }
    }
    if (objData.idConcepto === FORMULARIO_CHECKLIST.ODOMETRO_PROXIMO_MANTENIMIENTO) {
      const insertResultC = await insertAvanzadoFormularioChecklist(objData, connection, AVANZADO_FORMULARIO_CHECKLIST.VALIDAR_ODOMETRO_PROXIMO_MANTENIMIENTO);
      if (!insertResultC.success) {
        throw new Error(`Failed to insert into DetalleRespuestasChecklist: ${insertResultC.error}`);
      }
    }
    await connection.commit(); // Commit the transaction
    console.log('Transaction successful: All data inserted successfully');
    return {
      success: true,
      message: 'All data inserted successfully',
      data: idPK,
    };
  } catch (err) {
    await connection.rollback();  // Rollback the transaction in case of an error
    console.error('Transaction failed:', err.message);
    return {
      success: false,
      error: err.message
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

module.exports = {
  runQuery,
  runMultipleQueryWithTransaction,
  runQueryGuardarRespuestasChecklist,
  runQueryIntercambiarOrden,
  runQueryTransaction,
  runQueryInterFormularioChecklist,
};
