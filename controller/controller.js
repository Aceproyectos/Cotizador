const connection = require("../Connection/connection");
const cnn = connection;
const controller = {};
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const Pdfprinter = require("pdfmake");
const fs = require("fs");
var base64Img = require("base64-img");
const multer = require("multer");
const { countReset } = require("console");

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
controller.productos = (req, res, next) => {
  res.render("productos");
};
controller.actupro = (req, res, next) => {
  res.render("actupro");
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/flooring"); // set the directory where the file will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename); // set the filename of the file
  },
});

// Initialize the multer middleware with the storage configuration
const upload = multer({ storage: storage });

controller.produc = (req, res) => {
  // Handle the file upload using the upload middleware
  upload.single("image")(req, res, (err) => {
    if (err) {
      throw err;
    }
    const img = req.file.filename; // get the filename of the uploaded file
    const producto = req.body.pro;
    const ly1 = req.body.layer1;
    const ly3 = req.body.layer3;
    const invt1 = req.body.ily1;
    const invt3 = req.body.ily3;
    cnn.query(
      "INSERT INTO pisos SET ?",
      {
        producto: producto,
        imgpiso: img,
        cod1: ly1,
        cod3: ly3,
        inventario: invt1,
        inventario3: invt3,
      },
      (err) => {
        if (err) {
          throw err;
        } else {
          res.redirect("productos");
        }
      }
    );
  });
};

controller.actuproduc = (req, res) => {
  // Handle the file upload using the upload middleware
  upload.single("image")(req, res, (err) => {
    if (err) {
      throw err;
    }
    const producto = req.body.pro;
    const ly1 = req.body.layer1;
    const ly3 = req.body.layer3;
    const invt1 = req.body.ily1;
    const invt3 = req.body.ily3;
    const id = req.body.id;
    if (req.file) {
      const img = req.file.filename; // get the filename of the uploaded file
      cnn.query(
        "UPDATE pisos SET producto = '" +
          producto +
          "', imgpiso = '" +
          img +
          "', cod1 = '" +
          ly1 +
          "', cod3 = '" +
          ly3 +
          "', inventario = '" +
          invt1 +
          "', inventario3 = '" +
          invt3 +
          "' WHERE id = '" +
          id +
          "'",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("productos");
          }
        }
      );
    } else {
      cnn.query(
        "UPDATE pisos SET producto = '" +
          producto +
          "', cod1 = '" +
          ly1 +
          "', cod3 = '" +
          ly3 +
          "', inventario = '" +
          invt1 +
          "', inventario3 = '" +
          invt3 +
          "' WHERE id = '" +
          id +
          "'",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("productos");
          }
        }
      );
    }
  });
};

controller.productos = (req, res) => {
  cnn.query("SELECT * FROM pisos", (err, results) => {
    if (err) {
      throw err;
    } else {
      res.render("productos", { datos: results });
    }
  });
};

controller.updprod = (req, res) => {
  const id = req.body.dd;
  const producto = req.body.pp;
  const cod1 = req.body.cc;
  const cod3 = req.body.ccc;
  const inv1 = req.body.ii;
  const inv3 = req.body.io;
  let img = req.body.ii;
  console.log("🚀 ~ file: controller.js:110 ~ img:", img);

  // Si se subió una imagen, se guarda y se actualiza el campo imgpiso
  if (req.files && req.files.imagen) {
    const file = req.files.imagen;
    const extension = file.name.split(".").pop();
    const filename = `${id}.${extension}`;

    file.mv(`./public/images/flooring/${filename}`, (err) => {
      if (err) {
        throw err;
      } else {
        img = filename;

        // Se actualizan los campos en la base de datos
        cnn.query(
          "UPDATE pisos SET producto=?,imgpiso=?,cod1=?,cod3=?,inventario=?,inventario3=? WHERE id = ?",
          [producto, img, cod1, cod3, inv1, inv3, id],
          (err) => {
            if (err) {
              throw err;
            } else {
              res.redirect("productos");
            }
          }
        );
      }
    });
  } else {
    console.log(img);
    // Si no se subió una imagen, se actualizan solo los otros campos en la base de datos
    cnn.query(
      "UPDATE pisos SET producto=?,imgpiso=?,cod1=?,cod3=?,inventario=?,inventario3=? WHERE id = ?",
      [producto, img, cod1, cod3, inv1, inv3, id],
      (err) => {
        if (err) {
          throw err;
        } else {
          res.redirect("productos");
        }
      }
    );
  }
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

controller.elimpro = (req, res) => {
  const id = req.body.pp;
  cnn.query("DELETE FROM pisos WHERE id = '" + id + "'", (err) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/productos");
    }
  });
};

