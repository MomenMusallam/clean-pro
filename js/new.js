const confirmRadio = document.getElementById('confirmForm');
const confirmLabel = document.getElementById('confirmFormLabel');

// إضافة حدث عند الضغط على الـradio
confirmRadio.addEventListener('click', () => {
    confirmLabel.style.color = 'black';
                confirmRadio.style.border = "1px solid #dee2e6";

});
function setupRadioSelection(radioName) {
    const radios = document.getElementsByName(radioName);

    radios.forEach(radio => {
        radio.addEventListener('click', () => {
            // إزالة أي class error أو selected من كل الـ labels
            radios.forEach(r => {
                r.parentElement.classList.remove('selected', 'error');
            });

            // إضافة class selected للـ label اللي اختاره المستخدم
            radio.parentElement.classList.add('selected');
        });
    });
}
setupRadioSelection('contaminationForNormal');
setupRadioSelection('contaminationForWindowCleaning');
setupRadioSelection('contaminationForCarpet');
setupRadioSelection('contaminationForSpringCleaning');
setupRadioSelection('contaminationForCleaning');
setupRadioSelection('contaminationForMessieApatment');
setupRadioSelection('contaminationForUpholstery');
setupRadioSelection('contaminationForWindowCleaningOptional');
setupRadioSelection('contaminationForCarpetOptional');
setupRadioSelection('contaminationForUpholsteryOptional');
setupRadioSelection('contaminationForNormalOption');

