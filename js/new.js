const confirmRadio = document.getElementById("confirmForm");
const confirmLabel = document.getElementById("confirmFormLabel");

// إضافة حدث عند الضغط على الـradio
confirmRadio.addEventListener("click", () => {
  confirmLabel.style.color = "black";
  confirmRadio.style.border = "1px solid #dee2e6";
});
function setupRadioSelection(radioName) {
  const radios = document.getElementsByName(radioName);

  radios.forEach((radio) => {
    radio.addEventListener("click", () => {
      // إزالة أي class error أو selected من كل الـ labels
      radios.forEach((r) => {
        r.parentElement.classList.remove("selected", "error");
      });

      // إضافة class selected للـ label اللي اختاره المستخدم
      radio.parentElement.classList.add("selected");
    });
  });
}
setupRadioSelection("contaminationForNormal");
setupRadioSelection("contaminationForWindowCleaning");
setupRadioSelection("contaminationForCarpet");
setupRadioSelection("contaminationForSpringCleaning");
setupRadioSelection("contaminationForCleaning");
setupRadioSelection("contaminationForMessieApatment");
setupRadioSelection("contaminationForUpholstery");
setupRadioSelection("contaminationForWindowCleaningOptional");
setupRadioSelection("contaminationForCarpetOptional");
setupRadioSelection("contaminationForUpholsteryOptional");
setupRadioSelection("contaminationForNormalOption");

document
  .querySelectorAll('input[type="number"].upholstery-input')
  .forEach((input) => {
    input.addEventListener("input", () => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val < 0) {
        input.value = ""; // تمسح القيمة السالبة
        // أو مثلاً: input.value = 0;
      }
    });
  });
document.querySelectorAll(".cleaning-request label").forEach((label) => {
  const fullText = label.textContent.trim();

  if (fullText.length > 9) {
    const shortText = fullText.slice(0, 9) + "...";
    label.textContent = shortText;

    // عند عمل هوفر
    label.addEventListener("mouseenter", () => {
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip-box");
      tooltip.textContent = fullText;
      document.body.appendChild(tooltip);

      const rect = label.getBoundingClientRect();
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = rect.top - 5 + "px";
      label._tooltip = tooltip;
    });

    // عند الخروج من الهوفر
    label.addEventListener("mouseleave", () => {
      if (label._tooltip) {
        label._tooltip.remove();
        label._tooltip = null;
      }
    });
  }
});

// عرض التواريخ المختارة كـ div مع زر ✕

const thumbnails = document.querySelectorAll(".thumbnails img");
const box1 = document.querySelector(".box-1");
const box2 = document.querySelector(".box-2");
const box3 = document.querySelector(".box-3");
const box4 = document.querySelector(".box-4");
box4.style.display = "none";
box4.style.pointerEvents = "none";

