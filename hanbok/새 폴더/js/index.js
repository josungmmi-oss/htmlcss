// index.js
// 기존 HTML/CSS 구조를 유지하면서 필요한 동작만 추가한 스크립트입니다.

window.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initHeroSlider();
  initGalleryRolling();
  initNoticeTabs();
});

function initMobileMenu() {
  const openBtn = document.querySelector(".menu-open");
  const closeBtn = document.querySelector(".menu-close");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!openBtn || !closeBtn || !mobileMenu) return;

  openBtn.addEventListener("click", function () {
    mobileMenu.classList.add("active");
  });

  closeBtn.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
  });
}

function initHeroSlider() {
  const track = document.getElementById("heroTrack");
  const heroNum = document.getElementById("heroNum");
  const heroThumbImg = document.getElementById("heroThumbImg");
  const heroInfo = document.querySelector(".hero-info");
  const controls = document.querySelectorAll(".hero-control span");
  if (!track) return;

  const heroData = [
    { number: "01", image: "./mainimages/banner.png" },
    { number: "02", image: "./mainimages/banner2.png" },
    { number: "03", image: "./mainimages/banner5.png" }
  ];

  let current = 0;
  let timer = null;

  function updateInfo(index) {
    const realIndex = index % heroData.length;
    const data = heroData[realIndex];
    if (heroNum) heroNum.textContent = data.number;
    if (heroThumbImg) heroThumbImg.src = data.image;
    if (heroInfo) heroInfo.style.setProperty("--hero-info-bg", `url('${data.image}')`);
    controls.forEach(function (control, controlIndex) {
      control.classList.toggle("active", controlIndex === realIndex);
    });
  }

  function moveTo(index, useTransition) {
    track.style.transition = useTransition ? "transform .75s ease" : "none";
    track.style.transform = `translateX(-${index * 25}%)`;
    updateInfo(index);
  }

  function nextSlide() {
    current += 1;
    moveTo(current, true);
    if (current === heroData.length) {
      window.setTimeout(function () {
        current = 0;
        moveTo(current, false);
      }, 780);
    }
  }

  updateInfo(0);
  timer = window.setInterval(nextSlide, 3500);

  track.addEventListener("mouseenter", function () {
    if (timer) window.clearInterval(timer);
  });

  track.addEventListener("mouseleave", function () {
    timer = window.setInterval(nextSlide, 3500);
  });
}

function initGalleryRolling() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;
  let timer = null;

  function setFeatured() {
    const cards = track.querySelectorAll(".gallery-card");
    cards.forEach(function (card, index) {
      card.classList.toggle("is-featured", index === 0);
    });
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (window.matchMedia("(max-width: 767px)").matches) {
      track.style.transform = "none";
      setFeatured();
      return;
    }
    timer = window.setInterval(function () {
      const first = track.querySelector(".gallery-card");
      if (!first) return;
      track.appendChild(first);
      setFeatured();
    }, 3000);
  }

  setFeatured();
  start();
  window.addEventListener("resize", start);
}

function initNoticeTabs() {
  const buttons = document.querySelectorAll(".tab-list button[data-filter]");
  const cards = document.querySelectorAll(".notice-card");
  if (buttons.length === 0 || cards.length === 0) return;

  function getCardType(card) {
    const badge = card.querySelector(".badge");
    const text = badge ? badge.textContent.trim() : "";
    if (text === "공지") return "notice";
    if (text === "뉴스") return "news";
    return "all";
  }

  function filterCards(filter) {
    cards.forEach(function (card) {
      const cardType = getCardType(card);
      const isVisible = filter === "all" || cardType === filter;
      card.hidden = !isVisible;
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter || "all";
      buttons.forEach(function (item) {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      filterCards(filter);
    });
  });

  filterCards("all");
}
