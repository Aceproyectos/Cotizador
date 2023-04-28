const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "31.220.54.202",
  database: "cotizador",
  user: "acemar",
  password: "Acemar1959+-",
  // Opción de retry para intentar reconectar automáticamente
  // en caso de una desconexión del servidor.
  // El número de intentos y el intervalo de tiempo entre ellos
  // pueden ser personalizados según tus necesidades.
  retry: {
    // Número máximo de intentos.
    max: 5,
    // Intervalo de tiempo entre intentos (en milisegundos).
    // Puedes personalizarlo según tus necesidades.
    delay: 1000,
  },
});

conexion.connect(function (error) {
  if (error) {
    console.log("Error en la conexión:", error);
    throw error;
  } else {
    console.log("CONEXIÓN EXITOSA");
  }
});

module.exports = conexion;
