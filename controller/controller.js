const connection = require("../Connection/connection");
const cnn = connection;
const controller = {};
const bcrypt = require("bcrypt");
const path = require("path");

const pdf = require("html-pdf");
const nodemailer = require("nodemailer");
const Pdfprinter = require("pdfmake");
const fs = require("fs");
const jsPDF = require("jspdf");
const jsdom = require("jsdom");
const { createCanvas } = require("canvas");
const { JSDOM } = jsdom;
const PDFDocument = require("pdfkit");

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

controller.base = async (req, res) => {
  const doc = req.session.docu;
  var sql =
    "SELECT id_enc,id_cliente,id_piso,codigo,imagen,cantidad,precio,layer,producto,ROUND(SUM(precio),2) AS precg, SUM(cantidad) AS cantg FROM encabezadofac INNER JOIN pisos ON(encabezadofac.id_piso=pisos.id) WHERE id_enc= '" +
    1 +
    "' AND id_cliente = '" +
    doc +
    "' GROUP BY id_enc,id_cliente,id_piso,layer;";
  cnn.query(sql, (err, resd) => {
    if (err) {
      console.log("error consulta de el encabezada de la factura");
    } else {
      cnn.query(
        "SELECT  ROUND(SUM(precio), 2) AS sum FROM encabezadofac WHERE id_cliente = '" +
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
                cnn.query(
                  "UPDATE encabezadofac SET id_enc = '" +
                    rept[0].id_factura +
                    "' WHERE id_enc='1' AND id_cliente='" +
                    doc +
                    "'"
                ),
                  (err) => {
                    if (err) {
                      throw err;
                    }
                  };
                console.log("si esta actualizando el factura");
                cnn.query(
                  "UPDATE factura SET id_encabezado = '" +
                    rept[0].id_factura +
                    "',total = '" +
                    sum[0].sum +
                    "' WHERE id_factura = '" +
                    rept[0].id_factura +
                    "'"
                ),
                  (err) => {
                    if (err) {
                      throw err;
                    } else {
                    }
                  };
                console.log("si esta eliminando");
                cnn.query(
                  "DELETE FROM factura WHERE id_encabezado='5000' AND id_cliente = '" +
                    doc +
                    "'"
                );
              }
            );
          }
        }
      );
    }
  });
  res.redirect("/pisos");
};

controller.finalizar = async (req, res) => {
  const doc = req.session.docu;
  const fonts = require("./fonts");
  const conte = req.body;

  let docDefinition = {
    content: [
      {
        headerRows: 1,
        ...conte,
      },
      {
        image:"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",
        width: 200,
      },
    ],
  };

  const printer = new Pdfprinter(fonts);
  let pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream("./pdfs/pdfTest.pdf"));
  pdfDoc.end();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "acemardistributors.com@gmail.com", // generated ethereal user
      pass: "chgrioaywvdsnuxg", // generated ethereal password
    },
  });

  transporter.verify().then(() => {
    console.log("todo a salido fenomenal");
  });

  await transporter.sendMail({
    from: '"Fred Foo 👻" <acemardistributors.com@gmail.com>', // sender address
    to: "sistemas@acemar.co", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments: [
      {
        filename: "acemarcotizador.pdf", // <= Here: made sure file name match
        path: path.join(__dirname, "../pdfs/pdfTest.pdf"), // <= Here
        contentType: "application/pdf",
      },
    ],
  });
  res.redirect("/pisos");
};

controller.precios = (req, res) => {
  cnn.query("SELECT * FROM cliente", (err, resb) => {
    if (err) {
      throw err;
    } else {
      res.render("precios", { datos: resb });
    }
  });
};

controller.inventario = (req, res) => {
  cnn.query("SELECT * FROM pisos", (err, results) => {
    if (err) {
      throw err;
    } else {
      res.render("inventario", { datos: results });
    }
  });
};

