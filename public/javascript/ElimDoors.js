$(document).ready(function () {
  $(".elim").on("click", function () {
    let btn = $(".elim").index(this);
    let id = $(".id").eq(btn);

    let d = id.val();

    $.ajax({
      type: "post",
      url: "/elimDoors",
      data: {
        dd: d,
      },
    });
    location.reload();
  });
});
