$(function () {
    // 처음에 list 숨김
    $("footer .inner .family .list").hide();

    // 버튼 클릭 시 list 토글
    $("footer .inner .family button").click(function () {
        $("footer .inner .family .list").slideToggle();
    });
});