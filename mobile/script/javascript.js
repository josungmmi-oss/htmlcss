window.addEventListener("DOMContentLoaded", function () {

  // 필요한 요소 선택
  let menuBtn = document.querySelector(".menu-btn");
  let closeBtn = document.querySelector(".close-btn");
  let cover = document.querySelector(".cover");
  let mobileMenu = document.querySelector(".mobile-menu");

  // 햄버거 버튼 클릭 시 메뉴 열기
  menuBtn.addEventListener("click", function () {
    cover.style.display = "block";
    mobileMenu.style.right = "0";
  });

  // X 버튼 클릭 시 메뉴 닫기
  closeBtn.addEventListener("click", function () {
    mobileMenu.style.right = "-100%";
    cover.style.display = "none";
  });

  // 어두운 배경 클릭 시 메뉴 닫기
  cover.addEventListener("click", function () {
    mobileMenu.style.right = "-100%";
    cover.style.display = "none";
  });

});