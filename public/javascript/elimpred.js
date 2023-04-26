$(document).ready(function(){
    $('.elimd').on('click',function(){
        let btn=$('.elimd').index(this);
        let idpiso=$('.idp').eq(btn);

        let p=idpiso.val();
        
        $.ajax({
            type:"post",
            url:'/elimpred',
            data:{
                pp:p,
            }
        });
        location.reload();
    })
})