thumbnails.forEach((img) => {
  img.addEventListener("click", () => {
    console.log(1112, thumbnails);

    // إزالة الكلاس من جميع الصو
    thumbnails.forEach((i) => i.classList.remove("selected-thumb"));
    // إضافة الكلاس على الصوة اللي ضغطت عليها
    img.classList.add("selected-thumb");
  });
});
document.querySelectorAll(".form-control").forEach((input) => {
  const checkValue = () => {
    if (input.value.trim() !== "") {
      input.classList.add("filled");
    } else {
      input.classList.remove("filled");
    }
  };

  // تحقق عند التحميل
  checkValue();

  // تحقق عند الكتابة أو تغييرات الانبوت
  input.addEventListener("input", checkValue);
});
document.querySelectorAll(".form-control").forEach((element) => {
  // فحص وجود .com داخل الإيميل

  // تجاهل العناصر داخل .upholstery-wrapper بالكامل
  if (element.closest(".upholstery-wrapper")) return;

  // 🛑 تجاهل انبوت الصور / الملفات
  if (element.tagName.toLowerCase() === "input" && element.type === "file") {
    return;
  }

  // إذا كان input type number ولم يتم تحديد قيمة، اجعله 0
  if (
    element.tagName.toLowerCase() === "input" &&
    element.type === "number" &&
    element.value.trim() === ""
  ) {
    element.value = "0";
  }

  // إنشاء علامة ✓ للـ input و textarea فقط (ليس select)
  let check;
  if (element.tagName.toLowerCase() !== "select") {
    check = document.createElement("span");
    check.textContent = "✓";
    check.style.position = "absolute";
    check.style.right = "10px";
    check.style.background = "#fff";
    check.className = "checkInput";

    check.style.top = "50%";
    check.style.zIndex = "10";
    check.style.transform = "translateY(-50%)";
    check.style.color = "#3ca200";
    check.style.fontSize = "22px";
    check.style.fontWeight = "bold";
    check.style.textShadow = "0 0 3px rgba(0,0,0,0.3)";
    check.style.display = "none";
    check.style.pointerEvents = "none";
  }

  // إنشاء wrapper حول الانبوت
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.width = "100%";

  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  if (check) wrapper.appendChild(check);

  const toggleCheck = () => {
    const value = element.value.trim();

    // فحص صحة الإيميل حسب HTML5
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
    if (element.type === "email" && !element.checkValidity()) {
      if (check) check.style.display = "none";
      element.style.borderColor = "";
      return;
    }

    // يجب أن ينتهي بـ .com تحديداً
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    if (element.type === "email" && !value.toLowerCase().endsWith(".com")) {
      if (check) check.style.display = "none";
      element.style.borderColor = "";
      return;
    }

    // باقي الأنواع
    if (value !== "" && value !== "0") {
      if (check) check.style.display = "block";
      element.classList.remove("error");
      element.style.borderColor = "#3ca200";
    } else {
      if (check) check.style.display = "none";
      element.style.borderColor = "";
    }
  };

  toggleCheck();
  element.addEventListener("input", toggleCheck);
  element.addEventListener("focus", toggleCheck);
  element.addEventListener("blur", toggleCheck);
});

document.querySelectorAll(".form-select").forEach((select) => {
  // تجاهل العناصر داخل .upholstery-wrapper بالكامل
  if (select.closest(".upholstery-wrapper")) return;

  // تعيين القيمة الافتراضية 0 إذا لم يتم اختيار أي خيار
  if (!select.value || select.value.trim() === "") {
    select.value = "0";
  }

  // إنشاء wrapper حول select
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-flex";
  wrapper.style.width = "100%";
  wrapper.style.boxSizing = "border-box";

  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  // 🔥 إنشاء علامة ✓
  const check = document.createElement("span");
  check.textContent = "✓";
  check.style.position = "absolute";
  check.style.right = "30px"; // 👉 العلامة يسار
  check.style.top = "50%";
  check.style.background = "#fff";
  check.className = "checkInput";
  check.style.transform = "translateY(-50%)";
  check.style.color = "#3ca200";
  check.style.fontSize = "22px";
  check.style.fontWeight = "bold";
  check.style.textShadow = "0 0 3px rgba(0,0,0,0.3)";
  check.style.display = "none";
  check.style.pointerEvents = "none";

  wrapper.appendChild(check);

  const toggleBorder = () => {
    const value = select.value.trim();

    if (value && value !== "" && value !== "0" && value !== "select") {
      select.style.borderColor = "#3ca200";
      check.style.display = "block"; // 👍 تظهر العلامة
    } else {
      select.classList.remove("error");

      select.style.borderColor = "";
      check.style.display = "none"; // تخفي العلامة
    }
  };

  toggleBorder();
  select.addEventListener("change", toggleBorder);
  select.addEventListener("focus", toggleBorder);
  select.addEventListener("blur", toggleBorder);
});

let upholstery = {
  twoSeater: 0,
  threeSeater: 0,
  cornerCouchSmall: 0,
  cornerCouchLarge: 0,
  armchair: 0,
  stool: 0,
  chairWithBackrest1: 0,
  chairWithBackrest2: 0,
  couchIndividual: 0,
};
let upholsteryOptional = {
  twoSeater: 0,
  threeSeater: 0,
  cornerCouchSmall: 0,
  cornerCouchLarge: 0,
  armchair: 0,
  stool: 0,
  chairWithBackrest1: 0,
  chairWithBackrest2: 0,
  couchIndividual: 0,
};
let data = {
  tabName: "normal-cleaning",
};
let CleaningData = {};

