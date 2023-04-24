$(document).ready(function(){
    $('.elimd').on('click',function(){
        let btn=$('.elimd').index(this);
        let idpiso=$('.idp').eq(btn);
        let cli=$('.ido').eq(btn);


        let p=idpiso.val();
        let c=cli.val();
        
        $.ajax({
            type:"post",
            url:'/elimprecli',
            data:{
                pp:p,
                cc:c,
            }
        });
        location.reload();
    })
})