controller.actprec = (req, res) => {
  const id = req.body.dd;
  const ll = req.body.ll;
  const yy = req.body.yy;

  cnn.query(
    "UPDATE pisosprec SET layer1= '" +
      ll +
      "', layer3='" +
      yy +
      "' WHERE idpisos = '" +
      id +
      "'",
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

controller.actinv = (req, res) => {
  const id = req.body.dd;
  const ll = req.body.ll;
  console.log("🚀 ~ file: controller.js:211 ~ ll:", ll);
  const yy = req.body.yy;

  cnn.query(
    "UPDATE pisos SET inventario= '" +
      ll +
      "', inventario3='" +
      yy +
      "' WHERE id = '" +
      id +
      "'",
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

controller.compra = async (req, res) => {
  const id = req.body.dd;
  cnn.query(
    "SELECT * FROM encabezadofac INNER JOIN pisos ON (encabezadofac.id_piso=pisos.id) WHERE id_enc = '" +
      id +
      "'",
    (err, results) => {
      if (err) {
        throw err;
      } else {
        res.render("compra", { data: results });
        res.redirect("compra");
      }
    }
  );
};

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
    ly = ly1 * cant;
    cod = cod1;
  } else {
    ly = ly3 * cant;
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
  const pass = await bcrypt.hash(password, 8);

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
    "DELETE FROM encabezadofac WHERE id_enc = '" +
      id +
      "' AND id_piso = '" +
      piso +
      "'",
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

controller.lista = async (req, res, next) => {
  const doc = req.session.docu;
  var sql =
    "SELECT id_enc,id_cliente,id_piso,codigo,imagen,cantidad,precio,layer,producto,ROUND(SUM(precio),2) AS precg, SUM(cantidad) AS cantg FROM encabezadofac INNER JOIN pisos ON(encabezadofac.id_piso=pisos.id) WHERE id_enc= '" +
    1 +
    "' AND id_cliente = '" +
    doc +
    "' GROUP BY id_enc,id_cliente,id_piso,layer;";
  cnn.query(sql, (err, resd) => {
    if (err) {
      console.log("error consulta de el encabezada de la factura");
    } else {
      cnn.query(
        "SELECT  ROUND(SUM(precio), 2) AS sum FROM encabezadofac WHERE id_cliente = '" +
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
                if (rept.length === 0) {
                  res.redirect("vacio");
                } else {
                  calcpdf(resd);
                  res.render("lista", { datos: resd, prec: sum, fac: rept });
                }
              }
            );
          }
        }
      );
    }
  });
};
function calcpdf(resd) {
  var sqf = 0;
  for (let index = 0; index < resd.length; index++) {
    const layer = resd[index].layer;
    const precio = resd[index].precg;
    const cantidad = resd[index].cantg;
    var unitario = precio / cantidad;
    var precun = unitario.toFixed(2);
    if (layer == 3) {
      sqf = 734.5;
      box = 25;
      sqfbox = sqf / box;
      resd[index].sqf = sqf;
      resd[index].box = box;
      resd[index].sqfbox = sqfbox;
      resd[index].precun = precun;
    } else {
      sqf = 881.4;
      box = 30;
      sqfbox = sqf / box;
      resd[index].sqf = sqf;
      resd[index].box = box;
      resd[index].sqfbox = sqfbox;
      resd[index].precun = precun;
    }
  }
}

controller.calcpdf = (req, res) => {
  const doc = req.session.docu;
  var sql =
    "SELECT producto,codigo,layer,ROUND(SUM(precio),2) AS precg, SUM(cantidad) AS cantg FROM encabezadofac INNER JOIN pisos ON(encabezadofac.id_piso=pisos.id) WHERE id_enc= '" +
    1 +
    "' AND id_cliente = '" +
    doc +
    "' GROUP BY id_enc,id_cliente,id_piso,layer;";
  cnn.query(sql, (err, resd) => {
    if (err) {
      console.log("error consulta de el encabezada de la factura");
    } else {
      cnn.query(
        "SELECT  ROUND(SUM(precio), 2) AS sum FROM encabezadofac WHERE id_cliente = '" +
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
                if (rept.length === 0) {
                  res.redirect("vacio");
                } else {
                  calcpdf(resd);
                  res.json({ datos: resd });
                }
              }
            );
          }
        }
      );
    }
  });
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
