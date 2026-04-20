const DATA_API_KEY = '7fb32307d1084916efd402f8c7df555b7c616c5148ff08a6ca84f0d350bd4572';
const API_URL = `https://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=${DATA_API_KEY}&resultType=json&numOfRows=200`;

let allRestaurants = [];
let currentPage = 1;
const itemsPerPage = 10;

// 1. 데이터 호출
async function fetchRestaurants() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allRestaurants = data.getFoodKr.item;
        document.getElementById('count').innerText = allRestaurants.length;
        renderPage(1);
    } catch (error) {
        console.error("API 로드 실패:", error);
    }
}

// 2. 페이지 렌더링
function renderPage(page) {
    currentPage = page;
    const listContainer = document.getElementById('restaurantList');
    listContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedItems = allRestaurants.slice(start, end);

    pagedItems.forEach((item, index) => {
        const realIndex = start + index;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div onclick="openDetail(${realIndex})">
                <h3>${item.MAIN_TITLE}</h3>
                <p><strong>주소:</strong> ${item.ADDR1}</p>
                <p><strong>메뉴:</strong> ${item.RPRSN_MENU}</p>
            </div>
            <div class="icons"><span>○</span><span>♡</span></div>
        `;
        listContainer.appendChild(card);
    });
    document.querySelector('main').scrollTop = 0;
    renderPagination();
}

// 3. 페이지네이션
function renderPagination() {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    const totalPages = Math.ceil(allRestaurants.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => renderPage(i);
        container.appendChild(btn);
    }
}

// 4. 상세 모달 및 지도 (지도 보이기 수정 핵심)
function openDetail(index) {
    const item = allRestaurants[index];
    document.getElementById('detailTitle').innerText = item.MAIN_TITLE;
    document.getElementById('detailAddr').innerText = item.ADDR1;
    document.getElementById('detailMenu').innerText = item.RPRSN_MENU;
    document.getElementById('detailTel').innerText = item.CNTCT_24 || '정보 없음';
    document.getElementById('detailImg').src = item.MAIN_IMG_NORMAL;
    document.getElementById('roadLink').href = `https://map.kakao.com/link/to/${item.MAIN_TITLE},${item.LAT},${item.LNG}`;

    const modal = document.getElementById('detailModal');
    modal.style.display = "block";

    // 지도가 잘 보이도록 지연 후 렌더링
    setTimeout(() => {
        const mapContainer = document.getElementById('map');
        const moveLatLon = new kakao.maps.LatLng(item.LAT, item.LNG);
        const mapOption = { center: moveLatLon, level: 3 };
        
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const marker = new kakao.maps.Marker({ position: moveLatLon });
        marker.setMap(map);

        // 모달에서 지도가 안 깨지게 하는 핵심 함수
        map.relayout();
        map.setCenter(moveLatLon);
    }, 300);

    loadReviews(item.MAIN_TITLE);
}

function saveReview() {
    const title = document.getElementById('detailTitle').innerText;
    const content = document.getElementById('reviewInput').value;
    if(!content) return alert("내용을 입력하세요.");
    const reviews = JSON.parse(localStorage.getItem(title) || "[]");
    reviews.push({content, date: new Date().toLocaleDateString()});
    localStorage.setItem(title, JSON.stringify(reviews));
    document.getElementById('reviewInput').value = '';
    loadReviews(title);
}

function loadReviews(title) {
    const reviews = JSON.parse(localStorage.getItem(title) || "[]");
    document.getElementById('reviewList').innerHTML = reviews.map(r => `<li>${r.content} <small>(${r.date})</small></li>`).reverse().join('');
}

document.querySelector('.close-btn').onclick = () => document.getElementById('detailModal').style.display = "none";

fetchRestaurants();