document.querySelectorAll('input[type="number"].upholstery-input')
  .forEach(input => {
    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val < 0) {
        input.value = '';       // تمسح القيمة السالبة
        // أو مثلاً: input.value = 0;
      }
    });
  });
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
// فحص وجود .com داخل الإيميل


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
check.className='checkInput'

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

    // فحص صحة الإيميل حسب HTML5
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
    if (element.type === 'email' && !element.checkValidity()) {
        if (check) check.style.display = 'none';
        element.style.borderColor = '';
        return;
    }

    // يجب أن ينتهي بـ .com تحديداً
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    if (element.type === 'email' && !value.toLowerCase().endsWith('.com')) {
        if (check) check.style.display = 'none';
        element.style.borderColor = '';
        return;
    }

    // باقي الأنواع
    if (value !== '' && value !== '0') {
        if (check) check.style.display = 'block';
        element.classList.remove('error');
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
check.className='checkInput'
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
                        select.classList.remove('error');

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
let defultinputIDs = ['typeSelect', 'storeyInput','furnitureSelect']; // array من الايدهات
let normalID=['areaForNormal','reasonForNormal']
let springID=['areaForSpringCleaning']

let cleaningID=['areaForCleaning']
let messieApartmentID=['areaForMessieApatment']

let windowID=['reasonForWindowCleaning','casementForWindowCleaning','heightInputForWindowCleaning']

let carpetID=['looseCarpetForCarpet','totalAreaForCarpet','fixedCarpetForCarpet']
let addressID=['billingEmail','billingMobile','billingFirstName','billingSecondName','billingStreet','billingNo','billingZip','billingCity','billingCountry','billingSalutation'];
let box1=['reasonForWindowCleaningOptional','casementForWindowCleaningOptional','heightInputForWindowCleaningOptional']

let box2=['looseCarpetForCarpetOptional','totalAreaForCarpetOptional','fixedCarpetForCarpetOptional']
let box4=['reasonForNormalOption','areaForNormalOption']
if(separateCheckbox.checked){
    addressID=['cleaningStreet','cleaningNo','cleaningZip','cleaningCity',...addressID];
}
if(separateContactPerson.checked){
    addressID=['contactFirstName','contactSecondName','contactCountry','contactMobile','contactSalutation',...addressID];
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

  if (!input.value || input.value == 0 || (input.type === 'email'&& !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))) {
    input.classList.add('error');

    const icon = document.createElement('span');
    icon.classList.add('error-icon');
    icon.textContent = '!';
    wrapper.appendChild(icon);

    if (!firstError) firstError = wrapper;
  }
});
// 🔹 هنا بعد التحقق من الحقول العادية، نضيف التحقق من البريد الإلكتروني
const emailInputs = ['contactEmail'];
emailInputs.forEach(id => {
    const input = document.getElementById(id);
    const wrapper = input.parentElement;

    // إزالة أي أخطاء سابقة
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
    input.classList.remove('error');

    if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');

        const icon = document.createElement('span');
        icon.classList.add('error-icon');
        icon.textContent = '!';
        wrapper.appendChild(icon);

        if (!firstError) firstError = wrapper;
    }
});
const emailInput = ['billingEmail'];
emailInput.forEach(id => {
    const input = document.getElementById(id);
    const wrapper = input.parentElement;

    // إزالة أي أخطاء سابقة
    wrapper.querySelectorAll('.error-icon').forEach(el => el.remove());
    input.classList.remove('error');

    if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
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
 let   confirm= document.querySelector('input[name="confirmForm"]:checked')
     let    confirmId= document.getElementById("confirmForm")

            if(!confirm){

            confirmId.style.border = "1px solid red";
            confirmFormLabel.style.color = "red";

            }else{
                            confirmId.style.border = "1px solid green";

            }
            console.log(firstError,confirm);

if (firstError) {
    const normalIDs = [...normalID];
    const addressIDs = [...addressID];

        const box1IDS = [...box1];
        const box2IDS = [...box2];
        const box4IDS = [...box4];

    const errorInputID = firstError.querySelector('input, select')?.id;
console.log(errorInputID);

    // -------- 1) فتح Normal Cleaning --------
    if (normalIDs.includes(errorInputID)||defultinputIDs.includes(errorInputID) ) {

        const collapseOne = document.getElementById('collapseOne');
        const bsCollapse1 = new bootstrap.Collapse(collapseOne, { toggle: false });
        bsCollapse1.show();
    }


  if (box1IDS.includes(errorInputID) ) {
        const collapseThree = document.getElementById('collapseThree');
        const bsCollapse3 = new bootstrap.Collapse(collapseThree, { toggle: false });
        bsCollapse3.show();
    }
    if (box2IDS.includes(errorInputID) ) {
        const collapseFour = document.getElementById('collapseFour');
        const bsCollapse4 = new bootstrap.Collapse(collapseFour, { toggle: false });
        bsCollapse4.show();
    }
    if (box4IDS.includes(errorInputID) ) {
        const collapseSix = document.getElementById('collapseSix');
        const bsCollapse5 = new bootstrap.Collapse(collapseSix, { toggle: false });
        bsCollapse5.show();
    }

    // -------- 2) فتح Name and Address --------
    if (addressIDs.includes(errorInputID)) {
        const collapseTwo = document.getElementById('collapseTwo');
        const bsCollapse2 = new bootstrap.Collapse(collapseTwo, { toggle: false });
        bsCollapse2.show();
    }
}  else if(confirm)   {

    let defultData={
        terms_accepted:confirm?1:0,
        location_type_id:document.getElementById("typeSelect")?.value ,
        floor_id:document.getElementById("storeyInput")?.value ,
        location_status_id:document.getElementById("furnitureSelect")?.value ,
preferred_date:data.dates,
email:document.getElementById("billingEmail")?.value,
phone:document.getElementById("billingMobile")?.value,
company:document.getElementById("billingCompany")?.value,
gender:document.getElementById("billingCountry")?.value,
honorific_title:document.getElementById("billingSalutation")?.value,
first_name:document.getElementById("billingFirstName")?.value,
last_name:document.getElementById("billingSecondName")?.value,
street:document.getElementById("billingStreet")?.value,
street_number:document.getElementById("billingNo")?.value,
zip_code:document.getElementById("billingZip")?.value,
city:document.getElementById("billingCity")?.value,
separate_company:document.getElementById("cleaningCompany")?.value,
separate_street:document.getElementById("cleaningStreet")?.value,
separate_street_number:document.getElementById("cleaningNo")?.value,
separate_zip_code:document.getElementById("cleaningZip")?.value,
separate_city:document.getElementById("cleaningCity")?.value,
separate_gender:document.getElementById("contactCountry")?.value,
separate_honorific_title:document.getElementById("contactSalutation")?.value,
separate_first_name:document.getElementById("contactFirstName")?.value,
separate_last_name:document.getElementById("contactSecondName")?.value,
separate_email:document.getElementById("contactEmail")?.value,
separate_phone:document.getElementById("contactMobile")?.value,
separate_additional_names:document.getElementById("contactNote")?.value,
is_separate_address:separateCheckbox.checked?1:0
,
is_separate_contact:separateContactPerson.checked?1:0
   }
   let dataObj={
    normal:{

  area: document.getElementById("areaForNormal")?.value || "",
        reason_for_cleaning_id: document.getElementById("reasonForNormal")?.value || "",
        additional_info: document.getElementById("infoTextarea")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForNormal"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForNormal"]:checked')?.value || "",

        images: Array.from(document.getElementById("formFileMultiple")?.files || []),


    },
    windows:{
                images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",
           reason_for_cleaning_id: document.getElementById("reasonForWindowCleaning")?.value || "",
        max_room_height: document.getElementById("heightInputForWindowCleaning")?.value || "",
        window_sash: document.getElementById("casementForWindowCleaning")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForWindowCleaning"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForWindowCleaning"]:checked')?.value || "",


    },
    carpet:{
        images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",
          carpets: document.getElementById("looseCarpetForCarpet")?.value || "",
        area: document.getElementById("totalAreaForCarpet")?.value || "",
        fixed_carpet: document.getElementById("fixedCarpetForCarpet")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForCarpet"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForCarpet"]:checked')?.value || "",

    },
    upholstery:{
        images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",
        furnitures: upholstery,
        degree_of_contamination_id: document.querySelector('input[name="contaminationForUpholstery"]:checked')?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForUpholstery"]:checked')).map(e => e.value),

    }
    ,
    spring:{
         images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",

        area: document.getElementById("areaForSpringCleaning")?.value || "",
        reason_for_cleaning_id: document.getElementById("reasonForSpringCleaning")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForSpringCleaning"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForSpringCleaning"]:checked')?.value || "",

    },
    cleaning:{
           images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",

        area: document.getElementById("areaForCleaning")?.value || "",
        reason_for_cleaning_id: document.getElementById("reasonForCleaning")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForCleaning"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForCleaning"]:checked')?.value || "",

    },
    messieApartment:{
            images: Array.from(document.getElementById("formFileMultiple")?.files || []),
        additional_info: document.getElementById("infoTextarea")?.value || "",
        area: document.getElementById("areaForMessieApatment")?.value || "",
        reason_for_cleaning_id: document.getElementById("reasonForMessieApatment")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForMessieApatment"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForMessieApatment"]:checked')?.value || "",

    },
    box1:{
            images: Array.from(document.getElementById("formFileMultipleWindow")?.files || []),
        additional_info: document.getElementById("infoTextareaWindow")?.value || "",

         reason_for_cleaning_id: document.getElementById("reasonForWindowCleaningOptional")?.value || "",
        max_room_height: document.getElementById("heightInputForWindowCleaningOptional")?.value || "",
        window_sash: document.getElementById("casementForWindowCleaningOptional")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForWindowCleaningOptional"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForWindowCleaningOptional"]:checked')?.value || "",

    },
    box2:{
              images: Array.from(document.getElementById("formFileMultipleCarpet")?.files || []),
        additional_info: document.getElementById("infoTextareaCarpet")?.value || "",
       carpets: document.getElementById("looseCarpetForCarpetOptional")?.value || "",
        area: document.getElementById("totalAreaForCarpetOptional")?.value || "",
        fixed_carpet: document.getElementById("fixedCarpetForCarpetOptional")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForCarpetOptional"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForCarpetOptional"]:checked')?.value || "",

    }
    ,
    box3:{

              images: Array.from(document.getElementById("formFileMultipleUpholstery")?.files || []),
        additional_info: document.getElementById("infoTextareaUpholstery")?.value || "",
      degree_of_contamination_id: document.querySelector('input[name="contaminationForUpholsteryOptional"]:checked')?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForUpholsteryOptional"]:checked')).map(e => e.value),
               furnitures: upholsteryOptional,

    },
    box4:{
              images: Array.from(document.getElementById("formFileMultipleUpholstery")?.files || []),
        additional_info: document.getElementById("infoTextareaUpholstery")?.value || "",

        area: document.getElementById("areaForNormalOption")?.value || "",
        reason_for_cleaning_id: document.getElementById("reasonForNormalOption")?.value || "",
        cleaning_requests_ids: Array.from(document.querySelectorAll('input[name="requestsForNormalOption"]:checked')).map(e => e.value),
        degree_of_contamination_id: document.querySelector('input[name="contaminationForNormalOption"]:checked')?.value || "",
    }
   }

   let fatchData={}
