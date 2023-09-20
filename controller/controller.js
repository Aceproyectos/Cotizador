const connection = require("../Connection/connection");
const cnn = connection;
const controller = {};
const bcrypt = require("bcryptjs");
const path = require("path");
const nodemailer = require("nodemailer");
const Pdfprinter = require("pdfmake");
const fs = require("fs");
var base64Img = require("base64-img");
const multer = require("multer");
const { countReset } = require("console");
const { fillColor, text } = require("pdfkit");
const Pbkdf2 = require("nodejs-pbkdf2");

controller.index = (req, res, next) => {
  res.render("index");
};
controller.formulario = (req, res, next) => {
  res.render("formulario");
};
controller.door = (req, res, next) => {
  res.render("doors");
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
controller.actuDoor = (req, res, next) => {
  res.render("actuDoor");
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

const baseStoragePath = "public/images/doors";
const storageDoor = multer.diskStorage({
  destination: function (req, file, cb) {
    // Obtén el nombre de la carpeta desde el nombre original del archivo sin la extensión
    const folderName = path.parse(file.originalname).name;

    const folderPath = path.join(baseStoragePath, folderName);

    console.log("🤗🙂🙂" + folderPath);

    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error al crear la carpeta:", err);
      } else {
        console.log("Carpeta creada con éxito.");
        req.folderName = folderName; // Almacena folderName en la solicitud para su uso posterior
        cb(null, folderPath);
      }
    });
    // Establece el directorio donde se almacenará el archivo
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename); // set the filename of the file
  },
});

const uploadDoor = multer({ storage: storageDoor });

controller.newDoor = (req, res) => {
  uploadDoor.single("imgproduct")(req, res, (err) => {
    if (err) {
      console.log("Error al subir el archivo:", err);
      // Maneja el error aquí
    } else {
      const imgFileName = req.file.filename; // Nombre del archivo con extensión
      const producto = req.body.producto;
      const img = req.file.filename;
      const marco = req.body.marco;
      const finish = req.body.finish;
      const priceMatCon = req.body.priceMatCon;
      const priceMatSin = req.body.priceMatSin;
      const priceGlosCon = req.body.priceGlosCon;
      const priceGlosSin = req.body.priceGlosSin;

      const cbox1 = req.body.cbox1 === "on" ? "true" : "false";
      const cbox2 = req.body.cbox2 === "on" ? "true" : "false";
      const cbox3 = req.body.cbox3 === "on" ? "true" : "false";
      const cbox4 = req.body.cbox4 === "on" ? "true" : "false";
      const cbox5 = req.body.cbox5 === "on" ? "true" : "false";

      cnn.query(
        "INSERT INTO puertas SET ?",
        {
          producto: producto,
          directorio: req.folderName,
          imgpuerta: img,
          imgmarco: marco,
          finish: finish,
          conmarco: priceMatCon,
          sinmarco: priceMatSin,
          conhigth: priceGlosCon,
          sinhight: priceGlosSin,
        },
        (err, result) => {
          if (err) {
            console.log("Error en el insertar puertas 😫");
            throw err;
          } else {
            console.log(cbox1);
            cnn.query("INSERT INTO codigo SET ?", {
              id: result.insertId,
              color: cbox1,
              finish: cbox2,
              kerfs: cbox3,
              core: cbox4,
              veneer: cbox5,
            });
            console.log("Se insertó con éxito las puertas");
            res.redirect("doors");
          }
        }
      );
    }
  });
};

