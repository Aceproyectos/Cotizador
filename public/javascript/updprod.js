$(document).ready(function () {
  $(".upt").on("click", function () {
    let btn = $(".upt").index(this);
    let id = $(".id").eq(btn);
    let producto = $(".prod").eq(btn);
    let code1 = $(".cd1").eq(btn);
    let code3 = $(".cd3").eq(btn);
    let inv1 = $(".inv1").eq(btn);
    let inv3 = $(".inv3").eq(btn);
    let imagenup = $(".imgu").eq(btn);

    let d = id.val();
    let p = producto.val();
    let c1 = code1.val();
    let c3 = code3.val();
    let i1 = inv1.val();
    let i3 = inv3.val();
    let im = imagenup.val();

    $.ajax({
      type: "post",
      url: "/updprod",
      data: {
        dd: d,
        pp: p,
        cc: c1,
        ccc: c3,
        ii: i1,
        io: i3,
        ii: im, // aquí cambiamos ii por im
      },
    });
    location.reload();
  });
});
