

    /* ===== 시작 팝업 기능: 오늘 하루 안보기 / 닫기 ===== */
    const eventPopup = document.getElementById("eventPopup");
    const eventPopupClose = document.getElementById("eventPopupClose");
    const eventPopupToday = document.getElementById("eventPopupToday");
    const EVENT_POPUP_KEY = "luhoEventPopupClosedDate";

    function getTodayKey(){
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    }

    function openEventPopup(){
      if(!eventPopup) return;
      const savedDate = localStorage.getItem(EVENT_POPUP_KEY);
      if(savedDate === getTodayKey()) return;
      eventPopup.classList.add("active");
      eventPopup.setAttribute("aria-hidden", "false");
    }

    function closeEventPopup(){
      if(!eventPopup) return;
      if(eventPopupToday && eventPopupToday.checked){
        localStorage.setItem(EVENT_POPUP_KEY, getTodayKey());
      }
      eventPopup.classList.remove("active");
      eventPopup.setAttribute("aria-hidden", "true");
    }

    window.addEventListener("load", openEventPopup);
    if(eventPopupClose) eventPopupClose.addEventListener("click", closeEventPopup);
    if(eventPopup){
      eventPopup.addEventListener("click", function(e){
        if(e.target === eventPopup) closeEventPopup();
      });
    }

    function onlyNumbers(value){
      let result = "";
      for(let i = 0; i < value.length; i++){
        const ch = value.charAt(i);
        if(ch >= "0" && ch <= "9") result += ch;
      }
      return result;
    }

    function formatPhone(value){
      const n = onlyNumbers(value).slice(0,11);
      if(n.length <= 3) return n;
      if(n.length <= 7) return n.slice(0,3) + "-" + n.slice(3);
      return n.slice(0,3) + "-" + n.slice(3,7) + "-" + n.slice(7);
    }

    function showFieldError(name, show){
      const target = document.querySelector("[name='" + name + "']") || document.getElementById(name);
      const errorText = document.querySelector("[data-error-for='" + name + "']");
      if(target) target.classList.toggle("error", show);
      if(errorText) errorText.style.display = show ? "block" : "none";
    }

    function validateForm(){
      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const category = document.getElementById("category");
      const agree = document.getElementById("agree");
      const nameOk = name.value.trim().length >= 2;
      const nums = onlyNumbers(phone.value);
      const phoneOk = nums.length === 10 || nums.length === 11;
      const categoryOk = category.value !== "";
      const agreeOk = agree.checked;
      showFieldError("name", !nameOk);
      showFieldError("phone", !phoneOk);
      showFieldError("category", !categoryOk);
      showFieldError("agree", !agreeOk);
      return nameOk && phoneOk && categoryOk && agreeOk;
    }

    function sheetReady(){
      return SHEET_SCRIPT_URL.indexOf("script.google.com/macros/s/") !== -1 &&
        SHEET_SCRIPT_URL.indexOf("/exec") !== -1 &&
        SHEET_SCRIPT_URL.indexOf("여기에_Apps_Script") === -1;
    }

    function validateModalForm(){
      const name = document.getElementById("modalName");
      const phone = document.getElementById("modalPhone");
      const category = document.getElementById("modalCategory");
      const agree = document.getElementById("modalAgree");
      const nameOk = name.value.trim().length >= 2;
      const phoneOk = onlyNumbers(phone.value).length === 10 || onlyNumbers(phone.value).length === 11;
      const categoryOk = category.value !== "";
      const agreeOk = agree.checked;
      showFieldError("modalName", !nameOk);
      showFieldError("modalPhone", !phoneOk);
      showFieldError("modalCategory", !categoryOk);
      showFieldError("modalAgree", !agreeOk);
      return nameOk && phoneOk && categoryOk && agreeOk;
    }

    const reviewSlider = document.getElementById("reviewSlider");
    const reviewTitle = document.getElementById("reviewTitle");
    const reviewTags = document.getElementById("reviewTags");
    const reviewQuote = document.getElementById("reviewQuote");
    const REVIEW_INFO = [
      { title: "눈성형 리얼 후기", tags: ["#눈매교정", "#자연스러운라인"], quote: "상담부터 수술 후 경과 안내까지 세심하게 진행되어 안심할 수 있었습니다." },
      { title: "코성형 리얼 후기", tags: ["#코끝", "#콧대라인"], quote: "제 얼굴형에 맞는 디자인으로 상담해주셔서 좋았고, 회복 과정도 친절하게 안내받았습니다." },
      { title: "리프팅 리얼 후기", tags: ["#리프팅", "#동안시술"], quote: "과한 변화보다 자연스러운 개선을 원했는데 원하는 방향으로 상담이 진행되어 만족스러웠습니다." }
    ];
    let reviewIndex = 0;

    function updateReview(){
      const slides = document.querySelectorAll(".review-slide");
      for(let i = 0; i < slides.length; i++) slides[i].classList.toggle("active", i === reviewIndex);
      const item = REVIEW_INFO[reviewIndex];
      reviewTitle.textContent = item.title;
      reviewQuote.textContent = item.quote;
      reviewTags.innerHTML = "";
      for(let i = 0; i < item.tags.length; i++){
        const tag = document.createElement("span");
        tag.className = "review-tag";
        tag.textContent = item.tags[i];
        reviewTags.appendChild(tag);
      }
    }

    updateReview();
    document.getElementById("reviewPrev").addEventListener("click", function(){ reviewIndex = reviewIndex === 0 ? REVIEW_INFO.length - 1 : reviewIndex - 1; updateReview(); });
    document.getElementById("reviewNext").addEventListener("click", function(){ reviewIndex = reviewIndex === REVIEW_INFO.length - 1 ? 0 : reviewIndex + 1; updateReview(); });

    const topBtn = document.getElementById("topBtn");
    window.addEventListener("scroll", function(){
      if(window.scrollY > 500) topBtn.classList.add("show");
      else topBtn.classList.remove("show");
    });
    topBtn.addEventListener("click", function(){ window.scrollTo({ top:0, behavior:"smooth" }); });

    const consultModal = document.getElementById("consultModal");
    const successModal = document.getElementById("successModal");
    const modalForm = document.getElementById("modalConsultForm");
    const modalFormMessage = document.getElementById("modalFormMessage");
    function openConsultModal(){ consultModal.classList.add("active"); consultModal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; }
    function closeConsultModal(){ consultModal.classList.remove("active"); consultModal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
    function openSuccessModal(){ successModal.classList.add("active"); successModal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; }
    function closeSuccessModal(){ successModal.classList.remove("active"); successModal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
    document.getElementById("openConsultModal").addEventListener("click", openConsultModal);
    document.getElementById("mobileOpenConsultModal").addEventListener("click", openConsultModal);
    document.getElementById("sectionOpenConsultModal").addEventListener("click", openConsultModal);
    document.getElementById("closeConsultModal").addEventListener("click", closeConsultModal);
    document.getElementById("closeSuccessModal").addEventListener("click", closeSuccessModal);
    consultModal.addEventListener("click", function(e){ if(e.target === consultModal) closeConsultModal(); });
    successModal.addEventListener("click", function(e){ if(e.target === successModal) closeSuccessModal(); });
    document.getElementById("modalPhone").addEventListener("input", function(e){ e.target.value = formatPhone(e.target.value); showFieldError("modalPhone", false); });
    document.getElementById("modalName").addEventListener("input", function(){ showFieldError("modalName", false); });
    document.getElementById("modalCategory").addEventListener("change", function(){ showFieldError("modalCategory", false); });
    document.getElementById("modalAgree").addEventListener("change", function(){ showFieldError("modalAgree", false); });

    modalForm.addEventListener("submit", async function(e){
      e.preventDefault();
      modalFormMessage.style.display = "none";
      modalFormMessage.classList.remove("error");
      if(!validateModalForm()){
        modalFormMessage.textContent = "필수 입력 항목을 확인해주세요.";
        modalFormMessage.classList.add("error");
        modalFormMessage.style.display = "block";
        return;
      }
      if(!sheetReady()){
        modalFormMessage.textContent = "Apps Script 웹앱 URL을 SHEET_SCRIPT_URL에 넣어주세요.";
        modalFormMessage.classList.add("error");
        modalFormMessage.style.display = "block";
        return;
      }
      const btn = modalForm.querySelector("button[type='submit']");
      btn.disabled = true;
      btn.textContent = "전송 중...";
      const sendData = {
        name: modalForm.modalName.value.trim(),
        phone: modalForm.modalPhone.value.trim(),
        category: modalForm.modalCategory.value,
        time: "미선택",
        message: modalForm.modalMessage.value.trim(),
        agree: modalForm.modalAgree.checked ? "동의" : "미동의",
        marketing: modalForm.modalMarketing.checked ? "동의" : "미동의",
        page: location.href
      };
      try{
        await fetch(SHEET_SCRIPT_URL, {
          method:"POST",
          mode:"no-cors",
          headers:{ "Content-Type":"text/plain;charset=utf-8" },
          body: JSON.stringify(sendData)
        });
        modalForm.reset();
        closeConsultModal();
        openSuccessModal();
      }catch(err){
        modalFormMessage.textContent = "전송 중 문제가 발생했습니다. Apps Script 웹앱 URL과 시트 연결을 확인해주세요.";
        modalFormMessage.classList.add("error");
        modalFormMessage.style.display = "block";
      }finally{
        btn.disabled = false;
        btn.textContent = "신청완료";
      }
    });

    const drawer = document.getElementById("mobileDrawer");
    const cover = document.getElementById("drawerCover");
    function openDrawer(){ drawer.classList.add("active"); cover.classList.add("active"); document.body.style.overflow = "hidden"; }
    function closeDrawer(){ drawer.classList.remove("active"); cover.classList.remove("active"); document.body.style.overflow = ""; }
    document.getElementById("menuOpen").addEventListener("click", openDrawer);
    document.getElementById("menuClose").addEventListener("click", closeDrawer);
    cover.addEventListener("click", closeDrawer);
    document.querySelectorAll(".drawer-link").forEach(function(link){ link.addEventListener("click", closeDrawer); });

    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add("show"); observer.unobserve(entry.target); }
      });
    }, { threshold: .15 });
    document.querySelectorAll(".reveal").forEach(function(el){ observer.observe(el); });

    /*
      현재 HTML에는 id="consultForm"인 일반 상담폼이 없습니다.
      그래서 일반폼 스크립트는 제거했습니다.
      실제 전송은 팝업폼 id="modalConsultForm"에서 처리됩니다.
    */