// مصفوفة لكل input حسب الـ ID
const photosMap = {};

function setupFileInput({ inputId, previewId, counterClass, maxFiles = 5 }) {
  console.log(document.getElementById(inputId));
  console.log(document.getElementById(previewId));
  console.log(document.querySelector(counterClass));

  const fileInput = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const imgCount = document.querySelector(counterClass);

  // تهيئة المصفوفة إذا ما كانت موجودة
  if (!photosMap[inputId]) photosMap[inputId] = [];

  fileInput.addEventListener("change", (e) => {
    const newFiles = Array.from(e.target.files);

    if (photosMap[inputId].length + newFiles.length > maxFiles) {
      alert(`لا يمكنك رفع أكثر من ${maxFiles} صور!`);
      fileInput.value = "";
      return;
    }

    photosMap[inputId] = photosMap[inputId].concat(newFiles);
    renderPhotos(inputId, preview, imgCount);
    fileInput.value = "";
  });
}

function renderPhotos(inputId, preview, imgCount) {
  preview.innerHTML = "";
  const photos = photosMap[inputId];
  imgCount.textContent = `${photos.length}/5`;

  photos.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const card = document.createElement("div");
      card.style.width = "120px";
      card.style.border = "1px solid #ccc";
      card.style.borderRadius = "8px";
      card.style.textAlign = "center";
      card.style.position = "relative";
      card.style.background = "#f9f9f9";

      card.innerHTML = `
    <div style="position: relative; width: 100%; height: 80px;">
        <img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:5px;" />
        <button data-index="${index}"
                style="
                    position:absolute;
                    top:5px;
                    right:5px;
                    width:20px;
                    height:20px;
                    border-radius:50%;
                    background-color:#bb0101;
                    color:white;
                    border:none;
                    font-weight:bold;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:0;
                    transition: all 0.3s;
                "
                onmouseover="this.style.backgroundColor='white'; this.style.color='red';"
                onmouseout="this.style.backgroundColor='red'; this.style.color='white';">
            ×
        </button>
    </div>
`;

      card.querySelector("button").addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        photos.splice(idx, 1);
        renderPhotos(inputId, preview, imgCount);
      });

      preview.appendChild(card);
    };
    reader.readAsDataURL(file);
  });
}

// مثال على الاستخدام لكل input
setupFileInput({
  inputId: "formFileMultiple",
  previewId: "preview",
  counterClass: ".imgCount",
});

setupFileInput({
  inputId: "formFileMultipleUpholstery",
  previewId: "previewUpholstery",
  counterClass: ".imgCountUpholstery",
});

setupFileInput({
  inputId: "formFileMultipleWindow",
  previewId: "previewWindow",
  counterClass: ".imgCountWindow",
});

setupFileInput({
  inputId: "formFileMultipleCarpet",
  previewId: "previewCarpet",
  counterClass: ".imgCountCarpet",
});
setupFileInput({
  inputId: "formFileMultipleNormal",
  previewId: "previewNormal",
  counterClass: ".imgCountNormal",
});

// =========================
// intl-tel-input Initialization
// =========================
const billingInput = document.querySelector("#billingMobile");
const contactInput = document.querySelector("#contactMobile");

// حفظ instance لكل input
const itiBilling = window.intlTelInput(billingInput, {
  initialCountry: "de",
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js",
});

const itiContact = window.intlTelInput(contactInput, {
  initialCountry: "de",
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js",
});

// =========================
// Form Data Collection
// =========================

// =========================
// File Input Limit
// =========================

