$(document).ready(function(){
    $('.elim').on('click',function(){
        let btn=$('.elim').index(this);
        let idpiso=$('.id').eq(btn);

        let p=idpiso.val();
        
        $.ajax({
            type:"post",
            url:'elimaccount',
            data:{
                pp:p,
            }
        });
        location.reload();
    })
})