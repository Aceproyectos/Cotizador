const connection = require("../Connection/connection");
const cnn = connection;
const controller = {};
const bcrypt = require("bcrypt");
const path = require("path");

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
                ), (err) => {
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
                ), (err) => {
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