// =========================
// Tabs Functionality
// =========================
document.querySelectorAll(".btn-form").forEach((button) => {
  button.addEventListener("click", function () {
    const tabId = this.dataset.tab;

    // التحقق إذا كان التاب الحالي هو نفسه المفعل
    const activeTab = document.querySelector(
      '.tab-section:not([style*="display: none"])'
    );
    if (activeTab && activeTab.dataset.tab === tabId) {
      return; // إيقاف تنفيذ الفانكشن إذا نفس التاب
    }

    const loading = document.querySelector(".loading");
    if (loading) loading.style.display = "flex";

    // ===============================
    // 🔥 تغيير نص الـ accordion حسب اسم التاب
    // ===============================
    const accordionTitle = document.getElementById("accordionTitle");
    if (accordionTitle) {
      const titleText = this.querySelector("span")?.textContent.trim() || "";
      accordionTitle.textContent = titleText;
    }
    // ===============================
    // فتح أول accordion-item بالقوة
    const firstItem = document.querySelector(".accordion-item:nth-child(1)");
    if (firstItem) {
      const btn = firstItem.querySelector(".accordion-button");
      const body = firstItem.querySelector(".accordion-collapse");

      btn.classList.remove("collapsed");
      body.classList.add("show");
    }

    // فتح العنصر السادس accordion-item بالقوة (العنصر 6)
    const sixthItem = document.querySelector(".accordion-item:nth-child(4)");
    if (sixthItem) {
      const btn = sixthItem.querySelector(".accordion-button");
      const body = sixthItem.querySelector(".accordion-collapse");

      btn.classList.remove("collapsed");
      body.classList.add("show");
    }

    document.querySelectorAll("input, select").forEach((el) => {
      el.classList.remove("error");
    });

    document.querySelectorAll(".error-icon").forEach((icon) => icon.remove());

    // إخفاء كل التابات
    document.querySelectorAll(".tab-section").forEach((div) => {
      div.style.display = "none";
    });

    // إعادة تفعيل كل الخيارات في select
    const select = document.getElementById("which");
    if (select) {
      select
        .querySelectorAll("option")
        .forEach((opt) => (opt.disabled = false));
      select.value = "";
    }

    // إعادة تفعيل كل العناصر في dropdown
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.classList.remove("disabled");
      item.style.pointerEvents = "auto";
      if (item.dataset.value === "box-4") {
        item.style.display = "block";
      }
    });

    // إخفاء كل الصناديق بالكامل
    document.querySelectorAll("#boxes > .box").forEach((box) => {
      box.classList.add("hidden");

      const accordionEl = box.querySelector(".accordion-collapse");

      // لو كان مفتوح لازم نسكّر الـ collapse عشان ما يخرب عند إضافته مرة ثانية
      if (accordionEl && accordionEl._bsInstance) {
        accordionEl._bsInstance.hide();
      }
    });

    // إظهار التاب المطلوب
    const targetDiv = document.querySelector(
      `.tab-section[data-tab="${tabId}"]`
    );
    if (targetDiv) targetDiv.style.display = "block";

    // تفريغ CleaningData
    data = { ...data, tabName: tabId, CleaningData: {} };

    // تفريغ الحقول
    document
      .querySelectorAll(
        ".tab-section input, .tab-section select, .tab-section textarea"
      )
      .forEach((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });

    // منطق إظهار الصناديق حسب التاب
    if (tabId === "windows-cleaning") {
      box1.classList.add("hidden");
      box2.classList.remove("hidden");
      box3.classList.remove("hidden");
      box4.classList.remove("hidden");
    } else if (tabId === "carpet") {
      box1.classList.remove("hidden");
      box2.classList.add("hidden");
      box3.classList.remove("hidden");
      box4.classList.remove("hidden");
    } else if (tabId === "upholstery-cleaning") {
      box1.classList.remove("hidden");
      box2.classList.remove("hidden");
      box3.classList.add("hidden");
      box4.classList.remove("hidden");
    } else {
      box1.classList.remove("hidden");
      box2.classList.remove("hidden");
      box3.classList.remove("hidden");
      box4.classList.add("hidden");
    }

    // Scroll + Loading
    setTimeout(() => {
      if (loading) loading.style.display = "none";

      if (targetDiv) {
        const container = document.querySelector(".container-tabs2-section");
        if (container) {
          container.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }
    }, 500);
  });
});

