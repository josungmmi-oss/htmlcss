const menuOpen = document.querySelector(".menu-open");
    const menuClose = document.querySelector(".menu-close");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuOpen && menuClose && mobileMenu) {
      menuOpen.addEventListener("click", function () {
        mobileMenu.classList.add("active");
      });

      menuClose.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
      });
    }


    const heroTrack = document.getElementById("heroTrack");
    const heroNum = document.getElementById("heroNum");
    const heroThumbImg = document.getElementById("heroThumbImg");
    const heroInfo = document.querySelector(".hero-info");
    const heroControls = document.querySelectorAll(".hero-control span");
    const heroSlides = [
      "./mainimages/banner.png",
      "./mainimages/banner2.png",
      "./mainimages/banner5.png"
    ];
    let heroIndex = 0;
    let heroMoving = false;

    function updateHeroInfo(index) {
      const realIndex = index % heroSlides.length;
      if (heroNum) heroNum.textContent = String(realIndex + 1).padStart(2, "0");
      if (heroThumbImg) heroThumbImg.src = heroSlides[realIndex];
      if (heroInfo) heroInfo.style.setProperty("--hero-info-bg", "url('" + heroSlides[realIndex] + "')");
      heroControls.forEach(function (bar, barIndex) {
        bar.classList.toggle("active", barIndex === realIndex);
      });
    }

    function rollHeroLeft() {
      if (!heroTrack || heroMoving) return;
      heroMoving = true;
      const nextIndex = heroIndex + 1;
      heroTrack.style.transition = "transform .75s ease";
      heroTrack.style.transform = "translateX(-" + (nextIndex * 25) + "%)";
      updateHeroInfo(nextIndex);

      const finishHero = function () {
        heroTrack.removeEventListener("transitionend", finishHero);
        if (nextIndex >= heroSlides.length) {
          heroTrack.style.transition = "none";
          heroTrack.style.transform = "translateX(0)";
          heroIndex = 0;
          updateHeroInfo(0);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              heroTrack.style.transition = "transform .75s ease";
              heroMoving = false;
            });
          });
        } else {
          heroIndex = nextIndex;
          heroMoving = false;
        }
      };

      heroTrack.addEventListener("transitionend", finishHero);
    }

    updateHeroInfo(0);
    window.setInterval(rollHeroLeft, 5000);

    const galleryTrack = document.getElementById("galleryTrack");
    let galleryRolling = false;

    function setGalleryFeatured() {
      if (!galleryTrack) return;
      galleryTrack.querySelectorAll(".gallery-card").forEach(function (card, index) {
        card.classList.toggle("is-featured", index === 0);
      });
    }

    function rollGalleryLeft() {
      if (!galleryTrack || galleryRolling) return;
      const firstCard = galleryTrack.querySelector(".gallery-card");
      if (!firstCard) return;

      galleryRolling = true;
      const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 20;
      const moveWidth = firstCard.getBoundingClientRect().width + gap;

      galleryTrack.style.transition = "transform .65s ease";
      galleryTrack.style.transform = "translateX(-" + moveWidth + "px)";

      const finishRolling = function () {
        galleryTrack.removeEventListener("transitionend", finishRolling);
        galleryTrack.style.transition = "none";
        galleryTrack.appendChild(firstCard);
        galleryTrack.style.transform = "translateX(0)";
        setGalleryFeatured();

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            galleryTrack.style.transition = "transform .65s ease";
            galleryRolling = false;
          });
        });
      };

      galleryTrack.addEventListener("transitionend", finishRolling);
    }

    setGalleryFeatured();
    window.setInterval(rollGalleryLeft, 2600);