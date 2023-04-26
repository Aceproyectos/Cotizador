$(document).ready(function(){
    $('.actu').on('click',function(){
        let btn=$('.actu').index(this);
        let id=$('.idp').eq(btn);
        let layer1=$('.l1').eq(btn);
        let layer3=$('.l3').eq(btn);

        let d=id.val();
        let l=layer1.val();
        let y=layer3.val();

        $.ajax({
            type:"post",
            url:'/actpred',
            data:{
                dd:d,
                ll:l,
                yy:y,
            }
        });
        location.reload();
    })
})