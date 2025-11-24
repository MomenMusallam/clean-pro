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

document.querySelectorAll('.cleaning-request label').forEach(label => {
    const fullText = label.textContent.trim();

    if (fullText.length > 9) {
        const shortText = fullText.slice(0, 9) + "...";
        label.textContent = shortText;

        // عند عمل هوفر
        label.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip-box');
            tooltip.textContent = fullText;
            document.body.appendChild(tooltip);

            const rect = label.getBoundingClientRect();
            tooltip.style.left = rect.left + "px";
            tooltip.style.top = (rect.top - 5) + "px";
            label._tooltip = tooltip;
        });

        // عند الخروج من الهوفر
        label.addEventListener('mouseleave', () => {
            if (label._tooltip) {
                label._tooltip.remove();
                label._tooltip = null;
            }
        });
    }
});



// عرض التواريخ المختارة كـ div مع زر ✕
function renderSelectedDates(dates) {
    selectedDatesList.innerHTML = '';
    dates.forEach((d, index) => {
        const div = document.createElement('div');
        div.textContent = d.toLocaleDateString('en-GB') + ' ✕';
        div.dataset.index = index;

        div.addEventListener('click', () => {
            const newDates = fp.selectedDates.filter((_, i) => i !== index);
            fp.setDate(newDates, true);
            renderSelectedDates(newDates);

            if (newDates.length < 3) {
                fp.set('disable', []);
            }
        });

        selectedDatesList.appendChild(div);
    });
}


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
document.querySelectorAll('.form-control').forEach(input => {
    const checkValue = () => {
        if (input.value.trim() !== "") {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    };

    // تحقق عند التحميل
    checkValue();

    // تحقق عند الكتابة أو تغييرات الانبوت
    input.addEventListener('input', checkValue);
});
document.querySelectorAll('.form-control').forEach(element => {

    // تجاهل العناصر داخل .upholstery-wrapper بالكامل
    if (element.closest('.upholstery-wrapper')) return;

    // 🛑 تجاهل انبوت الصور / الملفات
    if (element.tagName.toLowerCase() === 'input' && element.type === 'file') {
        return;
    }

    // إذا كان input type number ولم يتم تحديد قيمة، اجعله 0
    if (element.tagName.toLowerCase() === 'input' && element.type === 'number' && element.value.trim() === '') {
        element.value = '0';
    }

    // إنشاء علامة ✓ للـ input و textarea فقط (ليس select)
    let check;
    if (element.tagName.toLowerCase() !== 'select') {
        check = document.createElement('span');
        check.textContent = '✓';
        check.style.position = 'absolute';
        check.style.right = '10px';
        check.style.background = '#fff';

        check.style.top = '50%';
        check.style.zIndex = '10';
        check.style.transform = 'translateY(-50%)';
        check.style.color = '#3ca200';
        check.style.fontSize = '22px';
        check.style.fontWeight = 'bold';
        check.style.textShadow = '0 0 3px rgba(0,0,0,0.3)';
        check.style.display = 'none';
        check.style.pointerEvents = 'none';
    }

    // إنشاء wrapper حول الانبوت
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.width = '100%';

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    if (check) wrapper.appendChild(check);

    const toggleCheck = () => {
        const value = element.value.trim();
        // يظهر فقط إذا القيمة ليست فارغة وليست صفر
        if (value !== '' && value !== '0') {
            if (check) check.style.display = 'block';
            element.style.borderColor = '#3ca200';
        } else {
            if (check) check.style.display = 'none';
            element.style.borderColor = '';
        }
    };

    toggleCheck();
    element.addEventListener('input', toggleCheck);
    element.addEventListener('focus', toggleCheck);
    element.addEventListener('blur', toggleCheck);
});







document.querySelectorAll('.form-select').forEach(select => {
    // تجاهل العناصر داخل .upholstery-wrapper بالكامل
    if (select.closest('.upholstery-wrapper')) return;

    // تعيين القيمة الافتراضية 0 إذا لم يتم اختيار أي خيار
    if (!select.value || select.value.trim() === '') {
        select.value = '0';
    }

    // إنشاء wrapper حول select
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-flex';
    wrapper.style.width = '100%';
    wrapper.style.boxSizing = 'border-box';

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // 🔥 إنشاء علامة ✓
    const check = document.createElement('span');
    check.textContent = '✓';
    check.style.position = 'absolute';
    check.style.right = '30px';       // 👉 العلامة يسار
    check.style.top = '50%';
            check.style.background = '#fff';

    check.style.transform = 'translateY(-50%)';
    check.style.color = '#3ca200';
    check.style.fontSize = '22px';
    check.style.fontWeight = 'bold';
    check.style.textShadow = '0 0 3px rgba(0,0,0,0.3)';
    check.style.display = 'none';
    check.style.pointerEvents = 'none';

    wrapper.appendChild(check);

    const toggleBorder = () => {
        const value = select.value.trim();

        if (value && value !== '' && value !== '0' && value !== 'select') {
            select.style.borderColor = '#3ca200';
            check.style.display = 'block'; // 👍 تظهر العلامة
        } else {
            select.style.borderColor = '';
            check.style.display = 'none'; // تخفي العلامة
        }
    };

    toggleBorder();
    select.addEventListener('change', toggleBorder);
    select.addEventListener('focus', toggleBorder);
    select.addEventListener('blur', toggleBorder);
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
                             tabName:"normal-cleaning"
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
    counterClass: ".imgCount"
});

setupFileInput({
    inputId: "formFileMultipleUpholstery",
    previewId: "previewUpholstery",
    counterClass: ".imgCountUpholstery"
});


setupFileInput({
    inputId: "formFileMultipleWindow",
    previewId: "previewWindow",
    counterClass: ".imgCountWindow"
});

setupFileInput({
    inputId: "formFileMultipleCarpet",
    previewId: "previewCarpet",
    counterClass: ".imgCountCarpet"
});
setupFileInput({
    inputId: "formFileMultipleNormal",
    previewId: "previewNormal",
    counterClass: ".imgCountNormal"
});


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
                // dateTime: document.getElementById("datetimepicker1Input")?.value || "",

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
let inputIDs = ['typeSelect', 'storeyInput','furnitureSelect']; // array من الايدهات
let normalID=['areaForNormal']
let springID=['areaForSpringCleaning']

let cleaningID=['areaForCleaning']
let messieApartmentID=['areaForMessieApatment']

let windowID=['reasonForWindowCleaning','casementForWindowCleaning','heightInputForWindowCleaning']

let carpetID=['looseCarpetForCarpet','totalAreaForCarpet','fixedCarpetForCarpet']
let addressID=['billingEmail','billingMobile','billingFirstName','billingSecondName','billingStreet','billingNo','billingZip','billingCity','billingCountry'];
let box1=['reasonForWindowCleaningOptional','casementForWindowCleaningOptional','heightInputForWindowCleaningOptional']

let box2=['looseCarpetForCarpetOptional','totalAreaForCarpetOptional','fixedCarpetForCarpetOptional']
let box4=['reasonForNormalOption','areaForNormalOption']
if(separateCheckbox.checked){
    addressID=['cleaningStreet','cleaningNo','cleaningZip','cleaningCity',...addressID];
}
if(separateContactPerson.checked){
    addressID=['contactFirstName','contactSecondName','contactCountry','contactMobile',...addressID];
}

if(data.tabName==="normal-cleaning"){
    inputIDs=[...inputIDs,...normalID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForNormal"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForNormal"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.tabName==="windows-cleaning"){
    inputIDs=[...inputIDs,...windowID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForWindowCleaning"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForWindowCleaning"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.tabName==="messie-apartment"){
    inputIDs=[...inputIDs,...messieApartmentID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForMessieApatment"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForMessieApatment"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.tabName==="cleaning"){
    inputIDs=[...inputIDs,...cleaningID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForCleaning"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForCleaning"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}

if(data.tabName==="carpet"){

    inputIDs=[...inputIDs,...carpetID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForCarpet"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForCarpet"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.tabName==="spring-cleaning"){

    inputIDs=[...inputIDs,...springID];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForSpringCleaning"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForSpringCleaning"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.tabName==="upholstery-cleaning"){

// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForUpholstery"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForUpholstery"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.optionsTabs &&data.optionsTabs.includes("box-1")){
    inputIDs=[...inputIDs,...box1];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForWindowCleaningOptional"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForWindowCleaningOptional"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.optionsTabs &&data.optionsTabs.includes("box-2")){
    inputIDs=[...inputIDs,...box2];
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForCarpetOptional"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForCarpetOptional"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.optionsTabs &&data.optionsTabs.includes("box-3")){
// جميع الراديوات ضمن المجموعة
const radios = document.querySelectorAll('input[name="contaminationForUpholsteryOptional"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForUpholsteryOptional"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}
if(data.optionsTabs &&data.optionsTabs.includes("box-4")){
    inputIDs=[...inputIDs,...box4];
const radios = document.querySelectorAll('input[name="contaminationForNormalOption"]');

// إزالة أي errors سابقة لكل واحد
radios.forEach(radio => {
    const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
    wrapper.classList.remove('error');
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
});

// التحقق إذا في أي واحد مختار
const checkedRadio = document.querySelector('input[name="contaminationForNormalOption"]:checked');

if(!checkedRadio){
    // إضافة error لكل الراديوات
    radios.forEach(radio => {
        const wrapper = radio.closest('.input-wrapper') || radio.parentElement;
        wrapper.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);
    });
} else {
    console.log('القيمة المختارة:', checkedRadio.value);
}


}

inputIDs=[...inputIDs,...addressID];
const container = document.querySelector('.container-tabs2-section');
let firstError = null;

// ... كودك مثل ما هو فوق

inputIDs.forEach(id => {
  const input = document.getElementById(id);
  const wrapper = input.parentElement;

  wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
  input.classList.remove('error');

  if (!input.value || input.value == 0 || (input.type === 'email' && !validateEmail(input.value))) {
    input.classList.add('error');

    const icon = document.createElement('span');
    icon.classList.add('error-icon');
    icon.textContent = '!';
    wrapper.appendChild(icon);

    if (!firstError) firstError = wrapper;
  }
});

// ----------------------------------------------------
//  🔽 فتح الـ Accordion لو الخطأ من normal-cleaning
// ----------------------------------------------------

if (firstError) {
    const normalIDs = [...normalID];
    const addressIDs = [...addressID];

    const errorInputID = firstError.querySelector('input, select')?.id;

    // -------- 1) فتح Normal Cleaning --------
    if (normalIDs.includes(errorInputID) || inputIDs.includes(errorInputID)) {
        const collapseOne = document.getElementById('collapseOne');
        const bsCollapse1 = new bootstrap.Collapse(collapseOne, { toggle: false });
        bsCollapse1.show();
    }

    // -------- 2) فتح Name and Address --------
    if (addressIDs.includes(errorInputID)) {
        const collapseTwo = document.getElementById('collapseTwo');
        const bsCollapse2 = new bootstrap.Collapse(collapseTwo, { toggle: false });
        bsCollapse2.show();
    }
}



// تمرير السكروول للعنصر الخطأ بشكل سلس
if (firstError) {
  smoothScroll(container, firstError, 800); // 800ms = أبطأ وأكثر سلاسة
}

// دالة التمرير السلس
function smoothScroll(container, target, duration = 600) {
  const start = container.scrollTop;
  const end = target.offsetTop - container.offsetTop;
  const change = end - start;
  let currentTime = 0;
  const increment = 20;

  function animateScroll() {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    container.scrollTop = val;
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  animateScroll();
}

// دالة easing لتسريع/تبطيء الحركة
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}



    data = { ...data, CleaningData };
    console.log("Collected Data:", data);
        }


        // =========================
        // Tempus Dominus Date Picker
        // =========================
const inputField = document.getElementById("datepicker");
const selectedDatesList = document.getElementById("selectedDatesList");

const fp = flatpickr(inputField, {
    mode: "multiple",
    dateFormat: "d/m/Y",
    maxDate: null,

    // هنا إضافة منع اختيار تاريخ قبل الغد
    minDate: new Date().fp_incr(1),

    onOpen: function(selectedDates, dateStr, instance) {
        const widget = instance.calendarContainer;

        if (!widget.querySelector('.custom-info')) {
            const textDiv = document.createElement('div');
            textDiv.textContent = 'Angaben übernehmen';
            textDiv.classList.add('custom-text');
            textDiv.style.backgroundColor = '#4b4d4c';
            textDiv.style.padding = '8px 32px';
            textDiv.style.color = 'white';
            textDiv.style.fontSize = '15px';
            textDiv.style.textAlign = 'center';
            textDiv.style.marginTop = '10px';
            textDiv.style.borderRadius = '5px';
            widget.appendChild(textDiv);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('custom-info');
            infoDiv.style.backgroundColor = '#f8d7da';
            infoDiv.style.padding = '10px';
            infoDiv.style.borderRadius = '5px';
            infoDiv.style.textAlign = 'start';
            infoDiv.style.display = 'flex';
            infoDiv.style.gap = '10px';

            const iconDiv = document.createElement('div');
            iconDiv.innerHTML = '❗';
            iconDiv.style.fontSize = '20px';
            iconDiv.style.alignSelf = 'flex-start';

            const textsDiv = document.createElement('div');
            textsDiv.style.display = 'flex';
            textsDiv.style.flexDirection = 'column';
            textsDiv.style.gap = '5px';
            textsDiv.style.alignItems = 'flex-start';

            const line1 = document.createElement('div');
            line1.textContent = 'Bitte Datum klicken für Terminauswahl (max. 3)';
            line1.style.color = '#4b4d4c';
            line1.style.fontSize = '15px';

            const line2 = document.createElement('div');
            const dot2 = document.createElement('span');
            dot2.style.display = 'inline-block';
            dot2.style.width = '10px';
            dot2.style.height = '10px';
            dot2.style.backgroundColor = 'green';
            dot2.style.borderRadius = '50%';
            dot2.style.marginRight = '6px';
            line2.appendChild(dot2);
            const text2 = document.createElement('span');
            text2.textContent = 'Samstag ohne Zuschlag';
            text2.style.color = '#4b4d4c';
            text2.style.fontSize = '15px';
            line2.appendChild(text2);

            const line3 = document.createElement('div');
            const dot3 = document.createElement('span');
            dot3.style.display = 'inline-block';
            dot3.style.width = '10px';
            dot3.style.height = '10px';
            dot3.style.backgroundColor = 'green';
            dot3.style.borderRadius = '50%';
            dot3.style.marginRight = '6px';
            line3.appendChild(dot3);
            const text3 = document.createElement('span');
            text3.textContent = 'Sonn- u. Feiertag 100% Zuschlag';
            text3.style.color = '#4b4d4c';
            text3.style.fontSize = '15px';
            line3.appendChild(text3);

            textsDiv.appendChild(line1);
            textsDiv.appendChild(line2);
            textsDiv.appendChild(line3);

            infoDiv.appendChild(iconDiv);
            infoDiv.appendChild(textsDiv);

            widget.appendChild(infoDiv);
        }
    },

    onChange: function(selectedDates) {
        if (selectedDates.length > 3) {
            alert("يمكنك اختيار حتى 3 تواريخ فقط");
            selectedDates.pop();
            fp.setDate(selectedDates, true);
        }

        if (selectedDates.length === 3) {
            fp.set('disable', [
                function(date) {
                    return !selectedDates.some(d => d.getTime() === date.getTime());
                }
            ]);
        } else {
            fp.set('disable', []);
        }

        renderSelectedDates(selectedDates);
    }
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

        const tabId = this.dataset.tab;

        // التحقق إذا كان التاب الحالي هو نفسه المفعل
        const activeTab = document.querySelector('.tab-section:not([style*="display: none"])');
        if (activeTab && activeTab.dataset.tab === tabId) {
            return; // إيقاف تنفيذ الفانكشن إذا نفس التاب
        }

        const loading = document.querySelector('.loading');
        if (loading) loading.style.display = 'flex';

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
const firstItem = document.querySelector('.accordion-item:nth-child(1)');
if (firstItem) {
    const btn = firstItem.querySelector('.accordion-button');
    const body = firstItem.querySelector('.accordion-collapse');

    btn.classList.remove('collapsed');
    body.classList.add('show');
}

// فتح العنصر السادس accordion-item بالقوة (العنصر 6)
const sixthItem = document.querySelector('.accordion-item:nth-child(4)')
console.log(sixthItem);
;
if (sixthItem) {
    const btn = sixthItem.querySelector('.accordion-button');
    const body = sixthItem.querySelector('.accordion-collapse');

    btn.classList.remove('collapsed');
    body.classList.add('show');
}

 document.querySelectorAll('input, select').forEach(el => {
            el.classList.remove('error');
        });

        document.querySelectorAll('.error-icon').forEach(icon => icon.remove());

        // إخفاء كل التابات
        document.querySelectorAll('.tab-section').forEach(div => {
            div.style.display = 'none';
        });

        // إعادة تفعيل كل الخيارات في select
        const select = document.getElementById('which');
        if (select) {
            select.querySelectorAll('option').forEach(opt => opt.disabled = false);
            select.value = '';
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
        data = { ...data,tabName:tabId, CleaningData: {} };

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
console.log('here2');

    const val = this.getAttribute('data-value') || this.dataset.value;
    const box = document.getElementById(val);
    console.log(val,'box');
    data={...data,optionsTabs:data.optionsTabs?[...data.optionsTabs,val]:[val]};

    if (!box) return;

    // فتح الصندوق لو مخفي
    if (box.classList.contains('hidden')) {
        box.classList.remove('hidden');
        this.classList.add('disabled');
        this.style.pointerEvents = "none";

        const select = document.getElementById('which');
        if (select) {
            const opt = select.querySelector(`option[value="${val}"]`);
            if (opt) opt.disabled = true;
            select.value = '';
        }

        if (typeof dropdownBtn !== 'undefined' && dropdownBtn) {
            dropdownBtn.textContent = "+";
        }
    }

    // فتح الـ accordion باستخدام Bootstrap Collapse
    const accordionEl = box.querySelector('.accordion-collapse');
    if (accordionEl) {
        const bsCollapse = new bootstrap.Collapse(accordionEl, { toggle: true });

        // استمع لحدث انتهاء الفتح
        accordionEl.addEventListener('shown.bs.collapse', function () {
            const container = document.querySelector('.container-tabs2-section');
            if (container) {
                // تحريك السكروول ليظهر رأس الـ accordion
                const top = accordionEl.offsetTop - container.offsetTop;
                container.scrollTo({ top: top, behavior: 'smooth' });
            } else {
                accordionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, { once: true }); // once:true حتى يعمل مرة واحدة فقط
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

