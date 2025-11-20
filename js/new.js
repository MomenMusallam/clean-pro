        // =========================
        // Bootstrap Form Validation
        // =========================
    //       const toggleBtn = document.getElementById('toggleBtn');

    // toggleBtn.addEventListener('click', function (e) {
    //     console.log(111);

    //     e.preventDefault(); // يمنع إعادة تحميل الصفحة

    //     if (toggleBtn.textContent.trim() === "De") {
    //         toggleBtn.textContent = "En";
    //         toggleBtn.href = "#"; // مؤقت
    //     } else {
    //         toggleBtn.textContent = "De";
    //         toggleBtn.href = "#"; // مؤقت
    //     }
    // });

const thumbnails = document.querySelectorAll('.thumbnails img');
const box1 = document.querySelector('.box-1');
const box2 = document.querySelector('.box-2');
const box3 = document.querySelector('.box-3');
const box4 = document.querySelector('.box-4');
box4.style.display = 'none';
box4.style.pointerEvents = 'none';

thumbnails.forEach(img => {
    img.addEventListener('click', () => {
        console.log(1112,thumbnails);

        // إزالة الكلاس من جميع الصو
        thumbnails.forEach(i => i.classList.remove('selected-thumb'));
        // إضافة الكلاس على الصوة اللي ضغطت عليها
        img.classList.add('selected-thumb');
    });
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
                couchIndividual: 0
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
                couchIndividual: 0
            };
                        let data = {
                             tabName:"Normal-Cleaning"
                        };
                        let CleaningData = {};




let photos = [];

const fileInput = document.getElementById("formFileMultiple");
const imgCount = document.querySelector(".imgCount");

fileInput.addEventListener("change", function (e) {
    const newFiles = Array.from(e.target.files);

    // منع أن يصبح العدد أكب من 5
    if (photos.length + newFiles.length > 5) {
        alert("لا يمكنك فع أكث من 5 صو!");
        fileInput.value = "";
        return;
    }

    // دمج الصو الجديدة
    photos = photos.concat(newFiles);

    // تحديث العض + الكاونت
    renderPhotos();

    // يسمح بفع نفس الصوة لاحقاً
    fileInput.value = "";
});

function renderPhotos() {
    const preview = document.getElementById("preview");
    preview.innerHTML = "";

    // تحديث الكاونت
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
        <img src="${e.target.result}"
             style="width:100%; height:100%; object-fit:cover; border-radius:5px;" />
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

                // حذف الصوة
                photos.splice(idx, 1);

                // إعادة عض الصو + تحديث الكاونت
                renderPhotos();
            });

            preview.appendChild(card);
        };
        reader.readAsDataURL(file);
    });
}


