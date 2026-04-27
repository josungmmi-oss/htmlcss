const pages = document.querySelectorAll(".page");
    const loadingFill = document.getElementById("loadingFill");
    const loadingPercent = document.getElementById("loadingPercent");
    const menuList = document.getElementById("menuList");
    const bannerTrack = document.getElementById("bannerTrack");

    const orderImage = document.getElementById("orderImage");
    const orderName = document.getElementById("orderName");
    const orderDesc = document.getElementById("orderDesc");
    const orderPriceTop = document.getElementById("orderPriceTop");
    const orderPriceLine = document.getElementById("orderPriceLine");
    const orderTotalPrice = document.getElementById("orderTotalPrice");
    const qtyText = document.getElementById("qtyText");
    const orderList = document.getElementById("orderList");
    const completeList = document.getElementById("completeList");
    const completeTotalPrice = document.getElementById("completeTotalPrice");
    const cartList = document.getElementById("cartList");
    const cartTotalPrice = document.getElementById("cartTotalPrice");
    const historyList = document.getElementById("historyList");
    const couponDiscountPrice = document.getElementById("couponDiscountPrice");
    const couponButton = document.getElementById("couponButton");
    const couponText = document.getElementById("couponText");
    const imageDetailImg = document.getElementById("imageDetailImg");
    const imageDetailTitle = document.getElementById("imageDetailTitle");
    const imageDetailPrice = document.getElementById("imageDetailPrice");
    const imageDetailDesc = document.getElementById("imageDetailDesc");

    const state = {
      currentCategory: "all",
      selectedMenuIds: [],
      orderItems: [],
      keepLogin: false,
      orderType: "takeout",
      couponApplied: false,
      couponCount: 1,
      orderHistory: [],
      currentDetailItemId: null,
      previousPageBeforeDetail: "menuPage"
    };

    const menuData = [
      {
        id: "set-real-chili",
        category: "set",
        recommend: true,
        title: "리얼 칠리 새우 세트",
        price: 8000,
        priceText: "8,000원",
        image: "./images/realchil.png",
        isNew: true,
        orderDescription: "기본가격: 8,000원\nㄴ[사이드] 포테이토팝 x 1(0원)\nㄴ[음료선택] 콜라(캔) x 1(0원)"
      },
      {
        id: "set-shrimp-special",
        category: "set",
        recommend: true,
        title: "새우 스페셜 세트",
        price: 7800,
        priceText: "7,800원",
        image: "./images/sewoospecial.png",
        isNew: true,
        orderDescription: "기본가격: 7,800원\nㄴ[사이드] 포테이토팝 x 1(0원)\nㄴ[음료선택] 콜라(캔) x 1(0원)"
      },
      {
        id: "set-french-cream",
        category: "set",
        recommend: false,
        title: "프렌치 크림\n브리오슈 세트",
        price: 7000,
        priceText: "7,000원",
        image: "./images/frenchcream.png",
        isNew: true,
        orderDescription: "기본가격: 7,000원\nㄴ[사이드] 포테이토팝 x 1(0원)\nㄴ[음료선택] 콜라(캔) x 1(0원)"
      },
      {
        id: "toast-real-chili",
        category: "toast",
        recommend: true,
        title: "리얼 칠리 새우",
        price: 5100,
        priceText: "5,100원",
        image: "./images/realchilsewoo.png",
        isNew: true,
        orderDescription: "기본가격: 5,100원"
      },
      {
        id: "toast-shrimp-special",
        category: "toast",
        recommend: false,
        title: "새우 스페셜",
        price: 4900,
        priceText: "4,900원",
        image: "./images/sewoospecial.png",
        isNew: true,
        orderDescription: "기본가격: 4,900원"
      },
      {
        id: "toast-apple-cream",
        category: "toast",
        recommend: false,
        title: "애플 크림 브리오슈",
        price: 3700,
        priceText: "3,700원",
        image: "./images/frenchcream.png",
        isNew: true,
        orderDescription: "기본가격: 3,700원"
      },
      {
        id: "side-chili-potato",
        category: "side",
        recommend: true,
        title: "칠리 포테이토 팝",
        price: 2800,
        priceText: "2,800원",
        image: "./images/pop.png",
        isNew: true,
        orderDescription: "기본가격: 2,800원"
      }
    ];





    const storeLocation = {
      name: "이삭토스트 김포 장기점",
      address: "경기 김포시 김포한강4로 125 월드타워빌딩 10층 102호",
      lat: 37.6447084,
      lng: 126.6670806
    };

    let storeMapInstance = null;
    let storeMapInitialized = false;

    function initStoreMap() {
      const mapContainer = document.getElementById("storeMap");
      const mapNotice = document.getElementById("storeMapNotice");

      if (!mapContainer) return;

      if (!window.kakao || !window.kakao.maps) {
        if (mapNotice) mapNotice.classList.add("active");
        return;
      }

      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng);

        const mapOption = {
          center: center,
          level: 3
        };

        storeMapInstance = new window.kakao.maps.Map(mapContainer, mapOption);

        const marker = new window.kakao.maps.Marker({
          position: center,
          map: storeMapInstance
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:8px 12px;font-size:13px;white-space:nowrap;">' + storeLocation.name + '</div>'
        });

        infoWindow.open(storeMapInstance, marker);

        if (mapNotice) mapNotice.classList.remove("active");

        setTimeout(() => {
          storeMapInstance.relayout();
          storeMapInstance.setCenter(center);
        }, 120);

        storeMapInitialized = true;
      });
    }

    function refreshStoreMap() {
      if (!window.kakao || !window.kakao.maps) {
        const mapNotice = document.getElementById("storeMapNotice");
        if (mapNotice) mapNotice.classList.add("active");
        return;
      }

      if (!storeMapInitialized) {
        initStoreMap();
        return;
      }

      if (storeMapInstance) {
        const center = new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng);
        setTimeout(() => {
          storeMapInstance.relayout();
          storeMapInstance.setCenter(center);
        }, 120);
      }
    }

    function openKakaoMapSearch() {
      const query = encodeURIComponent(storeLocation.name + " " + storeLocation.address);
      window.open("https://map.kakao.com/link/search/" + query, "_blank");
    }

    function openKakaoMapRoute() {
      const name = encodeURIComponent(storeLocation.name);
      window.open("https://map.kakao.com/link/to/" + name + "," + storeLocation.lat + "," + storeLocation.lng, "_blank");
    }


    function saveAppState() {
      const data = {
        selectedMenuIds: state.selectedMenuIds,
        keepLogin: state.keepLogin,
        orderHistory: state.orderHistory,
        couponCount: state.couponCount
      };

      localStorage.setItem("isaacAppState", JSON.stringify(data));
    }

    function loadAppState() {
      try {
        const saved = JSON.parse(localStorage.getItem("isaacAppState") || "{}");

        if (Array.isArray(saved.selectedMenuIds)) {
          state.selectedMenuIds = saved.selectedMenuIds.filter(id => menuData.some(item => item.id === id));
        }

        if (typeof saved.keepLogin === "boolean") {
          state.keepLogin = saved.keepLogin;
        }

        if (Array.isArray(saved.orderHistory)) {
          state.orderHistory = saved.orderHistory;
        }

        if (typeof saved.couponCount === "number") {
          state.couponCount = saved.couponCount;
        }

        const keepCircle = document.getElementById("keepCircle");
        if (keepCircle && state.keepLogin) {
          keepCircle.classList.add("checked");
          keepCircle.textContent = "✓";
        }
      } catch (error) {
        console.warn("저장된 상태를 불러오지 못했습니다.", error);
      }
    }

    function getCartItems() {
      return menuData
        .filter(item => state.selectedMenuIds.includes(item.id))
        .map(item => {
          const existing = state.orderItems.find(orderItem => orderItem.id === item.id);
          return {
            ...item,
            qty: existing ? existing.qty : 1
          };
        });
    }

    function getOrderSubtotal() {
      return state.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    function getDiscountAmount() {
      if (!state.couponApplied) return 0;
      if (state.couponCount <= 0) return 0;
      return Math.min(1000, getOrderSubtotal());
    }

    function showCartPage() {
      renderCartPage();
      showPage("cartPage");
    }

    function renderCartPage() {
      if (!cartList || !cartTotalPrice) return;

      const items = getCartItems();
      let total = 0;

      if (items.length === 0) {
        cartList.innerHTML = `<div class="cart-empty">장바구니에 담긴 메뉴가 없습니다.<br>메뉴를 먼저 담아주세요.</div>`;
        cartTotalPrice.textContent = "0원";
        return;
      }

      let html = "";

      items.forEach(item => {
        total += item.price;

        html += `
          <div class="cart-item">
            <div class="thumb">
              <img src="${item.image}" alt="${item.title.replace(/\n/g, " ")}" onerror="this.style.display='none';">
            </div>
            <div class="info">
              <h3>${item.title.replace(/\n/g, " ")}</h3>
              <div class="price">${item.priceText}</div>
              <div class="cart-control-row">
                <button class="round-btn" type="button" onclick="removeCartItem('${item.id}')">−</button>
                <span>1</span>
                <button class="round-btn plus" type="button" onclick="addToCart('${item.id}')">＋</button>
              </div>
            </div>
          </div>
        `;
      });

      cartList.innerHTML = html;
      cartTotalPrice.textContent = formatPrice(total);
    }

    function removeCartItem(id) {
      state.selectedMenuIds = state.selectedMenuIds.filter(menuId => menuId !== id);
      state.orderItems = state.orderItems.filter(item => item.id !== id);
      saveAppState();
      renderMenu(state.currentCategory);
      renderCartPage();
      updateCartCounts();
      bindStaticDetailImages();
    bindCardActions();
    }

    function showOrderHistoryPage() {
      renderOrderHistory();
      showPage("orderHistoryPage");
    }

    function renderOrderHistory() {
      if (!historyList) return;

      if (!state.orderHistory || state.orderHistory.length === 0) {
        historyList.innerHTML = `<div class="history-empty">아직 주문내역이 없습니다.<br>메뉴를 주문하면 이곳에서 확인할 수 있습니다.</div>`;
        return;
      }

      let html = "";

      state.orderHistory.slice().reverse().forEach(order => {
        const items = order.items.map(item => `${item.title.replace(/\n/g, " ")} × ${item.qty}`).join("<br>");

        html += `
          <div class="history-card">
            <div class="history-card-top">
              <span class="history-date">${order.date}</span>
              <span class="history-status">${order.type === "hall" ? "매장식사" : "방문포장"}</span>
            </div>
            <div class="history-items">${items}</div>
            <div class="history-total">
              <span>결제금액</span>
              <span>${formatPrice(order.total)}</span>
            </div>
          </div>
        `;
      });

      historyList.innerHTML = html;
    }

    function setOrderType(type) {
      state.orderType = type;

      const orderTypeItems = document.querySelectorAll(".order-type-row .order-type-item");
      orderTypeItems.forEach((item, index) => {
        const box = item.querySelector(".check-box");
        if (!box) return;

        const checked = (type === "hall" && index === 0) || (type === "takeout" && index === 1);
        box.classList.toggle("checked", checked);
        box.textContent = checked ? "✓" : "";
      });
    }

    function toggleCoupon() {
      if (state.couponCount <= 0 && !state.couponApplied) {
        alert("사용 가능한 쿠폰이 없습니다.");
        return;
      }

      state.couponApplied = !state.couponApplied;
      updateOrderPrice();
    }

    function updateCouponUI() {
      if (!couponText || !couponButton || !couponDiscountPrice) return;

      couponText.textContent = `사용 가능한 쿠폰 ${state.couponCount}장`;

      if (state.couponApplied) {
        couponButton.textContent = "쿠폰 적용됨";
        couponButton.classList.add("used");
      } else {
        couponButton.textContent = "1,000원 쿠폰 적용";
        couponButton.classList.remove("used");
      }

      couponDiscountPrice.textContent = "-" + formatPrice(getDiscountAmount());
    }

    function openMenuDetail(id, fromPage = "menuPage") {
      const item = menuData.find(menu => menu.id === id);

      if (!item) {
        alert("메뉴 정보를 찾을 수 없습니다.");
        return;
      }

      state.currentDetailItemId = id;
      state.previousPageBeforeDetail = fromPage;

      const detailImg = document.getElementById("imageDetailImg");
      const detailTitle = document.getElementById("imageDetailTitle");
      const detailPrice = document.getElementById("imageDetailPrice");
      const detailDesc = document.getElementById("imageDetailDesc");

      if (detailImg) {
        detailImg.src = item.image;
        detailImg.alt = item.title.replace(/\n/g, " ");
      }

      if (detailTitle) {
        detailTitle.textContent = item.title;
      }

      if (detailPrice) {
        detailPrice.textContent = item.priceText;
      }

      if (detailDesc) {
        detailDesc.textContent = item.orderDescription;
      }

      showPage("imageDetailPage");
    }

    function closeImageDetailPage() {
      showPage(state.previousPageBeforeDetail || "menuPage");
    }

    function addDetailItemToCart() {
      if (!state.currentDetailItemId) {
        alert("담을 메뉴가 없습니다.");
        return;
      }

      addToCart(state.currentDetailItemId);
      alert("장바구니에 담았습니다.");
    }

    function orderDetailItemNow() {
      if (!state.currentDetailItemId) {
        alert("주문할 메뉴가 없습니다.");
        return;
      }

      if (!state.selectedMenuIds.includes(state.currentDetailItemId)) {
        state.selectedMenuIds.push(state.currentDetailItemId);
      }

      const selectedItems = getCartItems();
      populateOrderPage(selectedItems);
      saveAppState();
      updateCartCounts();
      showPage("orderPage");
    }

    function closeMenuDetail() {
      const dimmed = document.getElementById("menuDetailDimmed");
      const sheet = document.getElementById("menuDetailSheet");

      if (dimmed) dimmed.classList.remove("active");
      if (sheet) sheet.classList.remove("active");
    }

    function registerPay() {
      const cardNumber = document.getElementById("payCardNumber");
      const cardName = document.getElementById("payCardName");

      if (!cardNumber || !cardNumber.value.trim()) {
        alert("카드번호를 입력해주세요.");
        return;
      }

      const name = cardName && cardName.value.trim() ? cardName.value.trim() : "등록 카드";
      quickData.pay.value = "등록완료";
      quickData.pay.detail = `${name}가 등록되었습니다.<br>주문 시 Pay로 빠르게 결제할 수 있습니다.`;

      alert("Pay 등록이 완료되었습니다.");
      showPage("home");
    }


    function updateCartCounts() {
      const count = state.selectedMenuIds.length;

      const cartCount = document.getElementById("cartCount");
      if (cartCount) {
        cartCount.textContent = count;
      }

      const homeCartCount = document.getElementById("homeCartCount");
      if (homeCartCount) {
        homeCartCount.textContent = count;
        homeCartCount.classList.toggle("active", count > 0);
      }
    }

    function addToCart(id) {
      if (!state.selectedMenuIds.includes(id)) {
        state.selectedMenuIds.push(id);
      }

      saveAppState();
      renderMenu(state.currentCategory);
      renderCartPage();
      updateCartCounts();
    }

    function goToCartFromHome() {
      if (state.selectedMenuIds.length === 0) {
        alert("장바구니에 담긴 메뉴가 없습니다.");
        showPage("menuPage");
        return;
      }

      const selectedItems = getCartItems();

      populateOrderPage(selectedItems);
      showPage("orderPage");
    }


    const quickData = {
      stamp: {
        title: "스탬프",
        value: "3개",
        icon: "./images/stamp iconl.png",
        desc: "현재 적립된 스탬프를 확인할 수 있습니다.",
        detail: "스탬프 10개를 모으면 쿠폰으로 교환할 수 있습니다.<br>현재 3개 보유 중이며, 7개를 더 모으면 혜택을 받을 수 있습니다.",
        button: "스탬프 확인"
      },
      coupon: {
        title: "쿠폰",
        value: "0장",
        icon: "./images/coupon-iconl.png",
        desc: "사용 가능한 쿠폰을 확인할 수 있습니다.",
        detail: "현재 사용 가능한 쿠폰이 없습니다.<br>이벤트 참여 또는 스탬프 적립으로 쿠폰을 받을 수 있습니다.",
        button: "쿠폰 확인"
      },
      pay: {
        title: "Pay",
        value: "미등록",
        icon: "./images/payicon.png",
        desc: "간편 결제 수단을 등록하고 확인할 수 있습니다.",
        detail: "등록된 결제수단이 없습니다.<br>결제수단을 등록하면 주문 시 빠르게 결제할 수 있습니다.",
        button: "Pay 등록하기"
      }
    };

    function openQuickSheet(type) {
      const data = quickData[type];

      if (!data) return;

      const quickDimmed = document.getElementById("quickDimmed");
      const quickSheet = document.getElementById("quickSheet");
      const quickSheetIcon = document.getElementById("quickSheetIcon");
      const quickSheetTitle = document.getElementById("quickSheetTitle");
      const quickSheetValue = document.getElementById("quickSheetValue");
      const quickSheetDesc = document.getElementById("quickSheetDesc");
      const quickSheetDetail = document.getElementById("quickSheetDetail");
      const quickSheetButton = document.getElementById("quickSheetButton");

      quickSheetIcon.innerHTML = `<img src="${data.icon}" alt="${data.title}">`;
      quickSheetTitle.textContent = data.title;
      quickSheetValue.textContent = data.value;
      quickSheetDesc.textContent = data.desc;
      quickSheetDetail.innerHTML = data.detail;
      quickSheetButton.textContent = data.button;
      quickSheetButton.onclick = function() {
        if (type === "pay") {
          closeQuickSheet();
      closeMenuDetail();
          showPage("payPage");
        }
      };

      quickDimmed.classList.add("active");
      quickSheet.classList.add("active");
    }

    function closeQuickSheet() {
      const quickDimmed = document.getElementById("quickDimmed");
      const quickSheet = document.getElementById("quickSheet");

      if (quickDimmed) quickDimmed.classList.remove("active");
      if (quickSheet) quickSheet.classList.remove("active");
    }



    function bindCardActions() {
      const actionTargets = document.querySelectorAll("[data-action]");

      actionTargets.forEach((target) => {
        if (target.dataset.actionBound === "true") return;

        target.dataset.actionBound = "true";

        const runAction = () => {
          if (target.dataset.action === "event-sheet") {
            openEventSheet();
          }

          if (target.dataset.action === "store-page") {
            showPage("storePage");
          }
        };

        target.addEventListener("click", runAction);

        target.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            runAction();
          }
        });
      });
    }

    function bindStaticDetailImages() {
      const detailImages = document.querySelectorAll("[data-detail-id]");

      detailImages.forEach((img) => {
        if (img.dataset.detailBound === "true") return;

        img.dataset.detailBound = "true";
        img.addEventListener("click", () => {
          const id = img.dataset.detailId;
          const from = img.dataset.detailFrom || "home";
          openMenuDetail(id, from);
        });
      });
    }


    function toggleKeepLogin() {
      state.keepLogin = !state.keepLogin;

      const keepCircle = document.getElementById("keepCircle");

      if (!keepCircle) return;

      if (state.keepLogin) {
        keepCircle.classList.add("checked");
        keepCircle.textContent = "✓";
      } else {
        keepCircle.classList.remove("checked");
        keepCircle.textContent = "";
      }

      saveAppState();
    }

    function showPage(id) {
      pages.forEach(page => page.classList.remove("active"));
      document.getElementById(id).classList.add("active");
      closeDrawer();
      closeEventSheet();
      closeQuickSheet();

      if (id === "menuPage") {
        renderMenu(state.currentCategory);
        setCategoryActiveButton(state.currentCategory);
      }

      if (id === "cartPage") {
        renderCartPage();
      }

      if (id === "orderHistoryPage") {
        renderOrderHistory();
      }

      if (id === "storePage") {
        refreshStoreMap();
      }

      updateCartCounts();
    }

    function toggleDrawerSub(id) {
      document.getElementById(id).classList.toggle("active");
    }

    function openDrawer() {
      document.getElementById("drawerDimmed").classList.add("active");
      document.getElementById("sideDrawer").classList.add("active");
    }

    function closeDrawer() {
      document.getElementById("drawerDimmed").classList.remove("active");
      document.getElementById("sideDrawer").classList.remove("active");
    }

    function openEventSheet() {
      const eventDimmed = document.getElementById("eventDimmed");
      const eventSheet = document.getElementById("eventSheet");

      if (eventDimmed) eventDimmed.classList.add("active");
      if (eventSheet) eventSheet.classList.add("active");
    }

    function closeEventSheet() {
      const eventDimmed = document.getElementById("eventDimmed");
      const eventSheet = document.getElementById("eventSheet");

      if (eventDimmed) eventDimmed.classList.remove("active");
      if (eventSheet) eventSheet.classList.remove("active");
    }

    function formatPrice(num) {
      return num.toLocaleString("ko-KR") + "원";
    }

    function getFilteredItems(category) {
      if (category === "all") return menuData;
      if (category === "recommend") return menuData.filter(item => item.recommend);
      return menuData.filter(item => item.category === category);
    }

    function setCategoryActiveButton(category) {
      document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");

        const text = btn.textContent.trim();

        if (text === "전체" && category === "all") btn.classList.add("active");
        if (text === "추천" && category === "recommend") btn.classList.add("active");
        if (text === "토스트세트" && category === "set") btn.classList.add("active");
        if (text === "토스트" && category === "toast") btn.classList.add("active");
        if (text === "사이드" && category === "side") btn.classList.add("active");
      });
    }

    function changeCategory(category, button) {
      state.currentCategory = category;
      document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(category);
    }

    function selectMenu(id) {
      const exists = state.selectedMenuIds.includes(id);

      if (exists) {
        state.selectedMenuIds = state.selectedMenuIds.filter(menuId => menuId !== id);
      } else {
        state.selectedMenuIds.push(id);
      }

      saveAppState();
      renderMenu(state.currentCategory);
      updateCartCounts();
    }

    function renderMenu(category) {
      const items = getFilteredItems(category);
      let html = "";

      items.forEach(item => {
        const checked = state.selectedMenuIds.includes(item.id);

        html += `
          <div class="menu-item">
            <div class="menu-left">
              ${item.recommend ? `
                <span class="recommend-badge">
                  <span class="recommend-icon">
                    <!-- 추천 아이콘 직접 삽입 위치 -->
                    <!-- 예: <img src="./images/icon-recommend.png" alt="추천"> -->
                    ★
                  </span>
                  추천
                </span>
              ` : `<div style="height:28px; margin-bottom:18px;"></div>`}

              <h4>${item.title}</h4>

              <div class="price-select-row">
                <p class="price">${item.priceText}</p>

                <button class="select-btn" type="button" onclick="selectMenu('${item.id}')">
                  선택
                  <span class="check-box ${checked ? "checked" : ""}">${checked ? "✓" : ""}</span>
                </button>

                <button class="cart-add-btn ${checked ? "added" : ""}" type="button" onclick="addToCart('${item.id}')">
                  ${checked ? "담김" : "담기"}
                </button>
              </div>
            </div>

            <div class="menu-right">
              <!-- 메뉴리스트 사진 삽입 위치: menuData의 image 경로를 원하는 이미지 파일명으로 변경하세요 -->
              <img src="${item.image}" alt="${item.title.replace(/\n/g, ' ')}" onclick="openMenuDetail('${item.id}', 'menuPage')" onerror="this.style.display='none';">
            </div>

            ${item.isNew ? `<span class="new-dot">NEW</span>` : ""}
          </div>
        `;
      });

      menuList.innerHTML = html;

      updateCartCounts();
    }

    function populateOrderPage(items) {
      state.orderItems = items.map(item => ({
        ...item,
        qty: item.qty || 1
      }));

      state.couponApplied = false;

      renderOrderList();
      updateOrderPrice();
    }

    function renderOrderList() {
      if (!orderList) return;

      let html = "";

      state.orderItems.forEach(item => {
        html += `
          <div class="order-cart-item">
            <div class="thumb">
              <!-- 주문페이지 상품 이미지 삽입 위치 -->
              <img src="${item.image}" alt="${item.title.replace(/\n/g, " ")}" onerror="this.style.display='none';">
            </div>

            <div class="info">
              <h3>${item.title.replace(/\n/g, " ")}</h3>
              <p>${item.orderDescription}</p>

              <button class="option-btn" type="button">옵션변경</button>

              <div class="item-control-row">
                <button class="round-btn" type="button" onclick="changeQty('${item.id}', -1)">−</button>
                <span>${item.qty}</span>
                <button class="round-btn plus" type="button" onclick="changeQty('${item.id}', 1)">＋</button>
                <span class="count-price">${formatPrice(item.price * item.qty)}</span>
              </div>

              <button class="remove-item-btn" type="button" onclick="removeOrderItem('${item.id}')">삭제</button>
            </div>
          </div>
        `;
      });

      orderList.innerHTML = html;
    }

    function updateOrderPrice() {
      const subtotal = getOrderSubtotal();
      const discount = getDiscountAmount();
      const total = Math.max(0, subtotal - discount);

      if (orderPriceLine) orderPriceLine.textContent = formatPrice(subtotal);
      if (orderTotalPrice) orderTotalPrice.textContent = formatPrice(total);

      updateCouponUI();
    }

    function changeQty(id, amount) {
      const item = state.orderItems.find(orderItem => orderItem.id === id);
      if (!item) return;

      item.qty += amount;

      if (item.qty < 1) {
        item.qty = 1;
      }

      saveAppState();
      renderOrderList();
      renderCartPage();
      updateOrderPrice();
    }

    function removeOrderItem(id) {
      state.orderItems = state.orderItems.filter(item => item.id !== id);
      state.selectedMenuIds = state.selectedMenuIds.filter(menuId => menuId !== id);

      if (state.orderItems.length === 0) {
        showPage("menuPage");
        return;
      }

      saveAppState();
      renderOrderList();
      renderCartPage();
      updateOrderPrice();
      updateCartCounts();
    }

    function goToSelectedOrder() {
      if (state.selectedMenuIds.length === 0) {
        alert("메뉴를 먼저 선택해주세요.");
        return;
      }

      const selectedItems = getCartItems();

      populateOrderPage(selectedItems);
      showPage("orderPage");
    }


    function submitOrder() {
      if (!state.orderItems || state.orderItems.length === 0) {
        alert("주문할 메뉴가 없습니다.");
        showPage("menuPage");
        return;
      }

      const subtotal = getOrderSubtotal();
      const discount = getDiscountAmount();
      const total = Math.max(0, subtotal - discount);

      const order = {
        id: Date.now(),
        date: new Date().toLocaleString("ko-KR"),
        type: state.orderType,
        items: state.orderItems.map(item => ({
          id: item.id,
          title: item.title,
          qty: item.qty,
          price: item.price
        })),
        subtotal,
        discount,
        total
      };

      state.orderHistory.push(order);

      if (state.couponApplied && state.couponCount > 0) {
        state.couponCount -= 1;
      }

      renderCompletePage();
      saveAppState();
      showPage("orderCompletePage");
    }

    function renderCompletePage() {
      if (!completeList || !completeTotalPrice) return;

      let html = "";
      let total = 0;

      state.orderItems.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        html += `
          <div class="complete-item">
            <span>${item.title.replace(/\n/g, " ")} × ${item.qty}</span>
            <strong>${formatPrice(itemTotal)}</strong>
          </div>
        `;
      });

      const discount = getDiscountAmount();
      const finalTotal = Math.max(0, total - discount);

      if (discount > 0) {
        html += `
          <div class="complete-item">
            <span>쿠폰할인</span>
            <strong>-${formatPrice(discount)}</strong>
          </div>
        `;
      }

      completeList.innerHTML = html;
      completeTotalPrice.textContent = formatPrice(finalTotal);
    }

    function finishOrder() {
      state.selectedMenuIds = [];
      state.orderItems = [];
      state.couponApplied = false;
      saveAppState();
      renderMenu(state.currentCategory);
      renderCartPage();
      updateCartCounts();
      showPage("home");
    }


    /* splash + intro sequence */
    let percent = 0;
    const loadingTimer = setInterval(() => {
      percent += 2;

      if (percent > 100) {
        percent = 100;
      }

      loadingFill.style.width = percent + "%";
      loadingPercent.textContent = percent + "%";

      if (percent >= 100) {
        clearInterval(loadingTimer);

        setTimeout(() => {
          showPage("work1");

          setTimeout(() => showPage("work2"), 1500);
          setTimeout(() => showPage("work3"), 3000);
          setTimeout(() => showPage("login"), 4500);
        }, 180);
      }
    }, 60);

    /* banner infinite rolling */
    let bannerIndex = 0;
    let bannerSlides = document.querySelectorAll(".banner-slide");

    if (bannerTrack && bannerSlides.length > 0) {
      const firstClone = bannerSlides[0].cloneNode(true);
      bannerTrack.appendChild(firstClone);
      bannerSlides = document.querySelectorAll(".banner-slide");

      setInterval(() => {
        bannerIndex++;

        bannerTrack.style.transition = "transform 0.8s ease";
        bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;

        if (bannerIndex === bannerSlides.length - 1) {
          setTimeout(() => {
            bannerTrack.style.transition = "none";
            bannerIndex = 0;
            bannerTrack.style.transform = "translateX(0)";
          }, 800);
        }
      }, 2500);
    }

    /* initial render */
    loadAppState();
    renderMenu("all");
    renderCartPage();
    updateCartCounts();
    bindStaticDetailImages();

    const horizontalAreas = document.querySelectorAll(".menu-horizontal");

horizontalAreas.forEach((area) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  area.addEventListener("mousedown", (e) => {
    isDown = true;
    area.style.cursor = "grabbing";
    startX = e.pageX - area.offsetLeft;
    scrollLeft = area.scrollLeft;
  });

  area.addEventListener("mouseleave", () => {
    isDown = false;
    area.style.cursor = "grab";
  });

  area.addEventListener("mouseup", () => {
    isDown = false;
    area.style.cursor = "grab";
  });

  area.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - area.offsetLeft;
    const walk = (x - startX) * 1.4;

    area.scrollLeft = scrollLeft - walk;
  });

  area.style.cursor = "grab";
});