controller.finalizar = async (req, res) => {
  const doc = req.session.docu;
  const cor = req.session.cor;
  const perf = req.session.per;
  const fonts = require("./fonts");
  const conte = req.body;

  const PdfPrinter = require("pdfmake");
  const printer = new PdfPrinter(fonts);
  var imagenBase64 = base64Img.base64Sync(
    "./public/images/perfil/" + perf + ""
  );

  var docDefinition = {
    pageSize: "LEGAL",
    pageOrientation: "landscape",
    content: [
      {
        image: "bee",
        width: 160,
        height: 50,
        absolutePosition: { x: 50, y: 20 },
      },
      {
        image: imagenBase64,
        fit: [60, 60],
        ratio: true,
        absolutePosition: { x: 800, y: 20 },
      },
      {
        text: "PRE-ORDER",
        bold: true,
        fontSize: 20,
        alignment: "center",
      },
      {
        headerRows: 1,
        ...conte,
        margin: [0, 50, 0, 0],
      },
    ],

    footer: {
      columns: [
        {
          text: "2310 Tall Pines Drive - Suite 230, Largo Florida 33771",
          alignment: "center",
          fontSize: 13,
          margin: [0, 0, 0, 40],
          color: "green",
        },
        {
          text: "727 584 3711",
          alignment: "center",
          fontSize: 13,
          color: "green",
        },
        {
          text: "sales@acemar.us",
          alignment: "center",
          fontSize: 13,
          color: "green",
        },
      ],
    },

    images: {
      bee: "data:image/png;base64,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",
      water:
        "data:image/png;base64,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",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableOpacityExample: {
        margin: [0, 5, 0, 15],
        fillColor: "blue",
        fillOpacity: 0.3,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
    patterns: {
      stripe45d: {
        boundingBox: [1, 1, 4, 4],
        xStep: 3,
        yStep: 3,
        pattern: "1 w 0 1 m 4 5 l s 2 0 m 5 3 l s",
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
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
    from: '"Acemar" <acemardistributors.com@gmail.com>', // sender address
    to: "sistemas@acemar.co",
    //to: "sistemas@acemar.co, " + cor + "", // list of receivers
    subject: "Acemar", // Subject line
    text: "Thank you for contacting us.  We have sent you an email with a PDF of your order. If you have any question, please feel free to contact us", // plain text body
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
controller.inserprecli = (req, res) => {
  const prod = req.body.producto;
  const ly1 = req.body.layer1;
  const ly3 = req.body.layer3;
  const ido = req.body.ido;
  cnn.query(
    "INSERT INTO pisosprec SET ?",
    {
      idcliente: ido,
      idpisos: prod,
      layer1: ly1,
      layer3: ly3,
    },
    (err, rs) => {
      if (err) {
        throw err;
      } else {
        res.redirect("precli/" + ido + "");
      }
    }
  );
};
controller.elimprecli = (req, res) => {
  const piso = req.body.pp;
  const clit = req.body.cc;
  cnn.query(
    "DELETE FROM pisosprec WHERE idcliente='" +
      clit +
      "' AND idpisos='" +
      piso +
      "'",
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("precli/" + clit + "");
      }
    }
  );
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
    cnn.query(
      "UPDATE pisos SET inventario=inventario-'" +
        cant +
        "' WHERE id = '" +
        id +
        "'"
    );
  } else {
    ly = ly3 * cant;
    cod = cod3;
    cnn.query(
      "UPDATE pisos SET inventario3=inventario3-'" +
        cant +
        "' WHERE id = '" +
        id +
        "'"
    );
  }

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
  console.log("🚀 ~ file: controller.js:635 ~ controller.validarlogin= ~ con :", con )
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
          const cor = (req.session.cor = results[0].mail);
          const per = (req.session.per = results[0].perfil);
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

const storaperfil = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/perfil"); // set the directory where the file will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename); // set the filename of the file
  },
});

const uploada = multer({ storage: storaperfil });

controller.client = async (req, res, next) => {
  const password = String(req.body.pass);
  const pass = await bcrypt.hash(password, 8);
  uploada.single("image")(req, res, (err) => {
    if (err) {
      throw err;
    }
    const img = req.file.filename;
    const email = req.body.email;
    const phon = req.body.phone;
    const rolex = req.body.rolex;
    const add = req.body.address;
    const pos = req.body.postal;
    const sta = req.body.state;
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
        perfil: img,
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
  });
};

controller.actclient = async (req, res, next) => {
  const password = String(req.body.pass);
  const pass = await bcrypt.hash(password, 8);
  uploada.single("image")(req, res, (err) => {
    if (err) {
      throw err;
    }
    const id = req.body.id;
    const email = req.body.email;
    const phon = req.body.phone;
    const rolex = req.body.rolex;
    const add = req.body.address;
    const pos = req.body.postal;
    const sta = req.body.state;
    if (req.file) {
      const img = req.file.filename;
      cnn.query(
        "UPDATE cliente SET mail='" +
          email +
          "', password='" +
          pass +
          "', phone='" +
          phon +
          "', rol='" +
          rolex +
          "', address='" +
          add +
          "',postal='" +
          pos +
          "',state='" +
          sta +
          "', perfil='" +
          img +
          "' WHERE id=" +
          id +
          "",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("account");
          }
        }
      );
    } else {
      cnn.query(
        "UPDATE cliente SET mail='" +
          email +
          "', password='" +
          pass +
          "', phone='" +
          phon +
          "', rol='" +
          rolex +
          "', address='" +
          add +
          "',postal='" +
          pos +
          "',state='" +
          sta +
          "' WHERE id= '" +
          id +
          "'",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("account");
          }
        }
      );
    }
  });
};