controller.updateDoor = (req, res) => {
  uploadDoor.single("imgproduct")(req, res, (err) => {
    if (err) {
      console.log("Error al subir el archivo:", err);
      // Maneja el error aquí
    } else {
      const producto = req.body.producto;
      const marco = req.body.marco;
      const finish = req.body.finish;
      const id = req.body.id;

      const cbox1 = req.body.cbox1;
      const cbox2 = req.body.cbox2;
      const cbox3 = req.body.cbox3;
      const cbox4 = req.body.cbox4;
      const cbox5 = req.body.cbox5;

      if (req.file) {
        const img = req.file.filename;
        cnn.query(
          "UPDATE puertas SET producto= '" +
            producto +
            "', directorio= '" +
            req.folderName +
            "',imgpuerta= '" +
            img +
            "',imgmarco= '" +
            marco +
            "',finish= '" +
            finish +
            "' WHERE id = '" +
            id +
            "'",
          (err) => {
            if (err) {
              console.log("Error en el actualizar puertas 😫");
              throw err;
            } else {
              console.log(cbox1);
              cnn.query(
                "UPDATE codigo SET color = '" +
                  cbox1 +
                  "', finish= '" +
                  cbox2 +
                  "',kerfs= '" +
                  cbox3 +
                  "',core= '" +
                  cbox4 +
                  "', veneer= '" +
                  cbox5 +
                  "' WHERE id = '" +
                  id +
                  "'"
              );
              res.redirect("doors");
            }
          }
        );
      } else {
        cnn.query(
          "UPDATE puertas SET producto= '" +
            producto +
            "', imgmarco= '" +
            marco +
            "',finish= '" +
            finish +
            "' WHERE id = '" +
            id +
            "'",
          (err) => {
            if (err) {
              console.log("Error en el actualizar puertas 😫");
              throw err;
            } else {
              console.log(cbox1);
              cnn.query(
                "UPDATE codigo SET color = '" +
                  cbox1 +
                  "', finish= '" +
                  cbox2 +
                  "',kerfs= '" +
                  cbox3 +
                  "',core= '" +
                  cbox4 +
                  "', veneer= '" +
                  cbox5 +
                  "' WHERE id = '" +
                  id +
                  "'"
              );
              res.redirect("doors");
            }
          }
        );
      }
    }
  });
};

controller.elimDoors = (req, res) => {
  id = req.body.dd;
  cnn.query("DELETE FROM puertas WHERE id = '" + id + "'", (err) => {
    if (err) {
      console.log("Error al eliminar puertas");
      throw err;
    } else {
      res.redirect("doors");
    }
  });
};
controller.pricedoor = (req, res) => {
  cnn.query("SELECT * FROM puertas", (err, resu) => {
    if (err) {
      throw err;
    } else {
      res.render("priceDoor", { datos: resu });
    }
  });
};
controller.pricedoors = (req, res) => {
  const id = req.body.dd;
  const conmarco = req.body.ll;
  const sinmarco = req.body.gg;
  const conhigth = req.body.hh;
  const sinhigth = req.body.jj;

  cnn.query(
    "UPDATE puertas SET conmarco=?,sinmarco=?,conhigth=?,sinhight=? WHERE id = ?",
    [conmarco, sinmarco, conhigth, sinhigth, id],
    (err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/pricedoor");
      }
    }
  );
};

controller.door = (req, res) => {
  cnn.query(
    "SELECT * FROM puertas INNER JOIN codigo ON(puertas.id = codigo.id)",
    (err, ppp) => {
      if (err) {
        console.log("Error en la consulta de puertas");
        throw err;
      } else {
        res.render("doors", { datos: ppp });
      }
    }
  );
};

