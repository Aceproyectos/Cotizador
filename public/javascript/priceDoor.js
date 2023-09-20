$(document).ready(function(){
    $('.actu').on('click',function(){
        let btn=$('.actu').index(this);
        let id=$('.id').eq(btn);
        let mattewo=$('.l1').eq(btn);
        let mattewu=$('.l2').eq(btn);
        let highwo=$('.l3').eq(btn);
        let highwu=$('.l4').eq(btn);


        let d=id.val();
        let l=mattewo.val();
        let g=mattewu.val();
        let h=highwo.val();
        let j=highwu.val();
        
        $.ajax({
            type:"post",
            url:'/pricedoors',
            data:{
                dd:d,
                ll:l,
                gg:g,
                hh:h,
                jj:j
            }
        });
        location.reload();
    })
})