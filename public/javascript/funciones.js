$("#puertas").bind("submit", async function () {
  cantidad = $("#cantidad").val();
  imgmarco = $("#cbxLenguajes").val();
  preciocon = $("#precio").val();
  icod = $("#codinicial").val();
  fcod = $("#codmarco").val();
  col = $("#colores").val();
  finse = $("#finihshddd").val();
  ker = $("#Kerfs").val();
  opn = $("#open").val();
  ven = $("#elvenner").val();
  core = $("#coreshjgjhg").val();
  puert = $("#producto").val();
  codfinish = $("#codfinish").val();
  prechith = $("#chig").val();
  preshith = $("#shig").val();
  finish = $("#codfinish").val();

  let cr, mr, cod, totl;
  if (codfinish == "true") {
    if (finse == "M") {
      if (preciocon == imgmarco) {
        sub = imgmarco * cantidad;
      } else {
        sub = imgmarco * cantidad;
      }
      finish = "Matt";
    }
    if (finse == "H") {
      if (preciocon == imgmarco) {
        sub = prechith * cantidad;
      } else {
        sub = preshith * cantidad;
      }
      finish = "High gloss"
    }
  } else {
    sub = imgmarco * cantidad;
  }
  if (core == "Honey Comb") {
    cr = "-HC-";
  } else {
    cr = "-SO-";
  }
  if (imgmarco == preciocon) {
    mr = "-F";
    fr = "Yes";
  } else {
    mr = " ";
    fr = "No";
  }
  if(col == "W1"){
    color = "White"
  }
  else if(col == "G1"){
    color = "Mocca"
  }
  else if(col == "M1"){
    color = "Gray"
  }

  cod = icod + finse + col + cr + fcod + mr + ven;

  var datos_cliente = {
    idpuerta: $("#idpuerta").val(),
    producto: $("#producto").val(),
    codigo: cod,
    color: color,
    imgpuerta: $("#imgpuerta").val(),
    imgmarco: sub,
    frame: fr,
    aimgf: $("#marco").val(),
    height: $("#hight").val(),
    width: $("#width").val(),
    finish: finish,
    opening: $("#opening").val(),
    core: $("#coreshjgjhg").val(),
    thickness: $("#Thickness").val(),
    precio: $("#precio").val(),
    cantidad: $("#cantidad").val(),
  };

  await fetch("https://acemardistributors.com/prueba", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos_cliente),
  });
  window.location("https://acemardistributors.com/lista")
});