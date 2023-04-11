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
          { text: "Product", style: "tableHeader" },
          { text: "SKU", style: "tableHeader" },
          { text: "Top Layer", style: "tableHeader" },
          { text: "Pallets", style: "tableHeader" },
          { text: "SQF per Pallet", style: "tableHeader" },
          { text: "Boxes per pallet", style: "tableHeader" },
          { text: "SQL per Box", style: "tableHeader" },
          { text: "Unit Price SQF", style: "tableHeader" },
          { text: "Total", style: "tableHeader" },
        ],
        ...json.datos.map((item) => {
          const values = Object.keys(item).map((key) => item[key]);
          const topLayerValue = values.splice(3, 1)[0];
          values.push(topLayerValue);
          return values;
        }),
      ],
    },
    layout: 'lightHorizontalLines',
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
