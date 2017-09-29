$(document).ready(function(){
    $('#modal1').modal();

$("#check").click(function (event) {
    check()
    $('#modal1').modal('open');
})
    // $("form").submit(function(e){
    //     e.preventDefault();
    // });




    $('ul.tab1').tabs({
        swipeable : true,
        responsiveThreshold : 1920
    });

    $('.parallax').parallax();



});