if(data.tabName==='normal-cleaning'){
    fatchData={
        ...defultData,services_requested:[dataObj.normal]
    }
}else if(data.tabName==='windows-cleaning'){
    fatchData={
        ...defultData,services_requested:[dataObj.windows]
    }
}if(data.tabName==="carpet"){
    fatchData={
        ...defultData,services_requested:[dataObj.carpet]
    }
}if(data.tabName==='upholstery-cleaning'){
    fatchData={
        ...defultData,services_requested:[dataObj.upholstery]
    }
}if(data.tabName==='spring-cleaning'){
    fatchData={
        ...defultData,services_requested:[dataObj.spring]
    }
}if(data.tabName==="cleaning"){
    fatchData={
        ...defultData,services_requested:[dataObj.cleaning]
    }
}if(data.tabName==='messie-apartment'){
    fatchData={
        ...defultData,services_requested:[dataObj.messieApartment]
    }
}
console.log(data.optionsTabs,'data');

if(data.optionsTabs&&data.optionsTabs.includes('box-1')){
     fatchData={
        ...defultData,services_requested:[...fatchData.services_requested, dataObj.box1]
    }
}
if(data.optionsTabs&&data.optionsTabs.includes('box-2')){
     fatchData={
        ...defultData,services_requested:[...fatchData.services_requested, dataObj.box2]
    }
}
if(data.optionsTabs&&data.optionsTabs.includes('box-3')){
     fatchData={
        ...defultData,services_requested:[...fatchData.services_requested, dataObj.box3]
    }
}
if(data.optionsTabs&&data.optionsTabs.includes('box-4')){
     fatchData={
        ...defultData,services_requested:[...fatchData.services_requested, dataObj.box4]
    }
}
 const tabId = data.tabName;

        // التحقق إذا كان التاب الحالي هو نفسه المفعل


        const loading = document.querySelector('.submit-spiner');
        const notLoading = document.querySelector('.submit-icon');
        const btn = document.querySelector('#SubmitForm');
        if (loading) loading.style.display = 'block';
        if (notLoading) notLoading.style.display = 'none';
    btn.classList.add('disabled');

        // ===============================
        // 🔥 تغيير نص الـ accordion حسب اسم التاب
        // ===============================
                 console.log(loading,'loading');


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
        document.querySelectorAll('input, select, textarea')
            .forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                 document.querySelectorAll('.checkInput').forEach(el => {
            el.style.display='none';
        });
            input.style.borderColor = '#dee2e6';

                    input.value = '';
                }
            });
