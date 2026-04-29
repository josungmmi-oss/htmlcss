(function () {
  'use strict';

  /* 모바일 메뉴 */
  const menuOpen = document.querySelector('.menu-open');
  const menuClose = document.querySelector('.menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuOpen && mobileMenu) {
    menuOpen.addEventListener('click', function () {
      mobileMenu.classList.add('active');
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', function () {
      mobileMenu.classList.remove('active');
    });
  }

  /* PC 헤더 가로 서브메뉴 */
  const submenuData = {
    about: {
      title: '협회소개',
      items: [
        ['협회소개', 'index_sub1.html#intro'],
        ['인사말', 'index_sub1.html#greeting'],
        ['연혁', 'index_sub1.html#history'],
        ['조직도', 'index_sub1.html#organization'],
        ['오시는 길', 'index_sub1.html#location']
      ]
    },
    promotion: {
      title: '홍보광장',
      items: [
        ['공지사항', '#notice'],
        ['언론보도', '#'],
        ['갤러리', '#gallery'],
        ['영상', '#']
      ]
    },
    azalea: {
      title: '아젤리아 드레스',
      items: [
        ['브랜드 소개', '#'],
        ['아젤리아 드레스', '#'],
        ['아젤리아 궁중한복', '#'],
        ['아젤리아 키즈', '#'],
        ['아젤리아 패션쇼 & 어워즈', '#'],
        ['아젤리아 예술단', '#']
      ]
    },
    exchange: {
      title: '국제교류체험관',
      items: [
        ['아젤리아 매거진', '#'],
        ['아젤리아 TV 방송', '#'],
        ['아젤리아 엔터', '#'],
        ['국내 · 국제교류 기획 공연 이벤트', '#'],
        ['국제교류한복체험', '#'],
        ['전통한문화포럼', '#']
      ]
    },
    welfare: {
      title: '나눔과기쁨 & 복지관',
      items: [
        ['(사) 나눔과 기쁨', '#']
      ]
    },
    partner: {
      title: '협력기관',
      items: [
        ['협력기관 정보', '#']
      ]
    }
  };

  const header = document.querySelector('.header');
  const gnbLinks = document.querySelectorAll('.gnb a[data-menu]');
  const submenu = document.getElementById('desktopSubmenu');
  const submenuTitle = document.getElementById('desktopSubmenuTitle');
  const submenuList = document.getElementById('desktopSubmenuList');
  let closeTimer = null;

  function renderSubmenu(key) {
    const data = submenuData[key];
    if (!data || !submenuTitle || !submenuList) return;

    submenuTitle.textContent = data.title;
    submenuList.innerHTML = '';

    data.items.forEach(function (item, index) {
      const link = document.createElement('a');
      link.href = item[1];
      link.textContent = item[0];
      if (index === 0) link.classList.add('is-sub-active');
      submenuList.appendChild(link);
    });
  }

  function openSubmenu(key, activeLink) {
    if (!submenu) return;
    clearTimeout(closeTimer);
    renderSubmenu(key);
    submenu.classList.add('is-open');
    submenu.setAttribute('aria-hidden', 'false');

    gnbLinks.forEach(function (link) {
      link.classList.remove('is-submenu-active');
    });

    if (activeLink) activeLink.classList.add('is-submenu-active');
  }

  function closeSubmenu() {
    if (!submenu) return;
    submenu.classList.remove('is-open');
    submenu.setAttribute('aria-hidden', 'true');
    gnbLinks.forEach(function (link) {
      link.classList.remove('is-submenu-active');
    });
  }

  function delayCloseSubmenu() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeSubmenu, 160);
  }

  gnbLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      openSubmenu(link.dataset.menu, link);
    });

    link.addEventListener('focus', function () {
      openSubmenu(link.dataset.menu, link);
    });
  });

  if (header) {
    header.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
    });
    header.addEventListener('mouseleave', delayCloseSubmenu);
  }

  if (submenu) {
    submenu.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
    });
    submenu.addEventListener('mouseleave', delayCloseSubmenu);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeSubmenu();
  });

  /* 공지사항 탭 필터 */
  const noticeButtons = document.querySelectorAll('.tab-list button');
  const noticeCards = document.querySelectorAll('.notice-card');

  noticeButtons.forEach(function (button, index) {
    if (!button.dataset.filter) {
      button.dataset.filter = index === 0 ? 'all' : index === 1 ? 'notice' : 'news';
    }

    button.addEventListener('click', function () {
      const filter = button.dataset.filter;

      noticeButtons.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      noticeCards.forEach(function (card) {
        let type = card.dataset.type;
        if (!type) {
          const badge = card.querySelector('.badge');
          type = badge && badge.textContent.includes('뉴스') ? 'news' : 'notice';
          card.dataset.type = type;
        }

        card.hidden = !(filter === 'all' || type === filter);
      });
    });
  });

  /* 메인 배너 한 장씩 롤링 + 하단 정보 연동 */
  const heroTrack = document.getElementById('heroTrack');
  const heroNum = document.getElementById('heroNum');
  const heroThumbImg = document.getElementById('heroThumbImg');
  const heroInfo = document.querySelector('.hero-info');
  const heroBars = document.querySelectorAll('.hero-control span');
  const heroImages = [
    './mainimages/banner.png',
    './mainimages/banner2.png',
    './mainimages/banner5.png'
  ];
  let heroIndex = 0;

  function updateHero() {
    if (!heroTrack) return;

    heroTrack.style.transform = 'translateX(-' + (heroIndex * 25) + '%)';

    if (heroNum) heroNum.textContent = String(heroIndex + 1).padStart(2, '0');
    if (heroThumbImg) heroThumbImg.src = heroImages[heroIndex];
    if (heroInfo) heroInfo.style.setProperty('--hero-info-bg', 'url("' + heroImages[heroIndex] + '")');

    heroBars.forEach(function (bar, index) {
      bar.classList.toggle('active', index === heroIndex);
    });
  }

  if (heroTrack) {
    updateHero();
    setInterval(function () {
      heroIndex = (heroIndex + 1) % heroImages.length;
      updateHero();
    }, 4500);
  }

  /* PC 갤러리 롤링 / 모바일은 세로 나열 유지 */
  const galleryTrack = document.getElementById('galleryTrack');

  function rotateGallery() {
    if (!galleryTrack || window.innerWidth <= 767) return;

    const first = galleryTrack.querySelector('.gallery-card');
    if (!first) return;

    first.classList.remove('is-featured');
    galleryTrack.appendChild(first);

    const next = galleryTrack.querySelector('.gallery-card');
    if (next) next.classList.add('is-featured');
  }

  if (galleryTrack) {
    setInterval(rotateGallery, 3600);
  }
})();
