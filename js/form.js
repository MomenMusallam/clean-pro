import { FormConfig } from "./modules/config.js";
import { FormValidator, initializeValidation } from "./modules/validation.js";
import { dataCollector } from "./modules/dataCollector.js";
import { uiManager } from "./modules/uiManager.js";
import { initializeImageUploads } from "./modules/imageUpload.js";
import { submitFormData } from "./modules/api.js";
import utils, {
    toggleLoadingState,
    resetFormFields,
    smoothScroll,
} from "./modules/utils.js";

/**
 * Main Form Application Class
 */
class CleaningFormApp {
    constructor() {
        this.initialized = false;
        this.validator = new FormValidator();
        this.currentTab = "normal-cleaning";
        this.upholsteryItems = [];
        this.selectedDates = [];
        this.optionalServices = []; // Active optional service boxes
        this.isSubmitting = false;

        // Define which optional services are available for each main service
        this.availableOptionalsByService = {
            "normal-cleaning": ["box-1", "box-2", "box-3"], // window, carpet, upholstery
            "windows-cleaning": ["box-4", "box-2", "box-3"], // normal, carpet, upholstery
            carpet: ["box-4", "box-1", "box-3"], // normal, window, upholstery
            "upholstery-cleaning": ["box-4", "box-1", "box-2"], // normal, window, carpet
            "spring-cleaning": ["box-1", "box-2", "box-3"], // window, carpet, upholstery
            cleaning: ["box-1", "box-2", "box-3"], // window, carpet, upholstery (end cleaning)
            "messie-apartment": ["box-1", "box-2", "box-3"], // window, carpet, upholstery
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        try {
            await this.waitForDOM();
            console.log("CleaningFormApp: Starting initialization...");

            await this.initializeCoreModules();
            await this.setupUIComponents();
            await this.setupFormFunctionality();
            await this.setupEventListeners();

            this.finishInitialization();

            console.log("CleaningFormApp: Initialization complete ✅");
        } catch (error) {
            console.error("CleaningFormApp: Initialization failed", error);
            this.showErrorMessage(
                "Failed to initialize form. Please refresh the page."
            );
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeCoreModules() {
        uiManager.initialize();
        initializeValidation();
        initializeImageUploads();
    }

    async setupUIComponents() {
        await this.setupDatePicker();
        this.setupPhoneInputs();
        this.setupTabNavigation();
        this.setupAccordions();
        this.setupOptionalServices();
    }

    async setupFormFunctionality() {
        this.setupUpholsteryCounters();
        this.setupAddressToggles();
        // this.setupInputValidation();
    }

    async setupEventListeners() {
        const submitBtn = document.getElementById("SubmitForm");
        if (submitBtn) {
            submitBtn.addEventListener("click", this.handleSubmit);
        }

        document.querySelectorAll("button[data-tab]").forEach((button) => {
            button.addEventListener("click", this.handleTabSwitch);
        });

        const termsCheckbox = document.getElementById("confirmForm");
        if (termsCheckbox) {
            termsCheckbox.addEventListener(
                "change",
                this.handleTermsChange.bind(this)
            );
        }

        // Setup radio button handling
        this.setupRadioButtons();
    }

    /**
     * Setup radio button click handling for all radio groups
     */
    setupRadioButtons() {
        document.addEventListener("click", (e) => {
            // Check if clicked element is a radio input or its parent label/card
            const radioInput =
                e.target.type === "radio"
                    ? e.target
                    : e.target
                          .closest(".card-label")
                          ?.querySelector('input[type="radio"]');

            if (radioInput && radioInput.type === "radio") {
                // Remove selected class from all cards in the same group
                console.log('ffffffffffffffffff')
                document
                    .querySelectorAll(`input[name=\"${radioInput.name}\"]`)
                    .forEach((radio) => {
                        const label = radio.closest(".card-label");
                        if (label) {
                            label.classList.remove("selected");
                            const card = label.querySelector(".card");
                            if (card) {
                                card.style.borderColor = "";
                                card.style.backgroundColor = "";
                            }
                        }
                    });

                // Check the radio and add selected class
                radioInput.checked = true;
                const parentLabel = radioInput.closest(".card-label");
                if (parentLabel) {
                    parentLabel.classList.add("selected");
                    const card = parentLabel.querySelector(".card");
                    if (card) {
                        card.style.borderColor = "#198754";
                        card.style.backgroundColor = "#e9e9e9";
                    }
                }

                // Remove error state
                document
                    .querySelectorAll(`input[name=\"${radioInput.name}\"]`)
                    .forEach((radio) => {
                        radio.parentElement?.classList.remove("is-invalid");
                    });

                // Trigger change event
                radioInput.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }
        });
    }

    /**
     * Setup date picker
     */
    async setupDatePicker() {
        const inputField = document.getElementById("datepicker");
        const selectedDatesList = document.getElementById("selectedDatesList");

        if (!inputField || typeof flatpickr === "undefined") {
            console.warn("Date picker not available");
            return;
        }

        const preferredDateLimit = FormConfig.calendar.preferredDateLimit || 3;
        const calendarNote = FormConfig.calendar.note || "";

        const renderSelectedDates = (dates) => {
            if (!selectedDatesList) return;

            selectedDatesList.innerHTML = "";
            dates.forEach((d, index) => {
                const div = document.createElement("div");
                div.className = "selected-date-item";
                div.style.cssText = `
                    display: inline-block;
                    margin: 5px;
                    padding: 5px 10px;
                    background: #3ca200;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                `;
                div.textContent = d.toLocaleDateString("en-GB") + " ✕";
                div.dataset.index = index;

                div.addEventListener("click", () => {
                    const newDates =
                        this.flatpickrInstance.selectedDates.filter(
                            (_, i) => i !== index
                        );
                    this.flatpickrInstance.setDate(newDates, true);
                    renderSelectedDates(newDates);

                    if (newDates.length < preferredDateLimit) {
                        this.flatpickrInstance.set("disable", []);
                    }
                });

                selectedDatesList.appendChild(div);
            });
        };

        this.flatpickrInstance = flatpickr(inputField, {
            mode: "multiple",
            dateFormat: "d/m/Y",
            maxDate: null,
            minDate: new Date().fp_incr(1),

            onOpen: function (selectedDates, dateStr, instance) {
                const widget = instance.calendarContainer;

                if (
                    !widget.querySelector(".custom-info") &&
                    calendarNote !== ""
                ) {
                    const infoDiv = document.createElement("div");
                    infoDiv.classList.add("custom-info");
                    infoDiv.style.cssText = `
                        background-color: #f8d7da;
                        padding: 10px;
                        border-radius: 5px;
                        text-align: start;
                        display: flex;
                        gap: 10px;
                    `;

                    const textsDiv = document.createElement("div");
                    textsDiv.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        align-items: flex-start;
                    `;

                    const line1 = document.createElement("div");
                    line1.innerHTML = calendarNote;
                    textsDiv.appendChild(line1);

                    infoDiv.appendChild(textsDiv);
                    widget.appendChild(infoDiv);
                }
            },

            onChange: (selectedDates) => {
                if (selectedDates.length > preferredDateLimit) {
                    alert(
                        `You can select up to ${preferredDateLimit} dates only`
                    );
                    selectedDates.pop();
                    this.flatpickrInstance.setDate(selectedDates, true);
                }

                if (selectedDates.length === preferredDateLimit) {
                    this.flatpickrInstance.set("disable", [
                        function (date) {
                            return !selectedDates.some(
                                (d) => d.getTime() === date.getTime()
                            );
                        },
                    ]);
                } else {
                    this.flatpickrInstance.set("disable", []);
                }

                renderSelectedDates(selectedDates);
                this.selectedDates = selectedDates;
                console.log("Selected dates:", this.selectedDates);
            },
        });
    }

    setupPhoneInputs() {
        if (typeof intlTelInput === "undefined") return;

        ["billingMobile", "contactMobile"].forEach((inputId) => {
            const input = document.getElementById(inputId);
            if (input) {
                input._iti = intlTelInput(input, {
                    initialCountry: "de",
                    preferredCountries: ["de", "at", "ch"],
                    utilsScript:
                        "https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js",
                });
            }
        });
    }

    setupTabNavigation() {
        this.setActiveTab(this.currentTab);
    }

    /**
     * FIX: Handle tab switching - CLEARS OPTIONAL SERVICES
     */
    handleTabSwitch(event) {
        event.preventDefault();

        const button = event.currentTarget;
        const newTab = button.dataset.tab;

        if (newTab === this.currentTab) return;

        console.log(`Switching from ${this.currentTab} to ${newTab}`);
        utils.smoothScroll(
            document.querySelector(".container-tabs2-section"),
            document.getElementById("bookingForm")
        );
        // loading gif
        // const loadingGif = document.querySelector(".loading");
        // if (loadingGif) {
        //     loadingGif.style.display = "flex";
        // }
        // setTimeout(() => {
        //     loadingGif.style.display = "none"
        // }, 800);

        // Clear validation errors
        this.validator.clearErrors();

        // FIX: Clear all optional services when switching tabs
        this.clearAllOptionalServices();

        // Switch to new tab
        this.setActiveTab(newTab);
        this.currentTab = newTab;

        // Update accordion title
        const accordionTitle = document.getElementById("accordionTitle");
        if (accordionTitle) {
            const serviceName =
                button.querySelector("span")?.textContent || newTab;
            accordionTitle.textContent = serviceName;
        }
    }

    /**
     * FIX: Clear all optional services
     */
    clearAllOptionalServices() {
        console.log("Clearing all optional services...");

        // Hide all boxes and clear their fields
        document.querySelectorAll("#boxes .box").forEach((box) => {
            box.classList.add("hidden");

            // Clear all fields in the box
            box.querySelectorAll("input, select, textarea").forEach((field) => {
                if (field.type === "checkbox" || field.type === "radio") {
                    field.checked = false;
                } else if (field.type !== "file") {
                    field.value = field.tagName === "SELECT" ? "0" : "";
                }

                // Remove visual states
                field.classList.remove("is-invalid");
                field.classList.remove("is-valid");
                field.style.borderColor = "";
            });

            // Clear file previews
            const previewContainer = box.querySelector('[id^="preview"]');
            if (previewContainer) {
                previewContainer.innerHTML = "";
            }

            // Reset file counters
            const counter = box.querySelector('[class*="imgCount"]');
            if (counter) {
                counter.textContent = "0/5";
            }
        });

        // Re-enable ALL dropdown items
        document
            .querySelectorAll(".dropdown-item[data-value]")
            .forEach((item) => {
                item.classList.remove("disabled");
                item.style.pointerEvents = "auto";
                item.style.display = "block";
            });

        // Clear optional services array
        this.optionalServices = [];

        // Clear upholstery items if any
        this.upholsteryItems = [];

        console.log("All optional services cleared");
    }

    setActiveTab(tabName) {
        // Update buttons
        document.querySelectorAll("[data-tab]").forEach((btn) => {
            btn.classList.remove("active");
        });

        const activeButton = document.querySelector(
            `[data-tab=\"${tabName}\"]`
        );
        if (activeButton) {
            activeButton.classList.add("active");
        }

        // Show/hide tab content
        document.querySelectorAll(".tab-section").forEach((section) => {
            section.style.display = "none";
        });

        const activeSection = document.querySelector(
            `.tab-section[data-tab=\"${tabName}\"]`
        );
        if (activeSection) {
            activeSection.style.display = "block";
        }

        // Update available optional services
        this.updateAvailableOptionalServices(tabName);
    }

    /**
     * Update which optional services can be added based on main service
     */
    updateAvailableOptionalServices(mainService) {
        const availableBoxes =
            this.availableOptionalsByService[mainService] || [];

        // Update dropdown items visibility
        document
            .querySelectorAll(".dropdown-item[data-value]")
            .forEach((item) => {
                const boxId = item.dataset.value;

                // Show only if it's in available list for current service
                if (availableBoxes.includes(boxId)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
    }

    setupUpholsteryCounters() {
        document.addEventListener("click", (e) => {
            if (e.target.matches(".btn-plus, .btn-minus")) {
                // this.handleCounterClick(e.target);
            }
        });

        document.addEventListener("input", (e) => {
            if (
                e.target.matches(
                    ".upholstery-input, .upholstery-input-optional"
                )
            ) {
                this.handleUpholsteryInput(e.target);
            }
        });
    }

    handleCounterClick(button) {
        const isPlus = button.classList.contains("btn-plus");
        const counterBox = button.closest(".counter-box");
        const input = counterBox?.querySelector('input[type="number"]');

        if (!input) return;

        const currentValue = parseInt(input.value) || 0;
        const newValue = isPlus
            ? currentValue + 1
            : Math.max(0, currentValue - 1);

        input.value = newValue;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    handleUpholsteryInput(input) {
        const furnitureId = input.id;
        const value = Math.max(0, parseInt(input.value) || 0);

        this.updateUpholsteryItems(furnitureId, value);
    }

    updateUpholsteryItems(furnitureId, value) {
        this.upholsteryItems = this.upholsteryItems.filter(
            (item) => item.furniture_type_id !== furnitureId
        );

        if (value > 0) {
            this.upholsteryItems.push({
                furniture_type_id: furnitureId,
                furniture_num: value,
            });
        }
    }

    setupAddressToggles() {
        const cleaningAddressCheckbox = document.getElementById(
            "separateCleaningAddress"
        );
        const cleaningAddressSection =
            document.querySelector(".ceaning-address");

        if (cleaningAddressCheckbox && cleaningAddressSection) {
            cleaningAddressSection.style.display = "none";

            cleaningAddressCheckbox.addEventListener("change", (e) => {
                cleaningAddressSection.style.display = e.target.checked
                    ? "block"
                    : "none";
                if (!e.target.checked) {
                    cleaningAddressSection
                        .querySelectorAll("input")
                        .forEach((input) => {
                            input.value = "";
                            input.classList.remove("is-invalid");
                            input.style.borderColor = "";
                        });
                }
            });
        }

        const contactPersonCheckbox = document.getElementById(
            "separateContactPerson"
        );
        const contactPersonSection = document.querySelector(".contact-person");

        if (contactPersonCheckbox && contactPersonSection) {
            contactPersonSection.style.display = "none";

            contactPersonCheckbox.addEventListener("change", (e) => {
                contactPersonSection.style.display = e.target.checked
                    ? "block"
                    : "none";
                if (!e.target.checked) {
                    contactPersonSection
                        .querySelectorAll("input, select, textarea")
                        .forEach((field) => {
                            if (
                                field.type === "checkbox" ||
                                field.type === "radio"
                            ) {
                                field.checked = false;
                            } else {
                                field.value =
                                    field.tagName === "SELECT" ? "0" : "";
                            }
                            field.classList.remove("is-invalid");
                            field.style.borderColor = "";
                        });
                }
            });
        }
    }

    setupAccordions() {
        ["collapseOne", "collapseTwo"].forEach((id) => {
            const accordion = document.getElementById(id);
            if (accordion && typeof bootstrap !== "undefined") {
                new bootstrap.Collapse(accordion, { toggle: false }).show();
            }
        });
    }

    setupOptionalServices() {
        const dropdownItems = document.querySelectorAll(
            ".dropdown-item[data-value]"
        );
        const boxesContainer = document.getElementById("boxes");

        if (!boxesContainer) return;

        dropdownItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.addOptionalService(item.dataset.value);
            });
        });

        boxesContainer.addEventListener("click", (e) => {
            const removeBtn = e.target.closest(".btn-remove, .btn-remove-svg");
            if (removeBtn) {
                const box = removeBtn.closest('[id^="box-"]');
                if (box) {
                    this.removeOptionalService(box.id);
                }
            }
        });
    }

    addOptionalService(serviceId) {
        const box = document.getElementById(serviceId);
        const dropdownItem = document.querySelector(
            `.dropdown-item[data-value=\"${serviceId}\"]`
        );

        if (!box || !dropdownItem) return;

        box.classList.remove("hidden");
        dropdownItem.classList.add("disable");

        if (!this.optionalServices.includes(serviceId)) {
            this.optionalServices.push(serviceId);
        }

        const accordion = box.querySelector(".accordion-collapse");
        if (accordion && typeof bootstrap !== "undefined") {
            setTimeout(() => {
                new bootstrap.Collapse(accordion, { toggle: false }).show();
            }, 100);
        }

        console.log("Added optional service:", serviceId);
    }

    removeOptionalService(serviceId) {
        const box = document.getElementById(serviceId);

        if (!box) return;

        box.classList.add("hidden");

        // Re-check if this service should be available for current tab
        const availableBoxes =
            this.availableOptionalsByService[this.currentTab] || [];
        if (availableBoxes.includes(serviceId)) {
            const dropdownItem = document.querySelector(
                `.dropdown-item[data-value=\"${serviceId}\"]`
            );
            if (dropdownItem) dropdownItem.style.display = "block";
        }

        this.optionalServices = this.optionalServices.filter(
            (id) => id !== serviceId
        );

        // Clear fields
        box.querySelectorAll("input, select, textarea").forEach((field) => {
            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = false;
            } else if (field.type !== "file") {
                field.value = field.tagName === "SELECT" ? "0" : "";
            }
            field.classList.remove("is-invalid");
            field.style.borderColor = "";
        });

        console.log("Removed optional service:", serviceId);
    }

    handleTermsChange(event) {
        const checkbox = event.target;
        console.log(checkbox);
        if (checkbox.checked) {
            checkbox.classList.remove("is-invalid");
            checkbox.classList.add("is-valid");
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) return;

        console.log("Starting form submission...");

        this.isSubmitting = true;
        const submitBtn = document.getElementById("SubmitForm");

        try {
            toggleLoadingState(true, submitBtn);

            if (!this.validateForm()) {
                console.log("Form validation failed");
                return;
            }

            // Collect data using new structure
            const formData = dataCollector.collectAllData(
                this.currentTab,
                this.upholsteryItems,
                this.selectedDates,
                this.optionalServices
            );

            console.log("Submitting form data:", formData);

            const response = await submitFormData(formData);

            if (response.success) {
                uiManager.showSuccess(FormConfig.messages.success);
                this.handleSuccessfulSubmission();
            } else {
                this.handleSubmissionError(response);
            }
        } catch (error) {
            console.error("Submission error:", error);
            this.showErrorMessage(
                "An error occurred while submitting the form. Please try again."
            );
        } finally {
            this.isSubmitting = false;
            setTimeout(() => toggleLoadingState(false, submitBtn), 1000);
        }
    }

    /**
     * FIX #1 & #2: Validate form with optional services and scroll to first error
     */
    validateForm() {
        this.validator.clearErrors();
        let isValid = true;
        let allErrorFields = [];

        // 1. Validate property details using FormValidator
        const propertyFields = ["typeSelect", "storeyInput", "furnitureSelect"];
        if (!this.validator.validateRequiredFields(propertyFields)) {
            isValid = false;
            propertyFields.forEach((fieldId) => {
                const field = document.getElementById(fieldId);
                if (field && field.classList.contains("is-invalid")) {
                    allErrorFields.push({ field, order: 1 });
                }
            });
        }

        // 2. Validate current tab
        const tabErrors = this.validateCurrentTab();
        if (!tabErrors.isValid) {
            isValid = false;
            tabErrors.fields.forEach((f) => {
                allErrorFields.push({ field: f, order: 2 });
            });
        }

        // 3. Validate optional services
        const optionalErrors = this.validateOptionalServices();
        if (!optionalErrors.isValid) {
            isValid = false;
            optionalErrors.fields.forEach((f) => {
                allErrorFields.push({ field: f, order: 3 });
            });
        }

        // 4. Validate cleaning address if checkbox is checked
        const cleaningCheckbox = document.getElementById(
            "separateCleaningAddress"
        );
        if (cleaningCheckbox && cleaningCheckbox.checked) {
            const cleaningFields = [
                "cleaningStreet",
                "cleaningNo",
                "cleaningZip",
                "cleaningCity",
            ];
            if (!this.validator.validateRequiredFields(cleaningFields)) {
                isValid = false;
                cleaningFields.forEach((fieldId) => {
                    const field = document.getElementById(fieldId);
                    if (field && field.classList.contains("is-invalid")) {
                        allErrorFields.push({ field, order: 3 });
                    }
                });
            }
        }

        // 5. Validate contact person if checkbox is checked
        const contactCheckbox = document.getElementById(
            "separateContactPerson"
        );
        if (contactCheckbox && contactCheckbox.checked) {
            const contactFields = [
                "contactCountry",
                "contactFirstName",
                "contactSecondName",
                "contactEmail",
                "contactMobile",
            ];

            if (!this.validator.validateRequiredFields(contactFields)) {
                isValid = false;
            }

            if (!this.validator.validateEmailField("contactEmail")) {
                isValid = false;
            }

            if (!this.validator.validatePhoneField("contactMobile")) {
                isValid = false;
            }

            contactFields.forEach((fieldId) => {
                const field = document.getElementById(fieldId);
                if (field && field.classList.contains("is-invalid")) {
                    allErrorFields.push({ field, order: 3 });
                }
            });
        }

        // 6. Validate personal information using FormValidator
        const personalFields = [
            "billingEmail",
            "billingMobile",
            "billingFirstName",
            "billingSecondName",
            "billingStreet",
            "billingNo",
            "billingZip",
            "billingCity",
            "billingCountry",
        ];

        if (!this.validator.validateRequiredFields(personalFields)) {
            isValid = false;
        }

        if (!this.validator.validateEmailField("billingEmail")) {
            isValid = false;
        }

        if (!this.validator.validatePhoneField("billingMobile")) {
            isValid = false;
        }

        personalFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (field && field.classList.contains("is-invalid")) {
                allErrorFields.push({ field, order: 4 });
            }
        });

        // 7. Validate terms
        if (!this.validator.validateCheckbox("confirmForm")) {
            isValid = false;
            const checkBox = document.getElementById("confirmForm");
            if (checkBox) {
                allErrorFields.push({ field: checkBox, order: 5 });
            }
            isValid = false;
        }

        // Scroll to first error
        if (!isValid) {
            allErrorFields.sort((a, b) => a.order - b.order);
            if (allErrorFields.length > 0) {
                const firstErrorField = allErrorFields[0].field;
                uiManager.scrollToError(firstErrorField);
            }
        }

        return isValid;
    }

    /**
     * Validate current tab and return error fields
     */
    validateCurrentTab() {
        let isValid = true;
        let errorFields = [];
        console.log(this.currentTab);
        switch (this.currentTab) {
            case "normal-cleaning":
                const fieldsNormal = ["reasonForNormal", "areaForNormal"];
                if (!this.validator.validateRequiredFields(fieldsNormal)) {
                    isValid = false;
                    fieldsNormal.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                console.log(
                    this.validator.validateRadioGroup("contaminationForNormal")
                );
                if (
                    !this.validator.validateRadioGroup("contaminationForNormal")
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForNormal"]'
                    );
                    if (radio) {
                        errorFields.push(radio.parentElement);
                    }
                }
                break;

            case "windows-cleaning":
                const fieldsWindow = [
                    "reasonForWindow",
                    "casementForWindow",
                    "heightInputForWindow",
                ];
                if (!this.validator.validateRequiredFields(fieldsWindow)) {
                    isValid = false;
                    fieldsWindow.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                if (
                    !this.validator.validateRadioGroup("contaminationForWindow")
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForWindow"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;

            case "carpet":
                const fieldsCarpet = [
                    "totalAreaForCarpet",
                    "looseCarpetForCarpet",
                    "fixedCarpetForCarpet",
                ];
                if (!this.validator.validateRequiredFields(fieldsCarpet)) {
                    isValid = false;
                    fieldsCarpet.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                if (
                    !this.validator.validateRadioGroup("contaminationForCarpet")
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForCarpet"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;

            case "upholstery-cleaning":
                if (
                    !this.validator.validateRadioGroup(
                        "contaminationForUpholstery"
                    )
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForUpholstery"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;

            case "spring-cleaning":
                const fieldsSpring = [
                    "reasonForSpringCleaning",
                    "areaForSpringCleaning",
                ];
                if (!this.validator.validateRequiredFields(fieldsSpring)) {
                    isValid = false;
                    fieldsSpring.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                if (
                    !this.validator.validateRadioGroup(
                        "contaminationForSpringCleaning"
                    )
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForSpringCleaning"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;

            case "cleaning":
                const fieldsEnd = ["reasonForCleaning", "areaForCleaning"];
                if (!this.validator.validateRequiredFields(fieldsEnd)) {
                    isValid = false;
                    fieldsEnd.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                if (
                    !this.validator.validateRadioGroup(
                        "contaminationForCleaning"
                    )
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForCleaning"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;

            case "messie-apartment":
                const fieldsMessie = [
                    "reasonForMessieApatment",
                    "areaForMessieApatment",
                ];
                if (!this.validator.validateRequiredFields(fieldsMessie)) {
                    isValid = false;
                    fieldsMessie.forEach((id) => {
                        const field = document.getElementById(id);
                        if (field && field.classList.contains("is-invalid")) {
                            errorFields.push(field);
                        }
                    });
                }
                if (
                    !this.validator.validateRadioGroup(
                        "contaminationForMessieApatment"
                    )
                ) {
                    isValid = false;
                    const radio = document.querySelector(
                        'input[name="contaminationForMessieApatment"]'
                    );
                    if (radio) errorFields.push(radio.parentElement);
                }
                break;
        }

        return { isValid, fields: errorFields };
    }

    /**
     * FIX #1: Validate optional services
     */
    validateOptionalServices() {
        let isValid = true;
        let errorFields = [];

        this.optionalServices.forEach((boxId) => {
            const box = document.getElementById(boxId);
            if (!box || box.classList.contains("hidden")) return;

            switch (boxId) {
                case "box-1": // Window Cleaning Optional
                    const fieldsWindowOpt = [
                        "reasonForWindowOptional",
                        "casementForWindowOptional",
                        "heightInputForWindowOptional",
                    ];
                    if (
                        !this.validator.validateRequiredFields(fieldsWindowOpt)
                    ) {
                        isValid = false;
                        fieldsWindowOpt.forEach((id) => {
                            const field = document.getElementById(id);
                            if (
                                field &&
                                field.classList.contains("is-invalid")
                            ) {
                                errorFields.push(field);
                            }
                        });
                    }
                    if (
                        !this.validator.validateRadioGroup(
                            "contaminationForWindowOptional"
                        )
                    ) {
                        isValid = false;
                        const radio = document.querySelector(
                            'input[name="contaminationForWindowOptional"]'
                        );
                        if (radio) errorFields.push(radio.parentElement);
                    }
                    break;

                case "box-2": // Carpet Cleaning Optional
                    const fieldsCarpetOpt = [
                        "totalAreaForCarpetOptional",
                        "looseCarpetForCarpetOptional",
                        "fixedCarpetForCarpetOptional",
                    ];
                    if (
                        !this.validator.validateRequiredFields(fieldsCarpetOpt)
                    ) {
                        isValid = false;
                        fieldsCarpetOpt.forEach((id) => {
                            const field = document.getElementById(id);
                            if (
                                field &&
                                field.classList.contains("is-invalid")
                            ) {
                                errorFields.push(field);
                            }
                        });
                    }
                    if (
                        !this.validator.validateRadioGroup(
                            "contaminationForCarpetOptional"
                        )
                    ) {
                        isValid = false;
                        const radio = document.querySelector(
                            'input[name="contaminationForCarpetOptional"]'
                        );
                        if (radio) errorFields.push(radio.parentElement);
                    }
                    break;

                case "box-3": // Upholstery Cleaning Optional
                    if (
                        !this.validator.validateRadioGroup(
                            "contaminationForUpholsteryOptional"
                        )
                    ) {
                        isValid = false;
                        const radio = document.querySelector(
                            'input[name="contaminationForUpholsteryOptional"]'
                        );
                        if (radio) errorFields.push(radio.parentElement);
                    }
                    break;

                case "box-4": // Normal Cleaning Optional
                    const fieldsNormalOpt = [
                        "reasonForNormalOption",
                        "areaForNormalOption",
                    ];
                    if (
                        !this.validator.validateRequiredFields(fieldsNormalOpt)
                    ) {
                        isValid = false;
                        fieldsNormalOpt.forEach((id) => {
                            const field = document.getElementById(id);
                            if (
                                field &&
                                field.classList.contains("is-invalid")
                            ) {
                                errorFields.push(field);
                            }
                        });
                    }
                    if (
                        !this.validator.validateRadioGroup(
                            "contaminationForNormalOption"
                        )
                    ) {
                        isValid = false;
                        const radio = document.querySelector(
                            'input[name="contaminationForNormalOption"]'
                        );
                        if (radio) errorFields.push(radio.parentElement);
                    }
                    break;
            }
        });

        return { isValid, fields: errorFields };
    }

    handleSubmissionError(response) {
        console.error("Submission failed:", response);

        if (response.errors && typeof response.errors === "object") {
            const errorMessages = Object.values(response.errors).flat();
            uiManager.showError(errorMessages.join(", "));
        } else if (response.error) {
            uiManager.showError(response.error);
        } else {
            uiManager.showError("An error occurred. Please try again.");
        }
    }

    showErrorMessage(message) {
        uiManager.showError(message);
    }

    handleSuccessfulSubmission() {
        this.resetForm();
        console.log("Form submission completed successfully");
    }

    resetForm() {
        resetFormFields();

        this.upholsteryItems = [];
        this.selectedDates = [];
        this.optionalServices = [];

        this.currentTab = "normal-cleaning";
        this.setActiveTab("normal-cleaning");

        this.validator.clearErrors();

        if (this.flatpickrInstance) {
            this.flatpickrInstance.clear();
        }

        const selectedDatesList = document.getElementById("selectedDatesList");
        if (selectedDatesList) {
            selectedDatesList.innerHTML = "";
        }

        this.clearAllOptionalServices();

        const cleaningAddressSection =
            document.querySelector(".ceaning-address");
        const contactPersonSection = document.querySelector(".contact-person");
        if (cleaningAddressSection)
            cleaningAddressSection.style.display = "none";
        if (contactPersonSection) contactPersonSection.style.display = "none";

        const cleaningAddressCheckbox = document.getElementById(
            "separateCleaningAddress"
        );
        const contactPersonCheckbox = document.getElementById(
            "separateContactPerson"
        );
        if (cleaningAddressCheckbox) cleaningAddressCheckbox.checked = false;
        if (contactPersonCheckbox) contactPersonCheckbox.checked = false;
        utils.smoothScroll(
            document.querySelector(".container-tabs2-section"),
            document.getElementById("bookingForm")
        );
        console.log("Form reset completed");
    }

    finishInitialization() {
        this.initialized = true;

        document.dispatchEvent(
            new CustomEvent("formAppInitialized", {
                detail: { app: this },
            })
        );

        const loading = document.querySelector(".loading");
        if (loading) {
            setTimeout(() => (loading.style.display = "none"), 500);
        }
    }

    getStatus() {
        return {
            initialized: this.initialized,
            currentTab: this.currentTab,
            isSubmitting: this.isSubmitting,
            upholsteryItemsCount: this.upholsteryItems.length,
            selectedDatesCount: this.selectedDates.length,
            optionalServicesCount: this.optionalServices.length,
        };
    }
}

// Initialize app
const app = new CleaningFormApp();

app.init().catch((error) => {
    console.error("Failed to initialize CleaningFormApp:", error);

    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 10000;
    `;
    errorDiv.textContent = "Failed to load form. Please refresh the page.";
    document.body.appendChild(errorDiv);
});

window.CleaningFormApp = app;

export default app;