document.getElementById("SubmitForm").addEventListener("click", function (e) {
    e.preventDefault(); // يمنع اليلود إذا كان داخل فوم
    collectData();
});

        function collectData() {
CleaningData = {
        areaForNormal: document.getElementById("areaForNormal")?.value || "",
        reasonForNormal: document.getElementById("reasonForNormal")?.value || "",
        requestsForNormal: Array.from(document.querySelectorAll('input[name="requestsForNormal"]:checked')).map(e => e.value),
        contaminationForNormal: document.querySelector('input[name="contaminationForNormal"]:checked')?.value || "",

         areaForNormalOption: document.getElementById("areaForNormalOption")?.value || "",
        reasonForNormalOption: document.getElementById("reasonForNormalOption")?.value || "",
        requestsForNormalOption: Array.from(document.querySelectorAll('input[name="requestsForNormalOption"]:checked')).map(e => e.value),
        contaminationForNormalOption: document.querySelector('input[name="contaminationForNormalOption"]:checked')?.value || "",

        reasonForWindowCleaning: document.getElementById("reasonForWindowCleaning")?.value || "",
        heightInputForWindowCleaning: document.getElementById("heightInputForWindowCleaning")?.value || "",
        casementForWindowCleaning: document.getElementById("casementForWindowCleaning")?.value || "",
        requestsForWindowCleaning: Array.from(document.querySelectorAll('input[name="requestsForWindowCleaning"]:checked')).map(e => e.value),
        contaminationForWindowCleaning: document.querySelector('input[name="contaminationForWindowCleaning"]:checked')?.value || "",

        reasonForWindowCleaningOptional: document.getElementById("reasonForWindowCleaningOptional")?.value || "",
        heightInputForWindowCleaningOptional: document.getElementById("heightInputForWindowCleaningOptional")?.value || "",
        casementForWindowCleaningOptional: document.getElementById("casementForWindowCleaningOptional")?.value || "",
        requestsForWindowCleaningOptional: Array.from(document.querySelectorAll('input[name="requestsForWindowCleaningOptional"]:checked')).map(e => e.value),
        contaminationForWindowCleaningOptional: document.querySelector('input[name="contaminationForWindowCleaningOptional"]:checked')?.value || "",

        looseCarpetForCarpet: document.getElementById("looseCarpetForCarpet")?.value || "",
        totalAreaForCarpet: document.getElementById("totalAreaForCarpet")?.value || "",
        fixedCarpetForCarpet: document.getElementById("fixedCarpetForCarpet")?.value || "",
        requestsForCarpet: Array.from(document.querySelectorAll('input[name="requestsForCarpet"]:checked')).map(e => e.value),
        contaminationForCarpet: document.querySelector('input[name="contaminationForCarpet"]:checked')?.value || "",

        looseCarpetForCarpetOptional: document.getElementById("looseCarpetForCarpetOptional")?.value || "",
        totalAreaForCarpetOptional: document.getElementById("totalAreaForCarpetOptional")?.value || "",
        fixedCarpetForCarpetOptional: document.getElementById("fixedCarpetForCarpetOptional")?.value || "",
        requestsForCarpetOptional: Array.from(document.querySelectorAll('input[name="requestsForCarpetOptional"]:checked')).map(e => e.value),
        contaminationForCarpetOptional: document.querySelector('input[name="contaminationForCarpetOptional"]:checked')?.value || "",

        areaForSpringCleaning: document.getElementById("areaForSpringCleaning")?.value || "",
        reasonForSpringCleaning: document.getElementById("reasonForSpringCleaning")?.value || "",
        requestsForSpringCleaning: Array.from(document.querySelectorAll('input[name="requestsForSpringCleaning"]:checked')).map(e => e.value),
        contaminationForSpringCleaning: document.querySelector('input[name="contaminationForSpringCleaning"]:checked')?.value || "",

        areaForCleaning: document.getElementById("areaForCleaning")?.value || "",
        reasonForCleaning: document.getElementById("reasonForCleaning")?.value || "",
        requestsForCleaning: Array.from(document.querySelectorAll('input[name="requestsForCleaning"]:checked')).map(e => e.value),
        contaminationForCleaning: document.querySelector('input[name="contaminationForCleaning"]:checked')?.value || "",

        areaForMessieApatment: document.getElementById("areaForMessieApatment")?.value || "",
        reasonForMessieApatment: document.getElementById("reasonForMessieApatment")?.value || "",
        requestsForMessieApatment: Array.from(document.querySelectorAll('input[name="requestsForMessieApatment"]:checked')).map(e => e.value),
        contaminationForMessieApatment: document.querySelector('input[name="contaminationForMessieApatment"]:checked')?.value || "",

        upholstery: upholstery,
        contaminationForUpholstery: document.querySelector('input[name="contaminationForUpholstery"]:checked')?.value || "",
        requestsForUpholstery: Array.from(document.querySelectorAll('input[name="requestsForUpholstery"]:checked')).map(e => e.value),
        upholsteryOptional: upholsteryOptional,
        reason: document.getElementById("windowReason")?.value || "",
        area: document.getElementById("windowArea")?.value || "",
        contaminationForUpholsteryOptional: document.querySelector('input[name="contaminationForUpholsteryOptional"]:checked')?.value || "",
        requestsForUpholsteryOptional: Array.from(document.querySelectorAll('input[name="requestsForUpholsteryOptional"]:checked')).map(e => e.value),
        contamination: document.querySelector('input[name="windowContamination"]:checked')?.value || "",
        requests: Array.from(document.querySelectorAll('input[name="windowRequests"]:checked')).map(e => e.value),
    };


            data = {...data,
                type: document.getElementById("typeSelect")?.value || "",
                storey: document.getElementById("storeyInput")?.value || "",
                furniture: document.getElementById("furnitureSelect")?.value || "",
                reason: document.getElementById("reasonSelect")?.value || "",
                casement: document.getElementById("casementInput")?.value || "",
                height: document.getElementById("heightInput")?.value || "",
                contamination: document.querySelector('input[name="contamination"]:checked')?.value || "",
                requests: Array.from(document.querySelectorAll('input[name="requests"]:checked')).map(e => e.value),
                info: document.getElementById("infoTextarea")?.value || "",
                photos: Array.from(document.getElementById("formFileMultiple")?.files || []).map(f => f.name),
                dateTime: document.getElementById("datetimepicker1Input")?.value || "",

                billing: {
                    email: document.getElementById("billingEmail")?.value || "",
                    mobile: billingInput.value || "",
                    countryCode: itiBilling.getSelectedCountryData().dialCode || "",
                    company: document.getElementById("billingCompany")?.value || "",
                    country: document.getElementById("billingCountry")?.value || "",
                    salutation: document.getElementById("billingSalutation")?.value || "",
                    firstName: document.getElementById("billingFirstName")?.value || "",
                    secondName: document.getElementById("billingSecondName")?.value || "",
                    street: document.getElementById("billingStreet")?.value || "",
                    no: document.getElementById("billingNo")?.value || "",
                    zip: document.getElementById("billingZip")?.value || "",
                    city: document.getElementById("billingCity")?.value || "",
                    hasSeparateCleaningAddress: document.getElementById("separateCleaningAddress")?.checked || false
                },



                cleaning: {
                    company: document.getElementById("cleaningCompany")?.value || "",
                    street: document.getElementById("cleaningStreet")?.value || "",
                    no: document.getElementById("cleaningNo")?.value || "",
                    zip: document.getElementById("cleaningZip")?.value || "",
                    city: document.getElementById("cleaningCity")?.value || "",
                    hasSeparateContactPerson: document.getElementById("separateContactPerson")?.checked || false
                },

                contact: {
                    mobile: contactInput.value || "",
                    countryCode: itiContact.getSelectedCountryData().dialCode || "",
                    country: document.getElementById("contactCountry")?.value || "",
                    salutation: document.getElementById("contactSalutation")?.value || "",
                    firstName: document.getElementById("contactFirstName")?.value || "",
                    secondName: document.getElementById("contactSecondName")?.value || "",
                    email: document.getElementById("contactEmail")?.value || "",
                    note: document.getElementById("contactNote")?.value || ""
                },

                voucher: document.getElementById("voucherCode")?.value || "",

                carpetCleaning: {
                    looseCarpet: document.getElementById("looseCarpetInput")?.value || "",
                    totalArea: document.getElementById("totalArea")?.value || "",
                    fixedCarpet: document.getElementById("fixedCarpetInput")?.value || ""
                }
            };

    data = { ...data, CleaningData };
    console.log("Collected Data:", data);
        }


        // =========================
        // Tempus Dominus Date Picker
        // =========================
        document.addEventListener("DOMContentLoaded", function () {
            const picker = new tempusDominus.TempusDominus(
                document.getElementById("datetimepicker1"),
                {
                    multipleDates: true,
                    display: {
                        components: { calendar: true, date: true, month: true, year: true, decades: true, clock: false },
                        buttons: { today: true, clear: true, close: true }
                    },
                    localization: { format: 'dd/MM/yyyy' },
                    useCurrent: false
                }
            );


            const selectedDatesList = document.getElementById("selectedDatesList");
            const inputField = document.getElementById("datetimepicker1Input");
            let selectedDates = [];

            function renderSelectedDates() {
                selectedDatesList.innerHTML = '';
                selectedDates.forEach((d, index) => {
                    const dateStr = new Date(d).toLocaleDateString('en-GB');
                    const div = document.createElement('div');
                    div.style.display = 'inline-block';
                    div.style.margin = '5px';
                    div.style.padding = '5px 10px';
                    div.style.background = '#3ca200';
                    div.style.color = 'white';
                    div.style.borderRadius = '5px';
                    div.style.cursor = 'pointer';
                    div.textContent = dateStr + ' ✕';

                    div.addEventListener('click', () => {
                        selectedDates.splice(index, 1);
                        if (selectedDates.length < 3) inputField.disabled = false;
                        renderSelectedDates();
                        inputField.value = selectedDates.map(d => new Date(d).toLocaleDateString('en-GB')).join(', ');
                    });

                    selectedDatesList.appendChild(div);
                });
            }

            picker.subscribe(tempusDominus.Namespace.events.change, (e) => {
                const pickedDate = e.date;
                if (!pickedDate) return;
                const dateStr = pickedDate.toDateString();
                if (!selectedDates.some(d => new Date(d).toDateString() === dateStr)) selectedDates.push(pickedDate);
                renderSelectedDates();
                inputField.value = selectedDates.map(d => new Date(d).toLocaleDateString('en-GB')).join(', ');
                picker.hide();
                inputField.disabled = selectedDates.length >= 3;
            });
        });

        // =========================
        // intl-tel-input Initialization
        // =========================
        const billingInput = document.querySelector("#billingMobile");
        const contactInput = document.querySelector("#contactMobile");

        // حفظ instance لكل input
        const itiBilling = window.intlTelInput(billingInput, {
            initialCountry: "de",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js"
        });

        const itiContact = window.intlTelInput(contactInput, {
            initialCountry: "de",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js"
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
document.querySelectorAll('.btn-form').forEach(button => {
    button.addEventListener('click', function () {

        const loading = document.querySelector('.loading');
        if (loading) loading.style.display = 'flex';

        // المعرف الثابت للتاب
        const tabId = this.dataset.tab;

        // ===============================
        // 🔥 تغيير نص الـ accordion حسب اسم التاب
        // ===============================
        const accordionTitle = document.getElementById("accordionTitle");
        if (accordionTitle) {
            const titleText = this.querySelector("span")?.textContent.trim() || "";
            accordionTitle.textContent = titleText;
        }
        // ===============================


        // إخفاء كل التابات
        document.querySelectorAll('.tab-section').forEach(div => {
            div.style.display = 'none';
        });

        // إعادة تفعيل كل الخيارات في select
        const select = document.getElementById('which');
        if (select) {
            select.querySelectorAll('option').forEach(opt => opt.disabled = false);
            select.value = ''; // القيمة الافتراضية
        }

        // إعادة تفعيل كل العناصر في dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('disabled');
            item.style.pointerEvents = "auto";
            if (item.dataset.value === 'box-4') {
                item.style.display = 'block';
            }
        });

        // إخفاء كل الصناديق بالكامل
        document.querySelectorAll('#boxes > .box').forEach(box => {
            box.classList.add('hidden');
        });

        // إظهار التاب المطلوب
        const targetDiv = document.querySelector(`.tab-section[data-tab="${tabId}"]`);
        if (targetDiv) targetDiv.style.display = 'block';

        // تفريغ CleaningData
        data = { ...data, CleaningData: {} };

        // تفريغ الحقول
        document.querySelectorAll('.tab-section input, .tab-section select, .tab-section textarea')
            .forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });

        // منطق إظهار الصناديق حسب التاب
        if (tabId === "windows-cleaning") {
            box1.classList.add('hidden');
            box2.classList.remove('hidden');
            box3.classList.remove('hidden');
            box4.classList.remove('hidden');

        } else if (tabId === "carpet") {
            box1.classList.remove('hidden');
            box2.classList.add('hidden');
            box3.classList.remove('hidden');
            box4.classList.remove('hidden');

        } else if (tabId === "upholstery-cleaning") {
            box1.classList.remove('hidden');
            box2.classList.remove('hidden');
            box3.classList.add('hidden');
            box4.classList.remove('hidden');

        } else {
            box1.classList.remove('hidden');
            box2.classList.remove('hidden');
            box3.classList.remove('hidden');
            box4.classList.add('hidden');
        }

        // Scroll + Loading
        setTimeout(() => {
            if (loading) loading.style.display = 'none';

            if (targetDiv) {
                const container = document.querySelector('.container-tabs2-section');
                if (container) {
                    container.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }

        }, 2000);
    });
});











        // =========================
        // Separate Cleaning Address Toggle
        // =========================
        const separateCheckbox = document.getElementById('separateCleaningAddress');
        const cleaningSection = document.querySelector('.ceaning-address');
        function toggleCleaningSection() {
            if (separateCheckbox.checked) cleaningSection.style.display = 'block';
            else {
                cleaningSection.style.display = 'none';
                cleaningSection.querySelectorAll('input').forEach(input => input.value = '');
            }
        }
        separateCheckbox.addEventListener('change', toggleCleaningSection);
        toggleCleaningSection();

        // =========================
        // Separate Contact Person Toggle
        // =========================
        const contactCheckbox = document.getElementById('separateContactPerson');
        const contactSection = document.querySelector('.contact-person');
        function toggleContactSection() {
            if (contactCheckbox.checked) contactSection.style.display = 'block';
            else {
                contactSection.style.display = 'none';
                contactSection.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
            }
        }
        contactCheckbox.addEventListener('change', toggleContactSection);
        toggleContactSection();
        const input = document.getElementById('looseCarpetForCarpet');
        const incBtn = document.getElementById('incrementBtn');
        const decBtn = document.getElementById('decrementBtn');

        incBtn.addEventListener('click', () => {
            input.value = Number(input.value) + 1;
        });

        decBtn.addEventListener('click', () => {
            if (Number(input.value) > 0) {
                input.value = Number(input.value) - 1;
            }
        });

        // منع القيم السالبة
        input.addEventListener('input', () => {
            if (input.value < 0) input.value = 0;
        });
        const inputOptional = document.getElementById('looseCarpetForCarpetOptional');
        const incBtnOptional = document.getElementById('incrementBtnOptional');
        const decBtnOptional = document.getElementById('decrementBtnOptional');

        incBtnOptional.addEventListener('click', () => {
            inputOptional.value = Number(inputOptional.value) + 1;
        });

        decBtnOptional.addEventListener('click', () => {
            if (Number(inputOptional.value) > 0) {
                inputOptional.value = Number(inputOptional.value) - 1;
            }
        });

        // منع القيم السالبة
        inputOptional.addEventListener('input', () => {
            if (inputOptional.value < 0) inputOptional.value = 0;
        });


        document.addEventListener('click', e => {
            if (e.target.classList.contains('btn-plus') || e.target.classList.contains('btn-minus')) {

                const id = e.target.getAttribute('data-id');
                const input = document.getElementById(id);
                let value = Number(input.value);

                if (e.target.classList.contains('btn-plus')) value++;
                else if (e.target.classList.contains('btn-minus') && value > 0) value--;

                input.value = value;
                upholstery[id] = value;
                console.log(upholstery);
            }
        });


        document.addEventListener('input', e => {
            if (e.target.classList.contains('counter-input')) {
                const id = e.target.id;
                const value = Math.max(0, Number(e.target.value));
                upholstery[id] = value;
                console.log(upholstery);
            }
        });
        document.addEventListener('input', e => {
            if (e.target.classList.contains('counter-input')) {
                const id = e.target.id;
                const value = Math.max(0, Number(e.target.value));
                upholsteryOptional[id] = value;
            }
        });
        // العناص
        const select = document.getElementById('which');
        const boxes = document.getElementById('boxes');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const dropdownBtn = document.getElementById('whichDropdown');

        dropdownItems.forEach(item => {

          item.addEventListener('click', function (e) {
    e.preventDefault();

    const val = this.getAttribute('data-value') || this.dataset.value;
    const text = this.textContent.trim();

    const box = document.getElementById(val);
    if (!box) return;

    // إذا كان الصندوق مخفي → أظهره وعلّق الخيا
    if (box.classList.contains('hidden')) {
        box.classList.remove('hidden');

        // عطّل هذا البند في المنيو (dropdown item)
        this.classList.add('disabled');
        this.style.pointerEvents = "none";

        // تعطيل الخيا الموازي في الـ select (لو موجود)
        const select = document.getElementById('which');
        if (select) {
            const opt = select.querySelector(`option[value="${val}"]`);
            if (opt) opt.disabled = true;
            // إعادة قيمة select إلى الافتراضي (اختياري)
            select.value = '';
        }

        // إعادة اسم زر الـ dropdown كما طلبت
        if (typeof dropdownBtn !== 'undefined' && dropdownBtn) {
            dropdownBtn.textContent = "+";
        }
    } else {
        // إذا الصندوق ظاهر بالفعل نقدر فقط ننقّل السكروول إليه
        // (ولا نغيّر حالة الـ dropdown item لأنّه مفعل مسبقاً)
    }

    // Scroll إلى الصندوق داخل الـ container المحدد (سلوك سلس)
    const container = document.querySelector('.container-tabs2-section');
    if (container) {
        // scrollIntoView يتصرف جيداً ويبحث عن أقرب ancestor قابل للتمرير (container)
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

        // بديل (دقيق أكثر لو احتجت ضبط موضع أعلى):
        // const top = box.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        // container.scrollTo({ top, behavior: 'smooth' });
    } else {
        // لو ما فيه container محدد، ننقّل الصفحة كاملة إليه
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

        });

       // عند الضغط على ز الحذف داخل أي box
boxes.addEventListener('click', function (e) {
    // البحث عن أقب عنص يحتوي على الكلاس btn-remove
    const btn = e.target.closest('.btn-remove, .btn-remove-svg');
    if (!btn) return;

    // أقب صندوق يبدأ ID تبعه بـ box-
    const box = btn.closest('[id^="box-"]');
    if (!box) return;

    // إخفاء الصندوق
    box.classList.add('hidden');

    // إعادة تفعيل الخيا في المنيو
    const option = document.querySelector(`.dropdown-item[data-value="${box.id}"]`);
    if (option) {
        option.classList.remove('disabled');
        option.style.pointerEvents = "auto";
    }

    // إذا كان الصندوق هو box-3 فضّي الأوبجكت
    if (box.id === "box-3") {
        upholstery = {};   // ← هنا التفيغ
    }
});




        // عند تغيي الـ select
        select.addEventListener('change', (e) => {

            const val = e.target.value;
            if (!val) return;


            const box = document.getElementById(val);
            if (!box) return;


            // إذا الصندوق مخفي نعضه ونوقف الخيا
            if (box.classList.contains('hidden')) {
                box.classList.remove('hidden');
                // تعطيل الخيا المصاحب
                const opt = select.querySelector(`option[value="${val}"]`);
                if (opt) opt.disabled = true;


                // نعيد قيمة الـ select إلى العنص الافتاضي
                select.value = '';
            }
        });


        // حدث عالمي لأزا الحذف داخل الصناديق
        boxes.addEventListener('click', (e) => {

            if (!e.target.classList.contains('btn-remove')) return;
            const box = e.target.closest('.box');
            if (!box) return;


            const id = box.id;


            // اخفاء الصندوق
            box.classList.add('hidden');


            // إعادة تفعيل الخيا في select
            const opt = select.querySelector(`option[value="${id}"]`);
            if (opt) opt.disabled = false;


            // إذا أدت حذف الـ DOM بالكامل بدل الإخفاء استخدم box.remove();
            // box.remove();
        });