controller.elimaccount = (req, res) => {
  const id = req.body.pp;
  cnn.query("DELETE FROM cliente WHERE id='" + id + "'", (err) => {
    if (err) {
      throw err;
    } else {
      res.redirect("account");
    }
  });
};

controller.account = (req, res) => {
  cnn.query("SELECT * FROM cliente", (err, resd) => {
    if (err) {
      throw err;
    } else {
      res.render("account", { data: resd });
    }
  });
};

controller.pisos = (req, res) => {
  const per = req.session.per;
  cnn.query("SELECT * FROM pisos", (err, resd) => {
    if (err) {
      console.log("error consulta de los pisos");
    } else {
      res.render("pisos", { datos: resd, perf: per });
    }
  });
};

controller.elimcarrito = (req, res) => {
  const id = req.body.dd;
  const piso = req.body.pp;
  const cant = req.body.cc;
  const ly = req.body.ll;
  console.log("🚀 ~ file: controller.js:474 ~ ly:", ly);
  if (ly == 3) {
    cnn.query(
      "UPDATE pisos SET inventario3 = inventario3 +'" +
        cant +
        "' WHERE id ='" +
        piso +
        "'"
    );
  } else {
    cnn.query(
      "UPDATE pisos SET inventario = inventario +'" +
        cant +
        "' WHERE id ='" +
        piso +
        "'"
    );
  }
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
  const cor = req.session.cor;
  const per = req.session.per;
  var sql =
    "SELECT id_enc,id_cliente,id_piso,codigo,imagen,cantidad,precio,layer,producto,ROUND(SUM(precio),2) AS precg, SUM(cantidad) AS cantg FROM encabezadofac INNER JOIN pisos ON(encabezadofac.id_piso=pisos.id) WHERE id_enc= '" +
    1 +
    "' AND id_cliente = '" +
    doc +
    "' GROUP BY id_enc,id_cliente,id_piso,layer;";
  cnn.query(sql, (err, resd) => {
    if (err) {
      console.log("error consulta de el encabezada de la factura");
      throw err;
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
                  res.render("lista", {
                    datos: resd,
                    prec: sum,
                    fac: rept,
                    co: cor,
                    perf: per,
                  });
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