// =========================
// Separate Cleaning Address Toggle
// =========================
const separateCheckbox = document.getElementById("separateCleaningAddress");
const cleaningSection = document.querySelector(".ceaning-address");
function toggleCleaningSection() {
  if (separateCheckbox.checked) cleaningSection.style.display = "block";
  else {
    cleaningSection.style.display = "none";
    cleaningSection
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
  }
}
separateCheckbox.addEventListener("change", toggleCleaningSection);
toggleCleaningSection();

// =========================
// Separate Contact Person Toggle
// =========================
const contactCheckbox = document.getElementById("separateContactPerson");
const contactSection = document.querySelector(".contact-person");
function toggleContactSection() {
  if (contactCheckbox.checked) contactSection.style.display = "block";
  else {
    contactSection.style.display = "none";
    contactSection
      .querySelectorAll("input, select, textarea")
      .forEach((el) => (el.value = ""));
  }
}
contactCheckbox.addEventListener("change", toggleContactSection);
toggleContactSection();
const input = document.getElementById("looseCarpetForCarpet");
const incBtn = document.getElementById("incrementBtn");
const decBtn = document.getElementById("decrementBtn");

incBtn.addEventListener("click", () => {
  input.value = Number(input.value) + 1;
});

decBtn.addEventListener("click", () => {
  if (Number(input.value) > 0) {
    input.value = Number(input.value) - 1;
  }
});

// منع القيم السالبة
input.addEventListener("input", () => {
  if (input.value < 0) input.value = 0;
});
const inputOptional = document.getElementById("looseCarpetForCarpetOptional");
const incBtnOptional = document.getElementById("incrementBtnOptional");
const decBtnOptional = document.getElementById("decrementBtnOptional");

incBtnOptional.addEventListener("click", () => {
  inputOptional.value = Number(inputOptional.value) + 1;
});

decBtnOptional.addEventListener("click", () => {
  if (Number(inputOptional.value) > 0) {
    inputOptional.value = Number(inputOptional.value) - 1;
  }
});

// منع القيم السالبة
inputOptional.addEventListener("input", () => {
  if (inputOptional.value < 0) inputOptional.value = 0;
});

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("btn-plus") ||
    e.target.classList.contains("btn-minus")
  ) {
    const id = e.target.getAttribute("data-id");
    const input = document.getElementById(id);
    let value = Number(input.value);

    if (e.target.classList.contains("btn-plus")) value++;
    else if (e.target.classList.contains("btn-minus") && value > 0) value--;

    input.value = value;
    upholstery[id] = value;
    console.log(upholstery);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("counter-input")) {
    const id = e.target.id;
    const value = Math.max(0, Number(e.target.value));
    upholstery[id] = value;
    console.log(upholstery);
  }
});
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("counter-input")) {
    const id = e.target.id;
    const value = Math.max(0, Number(e.target.value));
    upholsteryOptional[id] = value;
  }
});
// العناص
const select = document.getElementById("which");
const boxes = document.getElementById("boxes");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const dropdownBtn = document.getElementById("whichDropdown");

dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("here2");

    const val = this.getAttribute("data-value") || this.dataset.value;
    const box = document.getElementById(val);
    console.log(val, "box");
    data = {
      ...data,
      optionsTabs: data.optionsTabs ? [...data.optionsTabs, val] : [val],
    };

    if (!box) return;

    // فتح الصندوق لو مخفي
    if (box.classList.contains("hidden")) {
      box.classList.remove("hidden");
      this.classList.add("disabled");
      this.style.pointerEvents = "none";

      const select = document.getElementById("which");
      if (select) {
        const opt = select.querySelector(`option[value="${val}"]`);
        if (opt) opt.disabled = true;
        select.value = "";
      }

      if (typeof dropdownBtn !== "undefined" && dropdownBtn) {
        dropdownBtn.textContent = "+";
      }
    }

    // فتح الـ accordion باستخدام Bootstrap Collapse
    // فتح الـ accordion باستخدام Bootstrap Collapse
    const accordionEl = box.querySelector(".accordion-collapse");

    if (accordionEl) {
      // لو في نسخة Bootstrap سابقة -> دمرها
      if (accordionEl._bsInstance) {
        accordionEl._bsInstance.dispose();
      }

      // اعمل instance جديدة
      const bsCollapse = new bootstrap.Collapse(accordionEl, { toggle: false });
      accordionEl._bsInstance = bsCollapse;

      // احذف أي event قديم
      if (accordionEl._shownHandler) {
        accordionEl.removeEventListener(
          "shown.bs.collapse",
          accordionEl._shownHandler
        );
      }
      function smoothScrollSlow(container, target, duration = 1000) {
        // 300ms حركة سريعة
        const start = container.scrollTop;
        const end = target.offsetTop - container.offsetTop;
        const change = end - start;
        const startTime = performance.now();

        function animate(time) {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);
          container.scrollTop = start + change * progress;
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }

      // الهاندلر
      accordionEl._shownHandler = function () {
        const container = document.querySelector(".container-tabs2-section");

        if (container) {
          const top = accordionEl.offsetTop - container.offsetTop;
          // تأخير 1 ثانية قبل البدء بالحركة
          setTimeout(() => {
            smoothScrollSlow(container, accordionEl, 800); // 2000ms = مدة الحركة
          }, 50);
        } else {
          setTimeout(() => {
            accordionEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      };

      // اربط الحدث
      accordionEl.addEventListener(
        "shown.bs.collapse",
        accordionEl._shownHandler
      );

      // ✨ تأخير بسيط حتى يرتبط الحدث ثم افتح الـ accordion
      setTimeout(() => {
        bsCollapse.show();
      }, 500);
    }
  });
});

// عند الضغط على ز الحذف داخل أي box
boxes.addEventListener("click", function (e) {
  // البحث عن أقب عنص يحتوي على الكلاس btn-remove
  const btn = e.target.closest(".btn-remove, .btn-remove-svg");
  if (!btn) return;

  // أقب صندوق يبدأ ID تبعه بـ box-
  const box = btn.closest('[id^="box-"]');
  if (!box) return;
  const accordionEl = box.querySelector(".accordion-collapse");
  if (accordionEl && accordionEl._bsInstance) {
    accordionEl._bsInstance.hide(); // ← يغلق collapse فعليًا
  }
  // إخفاء الصندوق
  box.classList.add("hidden");

  // إعادة تفعيل الخيا في المنيو
  const option = document.querySelector(
    `.dropdown-item[data-value="${box.id}"]`
  );
  if (option) {
    option.classList.remove("disabled");
    option.style.pointerEvents = "auto";
    console.log(box.id, "box.idbox.id");

    data = {
      ...data,
      optionsTabs: data.optionsTabs
        ? data.optionsTabs.filter((item) => item !== box.id)
        : [],
    };
  }

  // إذا كان الصندوق هو box-3 فضّي الأوبجكت
  if (box.id === "box-3") {
    upholstery = {}; // ← هنا التفيغ
  }
});

// عند تغيي الـ select
select.addEventListener("change", (e) => {
  const val = e.target.value;
  if (!val) return;

  const box = document.getElementById(val);
  if (!box) return;

  // إذا الصندوق مخفي نعضه ونوقف الخيا
  if (box.classList.contains("hidden")) {
    box.classList.remove("hidden");
    // تعطيل الخيا المصاحب
    const opt = select.querySelector(`option[value="${val}"]`);
    if (opt) opt.disabled = true;

    // نعيد قيمة الـ select إلى العنص الافتاضي
    select.value = "";
  }
});

// حدث عالمي لأزا الحذف داخل الصناديق
boxes.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-remove")) return;
  const box = e.target.closest(".box");
  if (!box) return;

  const id = box.id;

  // اخفاء الصندوق
  box.classList.add("hidden");

  // إعادة تفعيل الخيا في select
  const opt = select.querySelector(`option[value="${id}"]`);
  if (opt) opt.disabled = false;

  // إذا أدت حذف الـ DOM بالكامل بدل الإخفاء استخدم box.remove();
  // box.remove();
});
