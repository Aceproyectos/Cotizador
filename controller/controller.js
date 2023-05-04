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
  
  const conte = req.body;

  const PdfPrinter = require("pdfmake");
  const fonts = {
    CenturyGothic: {
      normal: "./public/fonts/Century/GOTHIC.TTF",
      bold: "./public/fonts/Century/GOTHIC.TTF",
      italics: "./public/fonts/Century/GOTHIC.TTF",
      bolditalics: "./public/fonts/Century/GOTHIC.TTF",
    }
  };
  
  const printer = new PdfPrinter(fonts);
  var imagenBase64 = base64Img.base64Sync(
    "./public/images/perfil/" + perf + ""
  );
  var acemar = base64Img.base64Sync(
    "./public/images/redes/acemarUS.png"
  );

  var docDefinition = {
    pageSize: "LEGAL",
    pageOrientation: "landscape",
    content: [
      {
        image: acemar,
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
        fontSize: 15,
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
      font: "CenturyGothic",
      fontSize: 18,
      bold: true
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
    //to: "sistemas@acemar.co",
    to: "sistemas@acemar.co, " + cor + "", // list of receivers
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
      cnn.query(
        "SELECT * FROM pisosprec INNER JOIN pisos ON(pisosprec.idpisos = pisos.id) WHERE idcliente = 3",
        (err, results) => {
          if (err) {
            throw err;
          } else {
            cnn.query("SELECT * FROM pisos", (err, pis) => {
              if (err) {
                throw err;
              } else {
                res.render("precios", {
                  datos: resb,
                  data: results,
                  piso: pis,
                });
              }
            });
          }
        }
      );
    }
  });
};

controller.elimpred = (req, res) => {
  const idpisos = req.body.pp;

  cnn.query(
    "DELETE FROM pisosprec WHERE idpisos= '" + idpisos + "' AND idcliente = 3",
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/precios");
      }
    }
  );
};

controller.actpred = (req, res) => {
  const id = req.body.dd;
  const layer1 = req.body.ll;
  const layer3 = req.body.yy;

  cnn.query(
    "UPDATE pisosprec SET layer1 = '" +
      layer1 +
      "', layer3 = '" +
      layer3 +
      "' WHERE idpisos = '" +
      id +
      "' AND idcliente = 3",
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/precios");
      }
    }
  );
};

controller.inserprecli = (req, res) => {
  const prod = req.body.producto;
  const ly1 = req.body.layer1;
  const ly3 = req.body.layer3;
  const ido = 3;
  cnn.query(
    "INSERT INTO pisosprec SET ?",
    {
      idcliente: ido,
      idpisos: prod,
      layer1: ly1,
      layer3: ly3,
    },
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("precios");
      }
    }
  );
};
controller.precpred = (req, res) => {
  cnn.query("SELECT * FROM cliente WHERE idcliente = 3", (err, red) => {
    if (err) {
      throw err;
    } else {
      res.render("precios", { data: red });
    }
  });
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
  const idp = req.body.pp;
  const ll = req.body.ll;
  const yy = req.body.yy;

  cnn.query(
    "UPDATE pisosprec SET layer1= '" +
      ll +
      "', layer3='" +
      yy +
      "' WHERE idcliente = '" +
      id +
      "'AND idpisos='" +
      idp +
      "'",
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/precios");
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
  cnn.query(
    "SELECT * FROM cliente WHERE mail=?",
    [usu],
    async (err, results) => {
      if (err) {
        next(new Error("Error de consulta login", err));
      }
      if (results != 0) {
        if (bcrypt.compare(con, results[0].password)) {
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
  uploada.single("image")(req, res, async (err) => {
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
    const cli = 3;

    // 1. Obtener los datos del cliente que se quiere copiar
    const [row] = await cnn.promise().query(
      "SELECT * FROM pisosprec WHERE idcliente = ?",
      [3] // Aquí se debe especificar el idcliente del cliente que se quiere copiar
    );

    // 2. Insertar el nuevo cliente en la tabla `cliente`
    const [result] = await cnn.promise().query("INSERT INTO cliente SET ?", {
      mail: email,
      password: pass,
      phone: phon,
      rol: rolex,
      address: add,
      postal: pos,
      state: sta,
      perfil: img,
    });

    // 3. Obtener el `idcliente` del cliente recién insertado
    const clienteId = result.insertId;
    // 4. Insertar una nueva fila en la tabla `pisosprec` con los mismos datos que la fila correspondiente al cliente que se quiere copiar, pero con el `idcliente` del nuevo cliente.
    await cnn
      .promise()
      .query(
        "INSERT INTO pisosprec (idpisos, layer1, layer3, idcliente) SELECT idpisos,layer1, layer3, ? FROM pisosprec WHERE idcliente = 3",
        [clienteId]
      );

    res.redirect("/account");
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