setTimeout(() => {

             loading.style.display = 'none';
             notLoading.style.display = 'block';
                         btn.classList.remove('disabled');


}, 1000);
console.log(fatchData);

}



// تمرير السكروول للعنصر الخطأ بشكل سلس
if (firstError) {
    console.log(firstError,'hoho');

  smoothScroll(container, firstError, 800); // 800ms = أبطأ وأكثر سلاسة
}

// دالة التمرير السلس
function smoothScroll(container, target, duration = 600) {
    const start = container.scrollTop;
    const targetPosition =
        target.getBoundingClientRect().top - container.getBoundingClientRect().top;

    const change = targetPosition;
    let currentTime = 0;

    function animateScroll() {
        currentTime += 16; // نفس frame rate تبع requestAnimationFrame

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



        }




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

        }, 500);
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
 // فتح الـ accordion باستخدام Bootstrap Collapse
const accordionEl = box.querySelector('.accordion-collapse');

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
        accordionEl.removeEventListener('shown.bs.collapse', accordionEl._shownHandler);
    }
function smoothScrollSlow(container, target, duration = 1000) { // 300ms حركة سريعة
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
    const container = document.querySelector('.container-tabs2-section');

    if (container) {
        const top = accordionEl.offsetTop - container.offsetTop;
        // تأخير 1 ثانية قبل البدء بالحركة
        setTimeout(() => {
            smoothScrollSlow(container, accordionEl, 800); // 2000ms = مدة الحركة
        }, 50);
    } else {
        setTimeout(() => {
            accordionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
};


    // اربط الحدث
    accordionEl.addEventListener('shown.bs.collapse', accordionEl._shownHandler);

    // ✨ تأخير بسيط حتى يرتبط الحدث ثم افتح الـ accordion
    setTimeout(() => {
        bsCollapse.show();
    }, 500);
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
  const accordionEl = box.querySelector('.accordion-collapse');
    if (accordionEl && accordionEl._bsInstance) {
        accordionEl._bsInstance.hide();  // ← يغلق collapse فعليًا
    }
    // إخفاء الصندوق
    box.classList.add('hidden');

    // إعادة تفعيل الخيا في المنيو
    const option = document.querySelector(`.dropdown-item[data-value="${box.id}"]`);
    if (option) {
        option.classList.remove('disabled');
        option.style.pointerEvents = "auto";
        console.log(box.id,'box.idbox.id');

        data={...data,optionsTabs:data.optionsTabs?data.optionsTabs.filter(item=>item!==box.id):[]};
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

