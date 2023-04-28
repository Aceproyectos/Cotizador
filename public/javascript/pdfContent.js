const fomu = document.querySelector("#tab");
fomu.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = await fetch("https://acemardistributors.com/calcpdf");
  const json = await data.json();

  const sumaSegundaColumna = json.datos
    .map((item) => {
      const values = Object.keys(item).map((key) => item[key]);
      return values[3]; // Devuelve solo el valor de la segunda columna
    })
    .reduce((acc, curr) => acc + curr, 0); // Suma todos los valores de la segunda columna
  const sumaRedondeada = sumaSegundaColumna.toFixed(2);
  const content = {
    defaultStyle: {
      pageOrientation: "landscape",
    },
    style: {
      table: {
        border: "1px solid black",
        fontSize: 40,
      },
      th: {
        border: "1px solid black",
      },
      td: {
        border: "1px solid black",
      },
    },
    style: "tableExample",
    table: {
      headerRows: 1,
      widths: [
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
      ],
      body: [
        [
          {
            text: "Product",
            style: { fontSize: 13, bold: true },
            margin: [0, 0, 0, 10],
          },
          {
            text: "SKU",
            style: { fontSize: 13, bold: true },
            margin: [0, 0, 0, 10],
          },
          {
            text: "Top Layer",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "Pallets",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "SQF per Pallet",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "Boxes per pallet",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "SQL per Box",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "Unit Price SQF",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
          {
            text: "Total",
            style: { fontSize: 13, bold: true },
            margin: [15, 0, 0, 10],
          },
        ],
        ...json.datos.map((item) => {
          const values = Object.keys(item).map((key) => item[key]);
          const topLayerValue = values.splice(3, 1)[0];
          values.push(topLayerValue);
          return values;
        }),
        [
          { text: "", border: [false, false, false, false] }, // establece "border" en "false" para las celdas vacías
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
        ],
        [
          { text: "", border: [false, false, false, false] }, // establece "border" en "false" para las celdas vacías
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "Subtotal", border: [false, false, false, false] },
          { text: sumaRedondeada, border: [false, false, false, false] },
        ],
        [
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "Taks", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
        ],
        [
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "Shipping", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
        ],
        [
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "", border: [false, false, false, false] },
          { text: "Total", bold:true, border: [false, false, false, false] },
          { text: sumaRedondeada, border: [false, false, false, false] },
        ],
      ],
    },
    layout: "lightHorizontalLines",
    alignment: "center",
  };

  await fetch("https://acemardistributors.com/finalizar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });

  await fetch("https://acemardistributors.com/base", {
    method: "POST",
  });
  window.location.href = "https://acemardistributors.com/pisos";
});
