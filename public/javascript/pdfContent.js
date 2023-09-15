const fomu = document.querySelector("#tab");
const finishButton = document.querySelector("#finishButton");

$(document).ready(function () {
  $(".fin").on("click", function () {
    Swal.fire({
      title: "Payment information",
      html:
        '<label for="github-username">Payment</label>' +
        '<select id="payment-method" name="payment-method" class="swal2-select method-payment">' +
        '<option value="paypal">Cash in Advance</option>' +
        '<option value="credit-card">Credit Card</option>' +
        '<option value="bank-transfer">Check</option>' +
        '<option value="bank-transfer">Wine</option>' +
        "</select>" +
        '<label for="payment-method">Invoice to</label>' +
        '<input id="invoice" name="invoice" class="swal2-input invoice" placeholder="Enter Invoice To" type="number" step="0.01">' +
        "<label>Ship to</label>" +
        '<input id="shipping-price" name="shipping-price" class="swal2-input ship" placeholder="Enter shipping price" type="number" step="0.01">'+
        '<label class="swal2-input ship">Terms</label>'+
        '<input id="shipping-price" name="terms" class="swal2-input terms" placeholder="Terms of payment" type="text">',
      showCancelButton: true,
      confirmButtonText: "Finish",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        confirmButton: "bg-warning", // Aquí estableces la clase personalizada
      },
      preConfirm: () => {
        const paymentMethod = document.querySelector('select[name="payment-method"]').value;
        const invoice = document.querySelector('input[name="invoice"]').value;
        const shippingprice = document.querySelector('input[name="shipping-price"]').value;
        const terms = document.querySelector('input[name="terms"]').value;

        handleFormSubmit(paymentMethod, invoice, shippingprice, terms);
      },
    })
  });
});

async function handleFormSubmit(paymentMethod, invoice, shippingprice, terms) {
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
        { text: "Product", style: "tablaheader" },
        { text: "Top Layer", style: "tablaheader" },
        { text: "Pallets", style: "tablaheader" },
        { text: "SQF per Pallet", style: "tablaheader" },
        { text: "Boxes per Pallet", style: "tablaheader" },
        { text: "SQL per Box", style: "tablaheader" },
        { text: "Unit Price SQF", style: "tablaheader" },
        { text: "Total", style: "tablaheader" },
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
    const data = {
      paymentData: {
        paymentMethod: paymentMethod,
        invoice: invoice,
        shippingprice: shippingprice,
        terms: terms,
      },
      combinedContent : {
        tablaContent: contentPisos,
        puertasContent: contentPuertas,
      }
    };
    await fetch("https://acemardistributors.com/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else if (hasPisosData) {
    const data = {
      paymentData: {
        paymentMethod: paymentMethod,
        invoice: invoice,
        shippingprice: shippingprice,
        terms: terms,
      },
      combinedContent : {
        tablaContent: contentPisos,
        puertasContent: contentPuertas,
      }
    };
    try {
      await fetch("https://acemardistributors.com/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
  } else if (hasPuertasData) {
    const data = {
      paymentData: {
        paymentMethod: paymentMethod,
        invoice: invoice,
        shippingprice: shippingprice,
        terms: terms,
      },
      combinedContent : {
        tablaContent: contentPisos,
        puertasContent: contentPuertas,
      }
    };
    await fetch("https://acemardistributors.com/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  await fetch("https://acemardistributors.com/base", {
    method: "POST",
  });
  // Redirige después de generar el PDF
  window.location.href = "https://acemardistributors.com/pisos";
}
