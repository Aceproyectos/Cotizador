const fomu = document.querySelector("#tab");
fomu.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = await fetch("http://localhost:3000/calcpdf");
  const json = await data.json();

  const content = {
    style: {
      table: {
        border: "1px solid black",
        fontSize: 10,
      },
      th: {
        border: "1px solid black",
      },
      td: {
        border: "1px solid black",
      },
    },
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
          "Product",
          "SKU",
          "Top Layer",  
          "Pallets",
          "SQF per Pallet",
          "Boxes per pallet",
          "SQL per Box",
          "Unit Price SQF",
          "Total",
        ],
        ...json.datos.map((item) => {
          const values = Object.keys(item).map((key) => item[key]);
          const topLayerValue = values.splice(3, 1)[0];
          values.push(topLayerValue);
          return values;
        }),
      ],
    },
  };
  console.log(JSON.stringify(content, null, 2));
  

  await fetch("http://localhost:3000/finalizar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });

  await fetch("http://localhost:3000/base", {
    method: "POST",
  });
  window.location.href = "http://localhost:3000/pisos";
});
