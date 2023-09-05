$(document).ready(function () {
  $(".elim").on("click", function () {
    let btn = $(".elim").index(this);
    let id = $(".id").eq(btn);
    let idpiso = $(".idpiso").eq(btn);
    let cant = $(".cant").eq(btn);
    let ly = $(".layer").eq(btn);

    let d = id.val();
    let p = idpiso.val();
    let c = cant.val();
    let l = ly.val();

    $.ajax({
      type: "post",
      url: "/elimcarrito",
      data: {
        dd: d,
        pp: p,
        cc: c,
        ll: l,
      },
    });
    location.reload();
  });
});

$(document).ready(function () {
  $(".elimpuerta").on("click", function () {
    let btn = $(".elimpuerta").index(this);
    let id = $(".idpro").eq(btn);

    let d = id.val();

    $.ajax({
      type: "post",
      url: "/elimcarrpuert",
      data: {
        dd: d,
      },
    });
    location.reload();
  });
});