controller.productos = (req, res) => {
  const use = req.session.user;
  cnn.query("SELECT * FROM pisos", (err, results) => {
    if (err) {
      throw err;
    } else {
      res.render("productos", { datos: results, user: use });
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
  const numeroFormateado = await req.session.numeroFormateado;
  const subtotal = await req.session.subtotal;
  const impuesto = await req.session.impuesto;
  const envio = await req.session.envio;
  cnn.query(
    "SELECT  ROUND(SUM(total), 2) AS sum FROM productos WHERE id_cliente = '" +
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
              "UPDATE productos SET id_enc = '" +
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
                "', total = '" +
                numeroFormateado +
                "', subtotal = '" +
                subtotal +
                "', impuesto = '" +
                impuesto +
                "', envio = '" +
                envio +
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

controller.prueba = async (req, res, next) => {
  const doc = await req.session.docu; //ID DEL CLIENTE
  const numero = 0;
  const subtotal = 0;
  const impuesto = 0;
  const envio = 0;
  idpuerta = req.body.idpuerta;
  sku = req.body.codigo;
  image = req.body.imgpuerta;
  unit_price = req.body.precio;
  frame = req.body.frame;
  height = req.body.height;
  width = req.body.width;
  finish = req.body.finish;
  opening = req.body.opening;
  core = req.body.core;
  thickness = req.body.thickness;
  cantidad = req.body.cantidad;
  total = req.body.imgmarco;
  color = req.body.color;

  cnn.query(
    "INSERT INTO productos SET ?",
    {
      id_enc: 1,
      id_cliente: doc,
      sku: sku,
      image: image,
      unit_price: unit_price,
      total: total,
    },
    (err, result) => {
      if (err) {
        console.log("Error en insertar productos", err);
        throw err;
      } else {
        const productId = result.insertId;
        cnn.query(
          "INSERT INTO detalles_puertas SET ?",
          {
            id: productId,
            product_id: idpuerta,
            frame: frame,
            color: color,
            height: height,
            width: width,
            finish: finish,
            opening: opening,
            core: core,
            thickness: thickness,
            quantity: cantidad,
          },
          (err) => {
            if (err) {
              console.log("error al insertar puertas", err);
            } else {
              console.log("puertas insertadas correctamente");
              res.redirect("/lista");
            }
          }
        );
      }
    }
  );
  const d = 1,
    b = 5000;
  cnn.query("INSERT INTO  factura SET ?", {
    id_encabezado: b,
    id_cliente: doc,
    total: numero,
    subtotal: subtotal,
    impuesto: impuesto,
    envio: envio,
  });
};

controller.finalizar = async (req, res) => {
  const user = req.session.user;
  const perf = req.session.per;
  const doc = req.session.docu;
  const cor = req.session.cor;

  const data = req.body.paymentData; // Obtiene los datos de pago
  const method = data.paymentMethod;
  const invoice = parseInt(data.invoice);
  const shipping = parseInt(data.shippingprice);
  const terms = data.terms;
  const combinedContent = req.body.combinedContent; // Obtiene los contenidos combinados
  const tablaContent = combinedContent.tablaContent; // Obtiene el contenido de la tabla
  const puertasContent = combinedContent.puertasContent; // Obtiene el contenido de las puertas

  let totalTabla = 0.0;
  let totalPuertas = 0.0;

  async function getCustomers() {
    let phone, address, postal, state;
    if (!doc) {
      throw new Error("El valor de 'doc' no está definido.");
    }

    const result = await cnn
      .promise()
      .query("SELECT * FROM cliente WHERE id=?", [doc]);

    phone = result[0][0].phone;
    address = result[0][0].address;
    postal = result[0][0].postal;
    state = result[0][0].state;

    return { phone, address, postal, state };
  }

  const phone = await getCustomers();

  if (tablaContent) {
    for (
      let rowIndex = 1;
      rowIndex < tablaContent.table.body.length;
      rowIndex++
    ) {
      const rowData = tablaContent.table.body[rowIndex];
      if (rowData[7] && rowData[7].text) {
        const totalValue = parseFloat(
          rowData[7].text.replace("$", "").replace(/,/g, "")
        );
        totalTabla += totalValue;
      }
    }
  }

  if (puertasContent) {
    for (
      let rowIndex = 1;
      rowIndex < puertasContent.table.body.length;
      rowIndex++
    ) {
      const rowData = puertasContent.table.body[rowIndex];
      if (rowData[10] && rowData[10].text) {
        const totalValue = parseFloat(
          rowData[10].text.replace("$", "").replace(/,/g, "")
        );
        totalTabla += totalValue;
      }
    }
  }
  total = totalTabla + totalPuertas;
  let rendtotal = Math.round(total);
  let suma = rendtotal + shipping + invoice;
  const opciones = {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const numeroFormateado = suma.toLocaleString("en", {
    style: "currency",
    currency: "USD",
  });
  const subtotal = rendtotal.toLocaleString("en", {
    style: "currency",
    currency: "USD",
  });
  const impueto = shipping.toLocaleString("en", {
    style: "currency",
    currency: "USD",
  });
  const envio = invoice.toLocaleString("en", {
    style: "currency",
    currency: "USD",
  });
  req.session.numeroFormateado = await numeroFormateado;
  req.session.subtotal = await subtotal;
  req.session.impuesto = await impueto;
  req.session.envio = await envio;
  //var numeroFormateado = new Intl.NumberFormat('es-ES').format(total);

  const PdfPrinter = require("pdfmake");
  const fonts = {
    CenturyGothic: {
      normal: "./public/fonts/Century/GOTHIC.TTF",
      bold: "./public/fonts/Century/GOTHICB.TTF",
      italics: "./public/fonts/Century/GOTHIC.TTF",
      bolditalics: "./public/fonts/Century/GOTHIC.TTF",
    },
  };

  const printer = new PdfPrinter(fonts);
  var imagenBase64 = base64Img.base64Sync(
    "./public/images/perfil/" + perf + ""
  );
  var acemar = base64Img.base64Sync("./public/images/redes/acemarUS.png");

  const alternatingRowLayout = {
    fillColor: function (rowIndex, node, columnIndex) {
      return rowIndex % 2 === 0 ? "#CCCCCC" : null;
    },
  };

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
        absolutePosition: { x: 600, y: 20 },
      },
      {
        text: user,
        absolutePosition: { x: 700, y: 20 },
        style: "usuario",
      },
      {
        text: "PRE-ORDER",
        bold: true,
        fontSize: 20,
        alignment: "center",
      },
      {
        table: {
          body: [
            ["Phone", phone.phone],
            ["Address", phone.address],
            ["Postal", phone.postal],
            ["State", phone.state],
          ],
        },
        layout: "noBorders",
        absolutePosition: { x: 800, y: 10 },
      },
    ],
    footer: function (currentPage, pageCount) {
      return [
        {
          text: "Phone: 727 584 3711 - cfo@acemar.us",
          style: "footer1",
        },
        {
          text: "2310 Tall Pines Drive - Suite 230, Largo Florida",
          style: "footer2",
        },
      ];
    },

    styles: {
      footer1: {
        alignment: "center",
        bold: "true",
      },
      footer2: {
        alignment: "center",
      },

      yellowBackgroundStyle: {
        fontSize: 14,
        background: "#FF0909", // Amarillo
        color: "black", // Color de texto
        margin: [0, -35, 0, 0],
        alignment: "center",
      },

      tablaheader: {
        fontSize: 15,
        color: "black",
        bold: true,
        fillColor: "#F5F5F5",
      },
    },

    defaultStyle: {
      font: "CenturyGothic",
      fontSize: 15,
      bold: false,
    },
  };

  if (tablaContent) {
    docDefinition.content.push({
      headerRows: 1,
      ...tablaContent,
      layout: alternatingRowLayout,
      margin: [0, 50, 0, 0],
      fontSize: 15,
      layout: "lightHorizontalLines",
    });
  }

  if (puertasContent) {
    docDefinition.content.push({
      ...puertasContent,
      margin: [0, 50, 0, 0],
      fontSize: 15,
      layout: "lightHorizontalLines",
    });
  }

  // Agrega el precio debajo de las tablas
  docDefinition.content.push({
    layout: "noBorders",
    table: {
      widths: ["auto", 100],
      body: [
        [
          { text: "Subtotal:", fontSize: 14, alignment: "left" },
          { text: subtotal, alignment: "right", fontSize: 14 },
        ],
        [
          { text: "Shipping:", fontSize: 14, alignment: "left" },
          { text: impueto, alignment: "right", fontSize: 14 },
        ],
        [
          { text: "Invoice:", fontSize: 14, alignment: "left" },
          { text: envio, alignment: "right", fontSize: 14 },
        ],
        [
          {
            text: "Total:",
            fontSize: 14,
            bold: true,
            fillColor: "#FFD700",
            alignment: "left",
          },
          {
            text: numeroFormateado,
            fontSize: 14,
            bold: true,
            alignment: "right",
            fillColor: "#FFD700",
          },
        ],
        [
          {
            text: "Method:",
            fontSize: 14,
            margin: [0, 20], // Margen superior e inferior de 10 unidades
            alignment: "left",
          },
          {
            text: method,
            alignment: "right",
            fontSize: 14,
            margin: [0, 20], // Margen superior e inferior de 10 unidades
          },
        ],
      ],
    },
    margin: [750, 20, 60, 0], // Ajusta el margen superior para separar el precio de las tablas
  });
  // Agrega el texto "Terms of Payment:" con el estilo de fondo amarillo
  docDefinition.content.push({
    canvas: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: 615, // Ancho del cuadro
        h: 70, // Altura del cuadro
        color: "#FFF8AD", // Color de fondo amarillo
      },
    ],
    margin: [30, -130, 0, 30], // Margen superior para separar el cuadro del texto
  });

  // Luego, agrega el texto encima del cuadro
  docDefinition.content.push({
    text: "Terms: " + terms + "",
    zIndex: 1, // Asegura que el texto esté encima del cuadro
    margin: [50, -90, 0, 30],
  });

  docDefinition.content.push(
    {
      columns: [
        {
          width: "auto",
          text: "Account: Acemar Wood Products",
          margin: [80, 70, 0, 0],
          background: "#000000",
          color: "white",
        },
        {
          width: "auto",
          text: "Account Number: 785556",
          margin: [80, 70, 0, 0],
          background: "#000000",
          color: "white",
        },
        {
          // fixed width
          width: "auto",
          text: "Rounting Number: 02542",
          margin: [80, 70, 0, 0],
          background: "#000000",
          color: "white",
        },
      ],
    },
    {
      text: "The images are for reference only. Due to the natural characteristics of wood, we cannot guarantee that the shades and grains will be uniform.",
      style: "footer2",
    }
  );

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
      console.log("error consulta de el encabezada de la factura calcpdf");
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

controller.piso = async (req, res, next) => {
  try {
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

    let ly, cod, prec, sqf, boxes;

    if (gro == 1.5) {
      ly = ly1 * cant;
      cod = cod1;
      prec = ly1;
      sqf = 881.4;
      boxes = 30;
      await updatePisosInventory(id, cant);
    } else {
      ly = ly3 * cant;
      cod = cod3;
      prec = ly3;
      sqf = 734.5;
      boxes = 25;
      await updatePisosInventory3(id, cant);
    }

    const productoId = await insertProducto(doc, ly, img, cod, prec);
    await insertDetallesPisos(productoId, id, gro, cant, sqf, boxes);
    await insertFactura(doc, d);

    res.redirect("lista");
  } catch (error) {
    console.error("Error:", error);
    // Manejar el error apropiadamente
    next(error);
  }
};

function updatePisosInventory(id, cant) {
  return new Promise((resolve, reject) => {
    cnn.query(
      "UPDATE pisos SET inventario=inventario-? WHERE id = ?",
      [cant, id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function updatePisosInventory3(id, cant) {
  return new Promise((resolve, reject) => {
    cnn.query(
      "UPDATE pisos SET inventario3=inventario3-? WHERE id = ?",
      [cant, id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function insertProducto(doc, ly, img, cod, prec) {
  return new Promise((resolve, reject) => {
    cnn.query(
      "INSERT INTO productos SET ?",
      {
        id_enc: 1,
        id_cliente: doc,
        total: ly,
        image: img,
        sku: cod,
        unit_price: prec,
      },
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
}

function insertDetallesPisos(productoId, id, gro, cant, sqf, boxes) {
  return new Promise((resolve, reject) => {
    cnn.query(
      "INSERT INTO detalles_pisos SET ?",
      {
        id: productoId,
        product_id: id,
        top_layer: gro,
        pallets: cant,
        sqf_per_pallet: sqf,
        boxes_per_pallet: boxes,
      },
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function insertFactura(doc, d) {
  return new Promise((resolve, reject) => {
    cnn.query(
      "INSERT INTO factura SET ?",
      {
        id_encabezado: 5000,
        id_cliente: doc,
        total: 1,
      },
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

controller.validarlogin = async (req, res, next) => {
  const usu = await req.body.user;
  const con = req.body.pass;
  cnn.query(
    "SELECT * FROM cliente WHERE mail=?",
    [usu],
    async (err, results) => {
      if (err) {
        next(new Error("Error de consulta login", err));
      }
      if (results != 0) {
        const pass = bcrypt.compareSync(con, results[0].password);
        console.log(pass);
        if (await bcrypt.compare(con, results[0].password)) {
          req.session.Login = true;
          const doc = (req.session.docu = results[0].id);
          const cor = (req.session.cor = results[0].mail);
          const per = (req.session.per = results[0].perfil);
          const user = (req.session.user = results[0].nombre);
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
  uploada.single("image")(req, res, async (err) => {
    if (err) {
      throw err;
    }
    const password = req.body.pass;
    console.log(password);
    const pass = await bcrypt.hashSync(password, 8);
    const img = req.file.filename;
    const name = req.body.name;
    const email = req.body.email;
    const phon = req.body.phone;
    const rolex = req.body.rolex;
    const add = req.body.address;
    const pos = req.body.postal;
    const sta = req.body.state;
    const fle = req.body.flete;
    const cond = req.body.condiciones;
    const cli = 3;

    // 1. Obtener los datos del cliente que se quiere copiar
    const [row] = await cnn.promise().query(
      "SELECT * FROM pisosprec WHERE idcliente = ?",
      [3] // Aquí se debe especificar el idcliente del cliente que se quiere copiar
    );

    // 2. Insertar el nuevo cliente en la tabla `cliente`
    const [result] = await cnn.promise().query("INSERT INTO cliente SET ?", {
      mail: email,
      nombre: name,
      password: pass,
      phone: phon,
      rol: rolex,
      address: add,
      postal: pos,
      state: sta,
      perfil: img,
      flete: fle,
      condiciones: cond,
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
  uploada.single("image")(req, res, async (err) => {
    if (err) {
      throw err;
    }
    const password = String(req.body.pass);
    const pass = await bcrypt.hashSync(password, 8);
    const id = req.body.id;
    const email = req.body.email;
    const name = req.body.name;
    const phon = req.body.phone;
    const rolex = req.body.rolex;
    const add = req.body.address;
    const pos = req.body.postal;
    const sta = req.body.state;
    const con = req.body.condiciones;
    const fle = req.body.flete;
    if (req.file) {
      const img = req.file.filename;

      const sql =
        "UPDATE cliente SET mail=?, nombre=?, password=?, phone=?, rol=?, address=?, postal=?, state=?, perfil=?, flete=?, condiciones=? WHERE id=?";

      // Valores a insertar
      const values = [
        email,
        name,
        pass,
        phone,
        rol,
        address,
        postal,
        state,
        img,
        fle,
        con,
        id,
      ];

      cnn.query(sql, values, (error, results) => {
        if (error) {
          throw error;
        }
        res.redirect("account");

        console.log("Filas actualizadas:", results.affectedRows);
      });
    } else {
      cnn.query(
        "UPDATE cliente SET mail='" +
          email +
          "', nombre = '" +
          name +
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
          "', flete = '" +
          fle +
          "', condiciones = '" +
          con +
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
  const use = req.session.user;
  cnn.query("SELECT * FROM pisos", (err, resd) => {
    if (err) {
      console.log("error consulta de los pisos");
    } else {
      res.render("pisos", { datos: resd, perf: per, user: use });
    }
  });
};

controller.elimcarrpuert = (req, res) => {
  const id = req.body.dd;
  cnn.query("DELETE FROM productos WHERE id = '" + id + "'", (err) => {
    if (err) {
      console.log("Error al eliminar puertas del carrito");
      throw err;
    } else {
      res.redirect("lista");
    }
  });
};

controller.elimcarrito = (req, res) => {
  const id = req.body.dd;
  const producto = req.body.pp;
  const cant = req.body.cc;
  const ly = req.body.ll;

  if (ly == 3) {
    cnn.query(
      "UPDATE pisos SET inventario3 = inventario3 +'" +
        cant +
        "' WHERE id ='" +
        producto +
        "'"
    );
  } else {
    cnn.query(
      "UPDATE pisos SET inventario = inventario +'" +
        cant +
        "' WHERE id ='" +
        producto +
        "'"
    );
  }
  cnn.query(
    "DELETE FROM productos WHERE id_enc = 1 AND id = '" + id + "'",
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
  const use = req.session.user;
  var pisosQuery =
    "SELECT pi.producto, pi.id AS pisos, p.id, p.image, p.sku, p.total, p.unit_price, dp.top_layer, dp.pallets, dp.sqf_per_pallet, dp.boxes_per_pallet, (SELECT ROUND(SUM(total), 2) FROM productos WHERE id_cliente = '" +
    doc +
    "' AND id_enc = 1) AS total_sum FROM productos p INNER JOIN detalles_pisos dp ON p.id = dp.id INNER JOIN pisos pi ON dp.product_id = pi.id WHERE p.id_cliente = '" +
    doc +
    "' AND p.id_enc = 1;";

  var puertasQuery =
    "SELECT pu.producto, p.id AS idpro, p.sku, p.image, p.unit_price, p.total,dp.color, dp.height, dp.width, dp.finish, dp.opening, dp.core, dp.thickness, dp.quantity, " +
    "(SELECT ROUND(SUM(p.total), 2) FROM productos p INNER JOIN detalles_puertas dp ON (p.id=dp.id) INNER JOIN puertas pu ON(dp.product_id = pu.id) WHERE p.id_cliente = '" +
    doc +
    "' AND p.id_enc=1) AS total_sum " +
    "FROM productos p INNER JOIN detalles_puertas dp ON (p.id=dp.id) INNER JOIN puertas pu ON(dp.product_id = pu.id) WHERE p.id_cliente = '" +
    doc +
    "' AND p.id_enc=1;";

  try {
    const pisosResult = await queryAsync(pisosQuery, [doc]);
    const puertasResult = await queryAsync(puertasQuery, [doc]);

    res.render("lista", {
      datosPisos: pisosResult,
      datosPuertas: puertasResult,
      co: cor,
      perf: per,
      user: use,
    });
  } catch (err) {
    console.log("Error en la consulta:", err);
    // Manejar el error apropiadamente
    next(err);
  }
};

// Función para ejecutar consultas con Promesas
function queryAsync(query, params) {
  return new Promise((resolve, reject) => {
    cnn.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

controller.index = async (req, res) => {
  const per = req.session.per;
  const use = req.session.user;
  cnn.query("SELECT * FROM puertas", (err, resbd) => {
    if (err) {
      console.log("error en consultar puertas");
      throw err;
    } else {
      res.render("index", { datos: resbd, perf: per, user: use });
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
