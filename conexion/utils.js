const { conexion } = require("../conexion/conexion.js");

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

module.exports = {
  runQuery,
  runQueryTransaction,
};
