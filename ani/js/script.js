$(function() {
    // btn1 클릭하면 .box1의 첫 번째 박스 부드럽게 사라지기
    $("#btn1").click(function() {
        $(".box1 div:first-child").fadeOut(1000);
    });

    // btn2 클릭하면 .box1의 첫 번째 박스 부드럽게 보이기
    $("#btn2").click(function() {
        $(".box1 div:first-child").fadeIn(1000);
    });

    // btn3 클릭하면 .box1의 두 번째 박스 보이기/숨기기
    $("#btn3").click(function() {
        $(".box1 div:last-child").fadeToggle();
    });
    //btn4를 클릭하면 .box2의 첫째박스 높이 0
    $("#btn4").click(function(){
        $(".box2 div:first-child").slideUp();
    })
    //btn5를 클릭하면 .btn2에 첫째박스 높이:원래대로
    $("#btn5").click(function(){
         $(".box2 div:first-child").slideDown();
    })
    //btn6을 클릭하면 .btn2에 두번째박스 높이0:원래대로(토글)
    $("#btn6").click(function(){
         $(".box2 div:nth-child(2)").slideToggle();
    })
    //btn7을 클릭하면 .btn2에 ani박스 오른쪽으로 이동(애니)
    $("#btn7").click(function(){
        $(".box2 .ani").animate({
            left: "840px"
        });
    })
    //btn8을 클릭하면 .btn2에 ani박스 원래대로 이동(애니)
    $("#btn8").click(function(){
        $(".box2 .ani").animate({
            left: "440px"
        });
    })
    //btn9를 클릭하면 .btn3에 첫째박스의 class(bg)를 추가(class)
    $("#btn9").click(function(){
        $(".box3 div:first-child").addClass("bg");
    });
    $("#btn10").click(function(){
        $(".box3 div:first-child").removeClass("bg");
    });
        
});