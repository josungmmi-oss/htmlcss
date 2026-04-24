$(function(){

  // 햄버거 버튼 클릭 시 메뉴 열기
  $(".menu-btn").click(function(){
    $(".cover").fadeIn(300);
    $(".mobile-menu").animate({right: 0}, 300);
  });

  // X 버튼 클릭 시 메뉴 닫기
  $(".close-btn").click(function(){
    $(".mobile-menu").animate({right: "-100%"}, 300);
    $(".cover").fadeOut(300);
  });

  // 어두운 배경 클릭 시 메뉴 닫기
  $(".cover").click(function(){
    $(".mobile-menu").animate({right: "-100%"}, 300);
    $(".cover").fadeOut(300);
  });

});