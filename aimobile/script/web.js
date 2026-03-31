 <script>
        // 1. 카테고리 탭 선택 로직
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 기존 활성화 해제
                document.querySelector('.category-btn.active').classList.remove('active');
                // 클릭한 버튼 활성화
                this.classList.add('active');
            });
        });

        // 2. 하단 네비게이션 탭 선택 로직
        function setNavActive(element) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            element.classList.add('active');
        }

        // 3. 찜(하트) 버튼 토글 로직
        function toggleWish(btn) {
            const svg = btn.querySelector('svg');
            const isWished = svg.getAttribute('fill') === 'var(--primary-color)';

            if (isWished) {
                // 찜 해제 상태 (투명/흰색 테두리)
                svg.setAttribute('fill', 'rgba(255,255,255,0.7)');
                svg.setAttribute('stroke', '#fff');
            } else {
                // 찜 선택 상태 (연하늘색)
                svg.setAttribute('fill', 'var(--primary-color)');
                svg.setAttribute('stroke', 'var(--primary-color)');
            }
        }
    </script>