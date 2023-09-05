const fomu = document.querySelector("#tab");

fomu.addEventListener("submit", async function (e) {
  e.preventDefault();
  let hasPisosData = false;
  let hasPuertasData = false;
  let contentPisos; // Declarar contentPisos
  let contentPuertas; // Declarar contentPuertas
  let combinedContent;

  // Obtener todas las filas de la tabla
  const tabla = document.getElementById("tabla");
  if (tabla) {
    const tablaData = [
      [
        { text: "Product",style: "tablaheader"},
        { text: "Top Layer",style: "tablaheader"},
        { text: "Pallets",style: "tablaheader"},
        { text: "SQF per Pallet",style: "tablaheader"},
        { text: "Boxes per Pallet",style: "tablaheader"},
        { text: "SQL per Box",style: "tablaheader"},
        { text: "Unit Price SQF",style: "tablaheader"},
        { text: "Total",style: "tablaheader"},
      ],
    ];

    const filas = tabla.querySelectorAll("tbody tr");
    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");

      // Crear un array para almacenar los datos de la fila sin las posiciones 0 y 3
      const rowData = Array.from(celdas)
        .map((celda, index) => {
          if (index !== 0 && index !== 2 && index !== 3 && index !== 11) {
            return {
              text: celda.textContent.trim(),
            };
          }
        })
        .filter(Boolean); // Filtrar para eliminar elementos nulos/undefined

      tablaData.push(rowData);
    });

    contentPisos = {
      defaultStyle: {
        pageOrientation: "landscape",
      },
      table: {
        headerRows: 1,
        widths: [300, "*", "*", "*", "*", "*", "*", "*"],
        body: tablaData,
        fillColor: "#000000",
      },
      alignment: "center",
    };
    hasPisosData = true;
  }

  const tablaPuertas = document.getElementById("tablaPuertas");

  if (tablaPuertas) {
    const PuertasData = [
      [
        { text: "Product", style: "tablaheader" },
        { text: "Height", style: "tablaheader" },
        { text: "Width", style: "tablaheader" },
        { text: "Finish", style: "tablaheader" },
        { text: "Color", style: "tablaheader" },
        { text: "Opening", style: "tablaheader" },
        { text: "Core", style: "tablaheader" },
        { text: "Thickness", style: "tablaheader" },
        { text: "Quantity", style: "tablaheader" },
        { text: "Unit Price SQF", style: "tablaheader" },
        { text: "Total", style: "tablaheader" },
      ],
    ];

    const puertas = tablaPuertas.querySelectorAll("tbody tr");
    puertas.forEach((puerta) => {
      const celdas = puerta.querySelectorAll("td");
      // Crear un array para almacenar los datos de la fila sin las posiciones 0 y 3
      const rowData = Array.from(celdas)
        .map((celda, index) => {
          if (index !== 0 && index !== 2 && index !== 13 && index !== 14) {
            return {
              text: celda.textContent.trim(),
            };
          }
        })
        .filter(Boolean); // Filtrar para eliminar elementos nulos/undefined
      PuertasData.push(rowData);
    });

    contentPuertas = {
      defaultStyle: {
        pageOrientation: "landscape",
      },

      table: {
        headerRows: 1,
        widths: [200, 48, 42, 40, 40, 65, 48, 93, 65, 70, 65],
        body: PuertasData,
      },

      alignment: "center",
    };
    hasPuertasData = true;
  }

  if (hasPisosData && hasPuertasData) {
    const combinedContent = {
      tablaContent: contentPisos,
      puertasContent: contentPuertas,
    };
    console.log(
      "🚀 ~ file: pdfContent.js:140 ~ combinedContent:",
      combinedContent
    );
    await fetch("http://acemardistributors.com/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(combinedContent),
    });
  } else if (hasPisosData) {
    combinedContent = {
      tablaContent: contentPisos,
    };
    console.log(
      "🚀 ~ file: pdfContent.js:149 ~ combinedContent:",
      combinedContent
    );
    try {
      await fetch("http://acemardistributors.com/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedContent),
      });
    } catch (error) {
      console.log(error);
    }
  } else if (hasPuertasData) {
    combinedContent = {
      puertasContent: contentPuertas,
    };
    console.log(
      "🚀 ~ file: pdfContent.js:157 ~ combinedContent:",
      combinedContent
    );
    await fetch("http://acemardistributors.com/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(combinedContent),
    });
  }

  await fetch("http://acemardistributors.com/base", {
    method: "POST",
  });
  // Redirige después de generar el PDF
  window.location.href = "http://acemardistributors.com/pisos";
});
