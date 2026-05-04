const GO_CAMPING_API_KEY = "YOUR_GO_CAMPING_API_KEY"; // 공공데이터 API 키 입력
  let swiperInstance = null;
  let isTransitioningToLogin = false;
  let mapInstance = null;
  let mapMarkers = [];
  let currentMapMode = 'nationwide';
  let currentMapItem = null;
  let selectedCampForReserve = null;
  let previousScreenBeforeMap = 'screen-list';
  let homeHeroIndex = 0;
  let homeHeroTimerId = null;
  let homeHeroRafId = null;

  const dummyData = [
    { facltNm: "가평 별빛 오토캠핑장", addr1: "경기도 가평군 북면", mapY: 37.8812, mapX: 127.5492, firstImageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=300&q=80" },
    { facltNm: "평창 흥정계곡 캠핑장", addr1: "강원도 평창군 봉평면", mapY: 37.6167, mapX: 128.3223, firstImageUrl: "https://images.unsplash.com/photo-1537565266751-34fd38d100fb?auto=format&fit=crop&w=300&q=80" },
    { facltNm: "제주 애월 바당 캠핑장", addr1: "제주특별자치도 제주시 애월읍", mapY: 33.4623, mapX: 126.3197, firstImageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80" },
    { facltNm: "부산 오션뷰 캠핑장", addr1: "부산광역시 기장군", mapY: 35.2448, mapX: 129.2223, firstImageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=300&q=80" },
    { facltNm: "전주 힐링 캠프", addr1: "전북특별자치도 완주군", mapY: 35.8242, mapX: 127.148, firstImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80" },
    { facltNm: "강릉 바다숲 야영장", addr1: "강원특별자치도 강릉시", mapY: 37.7519, mapX: 128.8761, firstImageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=300&q=80" }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
    initSplashFlow();
    startHomeHeroSlider();

    const startButton = document.getElementById('btn-start');
    const loginButton = document.getElementById('btn-login');

    if (startButton) startButton.addEventListener('click', goToLogin);
    if (loginButton) loginButton.addEventListener('click', () => showScreen('screen-home'));

    ['searchInput', 'searchInputList'].forEach((inputId) => {
      const searchInput = document.getElementById(inputId);
      if (searchInput) {
        searchInput.addEventListener('search', () => triggerSearchFromInput(inputId));
      }
    });
  });

  function startHomeHeroSlider() {
    const slider = document.getElementById('homeHeroSlider');
    const track = document.getElementById('homeHeroTrack');
    const dots = document.querySelectorAll('#homeHeroDots .home-hero-dot');
    if (!slider || !track || !dots.length) return;

    if (homeHeroTimerId) clearInterval(homeHeroTimerId);
    if (homeHeroRafId) cancelAnimationFrame(homeHeroRafId);

    const totalRealSlides = 3;
    let currentIndex = 1;

    const updateDots = (realIndex) => {
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === realIndex));
    };

    const moveTo = (index, withTransition = true) => {
      track.style.transition = withTransition ? 'transform .55s ease' : 'none';
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    moveTo(currentIndex, false);
    updateDots(0);

    const nextSlide = () => {
      currentIndex += 1;
      moveTo(currentIndex, true);
    };

    homeHeroTimerId = setInterval(nextSlide, 2800);

    track.addEventListener('transitionend', () => {
      if (currentIndex === totalRealSlides + 1) {
        currentIndex = 1;
        moveTo(currentIndex, false);
      } else if (currentIndex === 0) {
        currentIndex = totalRealSlides;
        moveTo(currentIndex, false);
      }
      updateDots((currentIndex - 1 + totalRealSlides) % totalRealSlides);
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => moveTo(currentIndex, false), 120);
    });
  }

  function initSplashFlow() {
    const loadingProgress = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    setTimeout(() => {
      if (loadingProgress) loadingProgress.style.width = '100%';
      let startTime = null;
      const duration = 3000;
      function animatePercentage(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percent = Math.min(Math.floor((progress / duration) * 100), 100);
        if (loadingText) loadingText.innerText = percent + '%';
        if (progress >= duration) return;
        requestAnimationFrame(animatePercentage);
      }
      requestAnimationFrame(animatePercentage);
    }, 50);

    setTimeout(() => {
      showScreen('screen-onboarding');
      initSwiper();

      // Swiper 자동 넘김이 막히는 환경에서도 로그인 화면이 표시되도록 보조 타이머를 둡니다.
      setTimeout(() => {
        if (!isTransitioningToLogin) goToLogin();
      }, 6500);
    }, 3000);
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper 라이브러리를 불러오지 못했습니다. 로그인 화면으로 이동합니다.');
      setTimeout(goToLogin, 800);
      return;
    }

    swiperInstance = new Swiper(".mySwiper", {
      autoplay: { delay: 1000, disableOnInteraction: false, stopOnLastSlide: true },
      pagination: { el: ".swiper-pagination", clickable: true },
      loop: false,
      on: {
        reachEnd: function () {
          setTimeout(() => { goToLogin(); }, 1500);
        }
      }
    });
  }

  function goToLogin() {
    if (isTransitioningToLogin) return;
    isTransitioningToLogin = true;
    if (swiperInstance) swiperInstance.destroy();
    showScreen('screen-login');
  }

  function showScreen(screenId) {
    const target = document.getElementById(screenId);
    if (!target) return;

    document.querySelectorAll('.app-screen').forEach(screen => {
      screen.classList.remove('visible-screen');
      screen.classList.add('hidden-screen');
    });

    target.classList.remove('hidden-screen');
    target.classList.add('visible-screen');
  }

  function goToSearchHome() {
    showScreen('screen-search-home');
    document.getElementById('searchInput').focus();
  }

  function loadRecentSearches() {
    const history = JSON.parse(localStorage.getItem('camping_history') || '[]');
    const container = document.getElementById('recentSearches');
    if (!container) return;
    container.innerHTML = '';
    history.forEach(keyword => {
      const chip = document.createElement('div');
      chip.className = 'chip dark';
      chip.textContent = keyword;
      chip.onclick = () => {
        document.getElementById('searchInput').value = keyword;
        searchCamping(keyword);
      };
      container.appendChild(chip);
    });
  }

  function saveKeyword(keyword) {
    if (!keyword) return;
    let history = JSON.parse(localStorage.getItem('camping_history') || '[]');
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    if (history.length > 5) history.pop();
    localStorage.setItem('camping_history', JSON.stringify(history));
    loadRecentSearches();
  }


  function triggerSearchFromInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const keyword = input.value.trim();
    if (keyword) {
      saveKeyword(keyword);
      searchCamping(keyword);
    }
  }

  function handleSearch(e) {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.isComposing) {
      e.preventDefault();
      const keyword = e.target.value.trim();
      if (keyword) {
        saveKeyword(keyword);
        searchCamping(keyword);
      }
    }
  }

  function handleSearchFromList(e) {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.isComposing) {
      e.preventDefault();
      const keyword = e.target.value.trim();
      if (keyword) {
        saveKeyword(keyword);
        searchCamping(keyword);
      }
    }
  }

  async function searchCamping(keyword) {
    document.getElementById('searchInput').value = keyword;
    document.getElementById('searchInputList').value = keyword;
    showScreen('screen-list');

    const listContainer = document.getElementById('resultList');
    document.getElementById('listTitle').style.display = 'none';
    setListMessage(listContainer, '데이터를 불러오는 중입니다...');

    if (!GO_CAMPING_API_KEY || GO_CAMPING_API_KEY === "YOUR_GO_CAMPING_API_KEY") {
      const filtered = dummyData.filter(item =>
        item.facltNm.includes(keyword) || (item.addr1 || '').includes(keyword)
      );
      setTimeout(() => renderList(filtered.length ? filtered : dummyData, false), 300);
      return;
    }

    try {
      const url = `https://apis.data.go.kr/B551011/GoCamping/searchList?numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&serviceKey=${GO_CAMPING_API_KEY}&_type=json&keyword=${encodeURIComponent(keyword)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.response && data.response.body && data.response.body.items && data.response.body.items !== "") {
        let items = data.response.body.items.item;
        if (!Array.isArray(items)) items = [items];
        renderList(items, false);
      } else {
        setListMessage(listContainer, '검색 결과가 없습니다.');
      }
    } catch (error) {
      renderList(dummyData, false);
    }
  }

  function showFavorites() {
    let likes = JSON.parse(localStorage.getItem('liked_camps') || '[]');
    renderList(likes, true);
    showScreen('screen-list');
  }

  function getCampCategory(item) {
    return item.induty || item.lctCl || item.sbrsCl || '차박/텐트/글램핑';
  }

  function getCampDistance(item, index) {
    if (item.distanceText) return item.distanceText;
    if (typeof item.distanceKm === 'number') return `${item.distanceKm.toFixed(1)}Km`;
    const value = 11.3 + (index * 1.1);
    return `${value.toFixed(1)}Km`;
  }

  function setListMessage(container, message) {
    if (!container) return;
    container.textContent = '';
    const messageBox = document.createElement('div');
    messageBox.className = 'list-message';
    messageBox.textContent = message;
    container.appendChild(messageBox);
  }

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof textContent === 'string') element.textContent = textContent;
    return element;
  }

  function createListItem(item, index, likes) {
    const isLiked = likes.some(c => c.facltNm === item.facltNm);
    const imgUrl = item.firstImageUrl || 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=300&q=80';
    const address = item.addr1 || `${item.doNm || ''} ${item.sigunguNm || ''}`.trim();
    const category = getCampCategory(item);
    const distance = getCampDistance(item, index);

    const itemBox = createElement('div', 'list-item');
    const thumbWrap = createElement('div', 'list-thumb-wrap');
    const image = createElement('img', 'list-img');
    image.src = imgUrl;
    image.alt = item.facltNm || '캠핑장 이미지';
    thumbWrap.appendChild(image);

    const rightBox = createElement('div', 'list-right');
    rightBox.appendChild(createElement('div', 'list-title', item.facltNm || '캠핑장 이름'));
    rightBox.appendChild(createElement('div', 'list-addr', address));

    const favRow = createElement('div', 'list-fav-row');
    const likeIcon = createElement('i', isLiked ? 'fas fa-heart like-btn liked' : 'far fa-heart like-btn');
    likeIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleLikeLogic(event.currentTarget, item);
    });
    favRow.appendChild(likeIcon);

    const bottomBox = createElement('div', 'list-bottom');
    bottomBox.appendChild(createElement('span', 'list-category', category));
    bottomBox.appendChild(createElement('span', 'list-distance', distance));

    rightBox.appendChild(favRow);
    rightBox.appendChild(bottomBox);
    itemBox.appendChild(thumbWrap);
    itemBox.appendChild(rightBox);
    itemBox.addEventListener('click', () => openSingleMap(item));

    return itemBox;
  }

  function renderList(items, isFavoriteView = false) {
    const listContainer = document.getElementById('resultList');
    const listTitle = document.getElementById('listTitle');
    listContainer.innerHTML = '';

    if (isFavoriteView) {
      listTitle.style.display = 'block';
      listTitle.textContent = `❤️ 내가 찜한 캠핑장 (${items.length})`;
    } else {
      listTitle.style.display = 'none';
    }

    if (!items.length) {
      setListMessage(listContainer, '목록이 비어있습니다.');
      return;
    }

    let likes = JSON.parse(localStorage.getItem('liked_camps') || '[]');

    items.forEach((item, index) => {
      listContainer.appendChild(createListItem(item, index, likes));
    });
  }

  function toggleLikeLogic(targetEl, item) {
    let likes = JSON.parse(localStorage.getItem('liked_camps') || '[]');
    const index = likes.findIndex(c => c.facltNm === item.facltNm);

    if (index > -1) {
      likes.splice(index, 1);
      targetEl.className = 'far fa-heart like-btn';
    } else {
      likes.push(item);
      targetEl.className = 'fas fa-heart like-btn liked';
    }

    localStorage.setItem('liked_camps', JSON.stringify(likes));

    const listTitle = document.getElementById('listTitle');
    if (listTitle.style.display === 'block') showFavorites();
  }

  async function openNationwideMap() {
    previousScreenBeforeMap = document.querySelector('.visible-screen')?.id || 'screen-search-home';
    currentMapMode = 'nationwide';
    currentMapItem = null;
    showScreen('screen-map');
    document.getElementById('mapBottomSheet').classList.remove('show');

    let items = dummyData;
    if (GO_CAMPING_API_KEY && GO_CAMPING_API_KEY !== "YOUR_GO_CAMPING_API_KEY") {
      try {
        const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&serviceKey=${GO_CAMPING_API_KEY}&_type=json`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.response && data.response.body && data.response.body.items && data.response.body.items.item) {
          let fetched = data.response.body.items.item;
          if (!Array.isArray(fetched)) fetched = [fetched];
          items = fetched.filter(item => item.mapY && item.mapX);
        }
      } catch (e) {
        items = dummyData;
      }
    }

    drawMapWithMarkers(items, null);
  }

  function openSingleMap(item) {
    previousScreenBeforeMap = 'screen-list';
    currentMapMode = 'single';
    currentMapItem = item;
    showScreen('screen-map');
    drawMapWithMarkers([item], item);
    setTimeout(() => openBottomSheet(item), 350);
  }

  function goBackFromMap() {
    if (currentMapMode === 'single') {
      showScreen(previousScreenBeforeMap || 'screen-list');
    } else {
      showScreen(previousScreenBeforeMap || 'screen-search-home');
    }
    document.getElementById('mapBottomSheet').classList.remove('show');
  }

  function ensureMap(centerLat = 36.5, centerLng = 127.8, level = 12) {
    if (typeof kakao === 'undefined' || !kakao.maps) return null;
    const container = document.getElementById('kakaoMap');
    const center = new kakao.maps.LatLng(centerLat, centerLng);
    if (!mapInstance) {
      mapInstance = new kakao.maps.Map(container, { center, level });
    } else {
      mapInstance.relayout();
      mapInstance.setCenter(center);
      mapInstance.setLevel(level);
    }
    return mapInstance;
  }

  function clearMarkers() {
    mapMarkers.forEach(marker => marker.setMap(null));
    mapMarkers = [];
  }

  function drawMapWithMarkers(items, focusItem = null) {
    const defaultLat = focusItem && focusItem.mapY ? parseFloat(focusItem.mapY) : 36.5;
    const defaultLng = focusItem && focusItem.mapX ? parseFloat(focusItem.mapX) : 127.8;
    const level = focusItem ? 5 : 13;
    const map = ensureMap(defaultLat, defaultLng, level);
    if (!map) return;

    clearMarkers();
    items.forEach(item => {
      if (!item.mapY || !item.mapX) return;
      const markerPosition = new kakao.maps.LatLng(parseFloat(item.mapY), parseFloat(item.mapX));
      const marker = new kakao.maps.Marker({ position: markerPosition, map });
      mapMarkers.push(marker);
      kakao.maps.event.addListener(marker, 'click', () => {
        currentMapMode = 'single';
        currentMapItem = item;
        openBottomSheet(item);
        map.setCenter(markerPosition);
        map.setLevel(5);
      });
    });
  }

  function openBottomSheet(item) {
    const sheet = document.getElementById('mapBottomSheet');
    if (!sheet) return;
    const imgUrl = item.firstImageUrl || "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=150&q=80";

    sheet.textContent = '';

    const image = createElement('img', 'sheet-img');
    image.src = imgUrl;
    image.alt = '선택한 캠핑장 이미지';

    const infoBox = createElement('div', 'sheet-info');
    infoBox.appendChild(createElement('div', 'sheet-title', item.facltNm || '캠핑장 이름'));
    infoBox.appendChild(createElement('div', 'sheet-addr', item.addr1 || ''));
    infoBox.appendChild(createElement('div', 'sheet-link', '상세페이지로 이동 ➔'));

    sheet.appendChild(image);
    sheet.appendChild(infoBox);
    sheet.classList.add('show');
    sheet.onclick = () => openDetailScreen(item);
  }

  function openDetailScreen(item) {
    selectedCampForReserve = item;
    showScreen('screen-detail');
    document.getElementById('mapBottomSheet').classList.remove('show');
    const imgUrl = item.firstImageUrl || "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80";
    document.getElementById('detailMainImg').src = imgUrl;
    document.getElementById('detailTitle').textContent = item.facltNm;
    document.getElementById('detailAddr').textContent = item.addr1 || '';
  }

  function openReserveScreen() {
    if (!selectedCampForReserve) return;
    document.getElementById('reserveCampName').textContent = selectedCampForReserve.facltNm;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('checkin').value = today.toISOString().split('T')[0];
    document.getElementById('checkout').value = tomorrow.toISOString().split('T')[0];
    showScreen('screen-reserve');
  }

  function completeReservation() {
    alert('예약이 성공적으로 완료되었습니다!\n즐거운 캠핑 되세요🏕️');
    showScreen('screen-home');
  }
