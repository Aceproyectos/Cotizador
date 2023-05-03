$(document).ready(function(){
    $('.act').on('click',function(){
        let btn=$('.act').index(this);
        let idp=$('.idp').eq(btn);
        let id=$('.ido').eq(btn);
        let layer1=$('.l1').eq(btn);
        let layer3=$('.l3').eq(btn);


        let d=id.val();
        let p=idp.val();
        let l=layer1.val();
        let y=layer3.val();

        alert("estos son los datos que se van a actualizar: este es el id del piso"+ d + "layer 1 "+l+"layer 2 "+y);
        
        $.ajax({
            type:"post",
            url:'/actprec',
            data:{
                pp:p,
                dd:d,
                ll:l,
                yy:y,
            }
        });
        location.reload();
    })
})