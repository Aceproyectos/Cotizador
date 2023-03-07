const connection = require("../Connection/connection");
const cnn = connection;
const controller = {};
const bcrypt = require("bcrypt");

controller.index = (req, res, next) => {
  res.render("index");
};
controller.formulario = (req, res, next) => {
  res.render("formulario");
};
controller.prueba = (req, res, next) => {
  res.render("lista");
};
controller.pisos = (req, res, next) => {
  res.render("pisos");
};
controller.login = (req, res, next) => {
  res.render("login");
};
controller.account = (req, res, next) => {
  res.render("account");
};
controller.flooring = (req, res, next) => {
  res.render("flooring");
};
controller.lista = (req, res, next) => {
  res.render("lista");
};
controller.facturas = (req, res, next) => {
  res.render("facturas");
};
controller.vacio = (req, res, next) => {
  res.render("vacio");
};

controller.facturas = (req, res) => {
  cnn.query(
    "SELECT * FROM factura INNER JOIN cliente ON(factura.id_cliente=cliente.id)",
    (err, resp) => {
      if (err) {
        throw err;
      } else {
        res.render("facturas", { datos: resp });
      }
    }
  );
};

controller.finalizar = (req, res) => {
  const fac = req.body.factura;
  const total = req.body.total;
  const doc = req.session.docu;
  cnn.query(
    "UPDATE encabezadofac SET id_enc = '" +
      fac +
      "' WHERE id_enc='1' AND id_cliente='" +
      doc +
      "'"
  );
  cnn.query(
    "UPDATE factura SET id_encabezado = '" +
      fac +
      "',total = '" +
      total +
      "' WHERE id_factura = '" +
      fac +
      "'"
  );
  cnn.query(
    "DELETE FROM factura WHERE id_encabezado='5000' AND id_cliente = '" +
      doc +
      "'"
  );
  res.redirect("/pisos");
};

controller.detalle = async (req,res) => {
  const id = req.body.dd;
  cnn.query("SELECT * FROM encabezadofac INNER JOIN pisos ON (encabezadofac.id_piso=pisos.id) WHERE id_enc = '"+id+"'", (err,results) => {
    if(err){
      throw err;
    }
    else{
      res.render("/detalle", {data:results});
    }
  })
}

controller.piso = (req, res, next) => {
  const id = req.body.id;
  const cant = req.body.cantidad;
  const ly1 = req.body.layer1;
  const ly3 = req.body.layer3;
  const gro = req.body.grosor;
  const img = req.body.imagen;
  const cod1 = req.body.cod1;
  const cod3 = req.body.cod3;
  const doc = req.session.docu;
  const d = 1,
    b = 5000;
  if (gro == 1.5) {
    ly = ly1;
    cod = cod1;
  } else {
    ly = ly3;
    cod = cod3;
  }
  cnn.query(
    "UPDATE pisos SET inventario=inventario-'" +
      cant +
      "' WHERE id = '" +
      id +
      "'"
  );
  cnn.query("INSERT INTO encabezadofac SET ?", {
    id_enc: d,
    id_cliente: doc,
    id_piso: id,
    cantidad: cant,
    precio: ly,
    imagen: img,
    codigo: cod,
    layer: gro,
  });
  cnn.query("INSERT INTO  factura SET ?", {
    id_encabezado: b,
    id_cliente: doc,
    total: d,
  });
  res.redirect("lista");
};

controller.validarlogin = async (req, res, next) => {
  const usu = await req.body.user;
  const con = await req.body.pass;
  cnn.query(
    "SELECT * FROM cliente WHERE mail=?",
    [usu],
    async (err, results) => {
      if (err) {
        next(new Error("Error de consulta login", err));
      }
      if (results != 0) {
        if (bcrypt.compareSync(con, results[0].password)) {
          req.session.Login = true;
          const doc = (req.session.docu = results[0].id);
          let rol = results[0].rol;
          switch (rol) {
            case "admin":
              res.redirect("account");
              break;
            case "client":
              res.redirect("pisos");
              break;
          }
        } else {
          console.log("datos incorrectos");
          res.redirect("/");
        }
      } else {
        console.log("datos incorrectos");
        res.redirect("/");
      }
    }
  );
};

controller.client = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.pass;
  const phon = req.body.phone;
  const rolex = req.body.rolex;
  const add = req.body.address;
  const pos = req.body.postal;
  const sta = req.body.state;
  const pass = await bcryptjs.hash(password, 8);

  cnn.query(
    "INSERT INTO cliente SET ?",
    {
      mail: email,
      password: pass,
      phone: phon,
      rol: rolex,
      address: add,
      postal: pos,
      state: sta,
    },
    (err) => {
      if (err) {
        throw err;
        console.log("Error al crear la cuenta");
      } else {
        res.redirect("/account");
      }
    }
  );
};

controller.pisos = (req, res) => {
  cnn.query("SELECT * FROM pisos", (err, resd) => {
    if (err) {
      console.log("error consulta de los pisos");
    } else {
      res.render("pisos", { datos: resd });
    }
  });
};

controller.elimcarrito = (req, res) => {
  const id = req.body.dd;
  const piso = req.body.pp;
  const cant = req.body.cc;
  cnn.query(
    "UPDATE pisos SET inventario = inventario +'" +
      cant +
      "' WHERE id ='" +
      piso +
      "'"
  );
  cnn.query(
    "DELETE FROM encabezadofac WHERE id_enc = '" + id + "'",
    async (err) => {
      if (err) {
        console.log("error al eliminar en el encabezado de la factura");
        throw err;
      } else {
        res.redirect("/lista");
      }
    }
  );
};

controller.factura = (req, res) => {
  const id_cliente = req.body.id_cliente;
  const id_piso = req.body.idPiso;
};

controller.lista = async (req, res, next)  => {
  const doc = req.session.docu;
  cnn.query(
    "SELECT * FROM encabezadofac INNER JOIN pisos ON(encabezadofac.id_piso=pisos.id) WHERE id_cliente = '" +
      doc +
      "' AND id_enc = '" +
      1 +
      "'",
    (err, resd) => {
      if (err) {
        console.log("error consulta de el encabezada de la factura");
      } else {
        cnn.query(
          "SELECT ROUND(SUM(precio), 2) AS sum FROM encabezadofac WHERE id_cliente = '" +
            doc +
            "' AND id_enc = '1'",
          (err, sum) => {
            if (err) {
              throw err;
            } else {
              cnn.query(
                "SELECT * FROM factura WHERE id_encabezado = 5000 AND id_cliente = '" +
                  doc +
                  "'",
                (expx, rept) => {
                  if(rept.length === 0){
                    res.redirect("vacio");
                  }
                  else{
                    res.render("lista", { datos: resd, prec: sum, fac: rept });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

controller.index = async (req, res) => {
  cnn.query("SELECT * FROM puertas", (err, resbd) => {
    if (err) {
      console.log("error en consultar puertas");
      throw err;
    } else {
      res.render("index", { datos: resbd });
    }
  });
};

controller.pedido = async (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=invoice.pdf",
  });
  pdfService.buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
};

module.exports = controller;
