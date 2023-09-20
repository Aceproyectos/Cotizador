const mysql = require("mysql2");
const conexion = mysql.createConnection({
  host: "31.220.54.202",
  database: "cotizador",
  user: "acemar",
  password: "Acemar1959+-",
});

try {
  conexion.connect();
  console.log("CONEXIÓN EXITOSA");
} catch (error) {
  console.log("Error en la conexión:", error);
}

module.exports = conexion;


