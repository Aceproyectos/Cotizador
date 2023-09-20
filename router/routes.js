const express = require("express");
const { query } = require("../Connection/connection");
const connection = require("../Connection/connection");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/", controller.login);
router.get("/login", controller.login);
router.get("/account", controller.account);
router.get("/index", controller.index);
router.get("/pisos", controller.pisos);
router.get("/formulario", controller.formulario);
router.get("/imprimir", controller.pedido);
router.get("/flooring", controller.flooring);
router.get("/lista", controller.lista);
router.get("/facturas", controller.facturas);
router.get("/vacio", controller.vacio);
router.get("/precios", controller.precios);
router.get("/inventario", controller.inventario);
router.get("/productos", controller.productos);
router.get("/doors", controller.door);
router.get("/pricedoor", controller.pricedoor);
router.post("/facturas", controller.facturas);
router.post("/doors", controller.door);
router.post("/index", controller.index);
router.post("/prueba", controller.prueba);
router.post("/piso", controller.piso);
router.post("/client", controller.client);
router.post("/actclient", controller.actclient);
router.post("/pisos", controller.pisos);
router.post("/pricedoor", controller.pricedoor);
router.post("/pricedoors", controller.pricedoors);
router.post("/elimaccount", controller.elimaccount);
router.post("/validarlogin", controller.validarlogin);
router.post("/elimcarrito", controller.elimcarrito);
router.post("/finalizar", controller.finalizar);
router.post("/actprec", controller.actprec);
router.post("/actinv", controller.actinv);
router.post("/base", controller.base);
router.post("/inserprecli", controller.inserprecli);
router.post("/elimprecli", controller.elimprecli);
router.post("/elimpro", controller.elimpro);
router.post("/account", controller.account);
router.post("/produc", controller.produc);
router.post("/productos", controller.productos);
router.post("/updprod", controller.updprod);
router.post("/actuproduc", controller.actuproduc);
router.post("/updateDoor", controller.updateDoor);
router.post("/actpred", controller.actpred);
router.post("/elimpred", controller.elimpred);
router.post("/elimcarrpuert", controller.elimcarrpuert);
router.post("/newDoor", controller.newDoor);
router.post("/elimDoors", controller.elimDoors);
router.get("/calcpdf", controller.calcpdf);
router.get("/actupro/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM pisos WHERE id=?", [id], (err, reslt) => {
    if (err) {
      throw err;
    } else {
      res.render("actupro", { datos: reslt });
    }
  });
});
router.get("/actuDoor/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM puertas INNER JOIN codigo ON(puertas.id = codigo.id) WHERE puertas.id = '" +
      id +
      "'",
    (err, result) => {
      if (err) {
        console.log("Error en la consulta de actualizar puertas");
        throw err;
      } else {
        res.render("actuDoor", { datos: result });
      }
    }
  );
});

router.get("/formulario/:id", (req, res) => {
  const per = req.session.per;
  const use = req.session.user;
  const doc = req.session.docu;
  const id = req.params.id;
  connection.query(
    "SELECT * FROM puertas WHERE id=?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        connection.query(
          "SELECT * FROM codigo WHERE id = ?",
          [id],
          (err, resbd) => {
            if (err) {
              throw err;
            } else {
              nocache(res);
              res.render("formulario", {
                datos: results[0],
                cod: resbd[0],
                perf: per,
                user: use,
              });
            }
          }
        );
      }
    }
  );
});
router.get("/flooring/:id", (req, res) => {
  const id = req.params.id;
  const doc = req.session.docu;
  const per = req.session.per;
  const use = req.session.user;
  connection.query("SELECT * FROM pisos WHERE id=?", [id], (err, results) => {
    if (err) {
      throw err;
    } else {
      nocache(res);
      connection.query(
        "SELECT * FROM pisosprec WHERE idcliente='" +
          doc +
          "' AND idpisos='" +
          [id] +
          "'",
        (err, prec) => {
          res.render("flooring", {
            datos: results[0],
            precio: prec[0],
            perf: per,
            user: use,
          });
        }
      );
    }
  });
});
router.get("/compra/:id", (req, res) => {
  id = req.params.id;
  connection.query(
    "SELECT f.id_factura AS factura_id, f.subtotal, f.impuesto, f.envio, f.total AS factura_total,p.id AS pisos_i, p.sku AS producto_sku, p.image AS producto_image, p.unit_price AS producto_unit_price, p.total AS producto_total FROM factura AS f INNER JOIN productos AS p ON (f.id_factura = p.id_enc) WHERE f.id_factura = '" +
      id +
      "'",
    (err, result) => {
      if (err) {
        console.log("error en la consulta de factura");
        throw err;
      } else {
        // Obtener una lista de valores de la columna 'id' de los resultados
        const idList = result.map((row) => row.pisos_i);
        console.log(result)

        // Verificar si hay elementos en la lista
        if (idList.length > 0) {
          // Usar la lista de valores en la consulta con IN
          connection.query(
            "SELECT * FROM productos INNER JOIN detalles_pisos AS dp1 ON (productos.id = dp1.id) INNER JOIN pisos AS p1 ON (dp1.product_id = p1.id) INNER JOIN detalles_pisos AS dp2 ON (productos.id = dp2.id) INNER JOIN pisos AS p2 ON (dp2.product_id = p2.id) WHERE productos.id IN (" +
              idList.join(",") +
              ")",
            (err, pisos) => {
              if (err) {
                console.log("error en la consulta con inner en pisos");
                throw err;
              } else {
                connection.query(
                  "SELECT * FROM productos INNER JOIN detalles_puertas AS dp2 ON (productos.id = dp2.id) INNER JOIN puertas AS p2 ON (dp2.product_id = p2.id) WHERE productos.id IN (" +
                    idList.join(",") +
                    ")",
                  (err, puertas) => {
                    if (err) {
                      console.log("error en la consulta puertas");
                      throw err;
                    } else {
                      res.render("compra", {
                        productos: result,
                        pisos: pisos,
                        puertas: puertas,
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          console.log(
            "No se encontraron resultados para la consulta original."
          );
        }
      }
    }
  );
});

router.get("/precli/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM pisosprec INNER JOIN pisos ON (pisosprec.idpisos = pisos.id) WHERE idcliente = '" +
      id +
      "'",
    (err, results) => {
      if (err) {
        throw err;
      } else {
        connection.query("SELECT * FROM pisos", (err, resul) => {
          if (err) {
            throw err;
          } else {
            res.render("precli", { datos: results, pis: resul, ido: id });
          }
        });
      }
    }
  );
});

router.get("/actaccont/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM cliente WHERE id = '" + id + "'",
    (err, resd) => {
      if (err) {
        throw err;
      } else {
        res.render("actaccont", { datos: resd });
      }
    }
  );
});

function nocache(res) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
}

module.exports = router;
