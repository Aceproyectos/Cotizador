$(document).ready(function(){
    $('.elim').on('click',function(){
        let btn=$('.elim').index(this);
        let idpiso=$('.ido').eq(btn);

        let p=idpiso.val();
        
        $.ajax({
            type:"post",
            url:'elimpro',
            data:{
                pp:p,
            }
        });
        location.reload();
    })
})