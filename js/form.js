import { FormConfig } from "./modules/config.js";
import { FormValidator, initializeValidation } from "./modules/validation.js";
import { dataCollector } from "./modules/dataCollector.js";
import { uiManager } from "./modules/uiManager.js";
import { initializeImageUploads } from "./modules/imageUpload.js";
import { submitFormData } from "./modules/api.js";
import {
  toggleLoadingState,
  resetFormFields,
  debounce,
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
    this.handleFormInput = debounce(this.handleFormInput.bind(this), 300);
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
    this.setupInputValidation();
  }

  async setupEventListeners() {
    const submitBtn = document.getElementById("SubmitForm");
    if (submitBtn) {
      submitBtn.addEventListener("click", this.handleSubmit);
    }

    document.querySelectorAll("button[data-tab]").forEach((button) => {
      button.addEventListener("click", this.handleTabSwitch);
    });

    document.addEventListener("input", this.handleFormInput);
    document.addEventListener("change", this.handleFormInput);

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
        document
          .querySelectorAll(`input[name=\"${radioInput.name}\"]`)
          .forEach((radio) => {
            const label = radio.closest(".card-label");
            if (label) {
              label.classList.remove("selected");
              const card = label.querySelector(".card");
              if (card) card.style.borderColor = "";
            }
          });

        // Check the radio and add selected class
        radioInput.checked = true;
        const parentLabel = radioInput.closest(".card-label");
        if (parentLabel) {
          parentLabel.classList.add("selected");
          const card = parentLabel.querySelector(".card");
          if (card) card.style.borderColor = "#3ca200";
        }

        // Remove error state
        document
          .querySelectorAll(`input[name=\"${radioInput.name}\"]`)
          .forEach((radio) => {
            radio.parentElement?.classList.remove("error");
          });

        // Trigger change event
        radioInput.dispatchEvent(new Event("change", { bubbles: true }));
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
          const newDates = this.flatpickrInstance.selectedDates.filter(
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

        if (!widget.querySelector(".custom-info") && calendarNote !== "") {
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
          alert(`You can select up to ${preferredDateLimit} dates only`);
          selectedDates.pop();
          this.flatpickrInstance.setDate(selectedDates, true);
        }

        if (selectedDates.length === preferredDateLimit) {
          this.flatpickrInstance.set("disable", [
            function (date) {
              return !selectedDates.some((d) => d.getTime() === date.getTime());
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
      const serviceName = button.querySelector("span")?.textContent || newTab;
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
        field.classList.remove("error");
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
    document.querySelectorAll(".dropdown-item[data-value]").forEach((item) => {
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

    const activeButton = document.querySelector(`[data-tab=\"${tabName}\"]`);
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
    const availableBoxes = this.availableOptionalsByService[mainService] || [];

    // Update dropdown items visibility
    document.querySelectorAll(".dropdown-item[data-value]").forEach((item) => {
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
        this.handleCounterClick(e.target);
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.matches(".upholstery-input, .upholstery-input-optional")) {
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
    const newValue = isPlus ? currentValue + 1 : Math.max(0, currentValue - 1);

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
    const cleaningAddressSection = document.querySelector(".ceaning-address");

    if (cleaningAddressCheckbox && cleaningAddressSection) {
      cleaningAddressSection.style.display = "none";

      cleaningAddressCheckbox.addEventListener("change", (e) => {
        cleaningAddressSection.style.display = e.target.checked
          ? "block"
          : "none";
        if (!e.target.checked) {
          cleaningAddressSection.querySelectorAll("input").forEach((input) => {
            input.value = "";
            input.classList.remove("error");
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
              if (field.type === "checkbox" || field.type === "radio") {
                field.checked = false;
              } else {
                field.value = field.tagName === "SELECT" ? "0" : "";
              }
              field.classList.remove("error");
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
    dropdownItem.style.display = "none";

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
      field.classList.remove("error");
      field.style.borderColor = "";
    });

    console.log("Removed optional service:", serviceId);
  }

  setupInputValidation() {
    document.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.type === "file" || field.closest(".upholstery-wrapper")) return;

      field.addEventListener("blur", () => this.validateSingleField(field));
      field.addEventListener("input", () => this.updateFieldVisualState(field));
    });
  }

  validateSingleField(field) {
    const fieldId = field.id;
    if (!fieldId) return;

    field.classList.remove("error");
    const existingError = field.parentElement.querySelector(".field-error");
    if (existingError) existingError.remove();

    let isValid = true;
    let errorMessage = "";

    if (field.hasAttribute("required") || field.value.trim()) {
      if (field.type === "email") {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
      } else if (field.type === "number") {
        const value = parseFloat(field.value);
        if (isNaN(value) || value < 0) {
          isValid = false;
          errorMessage = "Please enter a valid positive number";
        }
      } else if (field.tagName === "SELECT") {
        if (field.value === "0" || field.value === "") {
          isValid = false;
          errorMessage = "Please make a selection";
        }
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    // field.classList.add("error");
    // field.classList.add('error-sign');
    field.classList.remove("success-sign");
    // const errorDiv = document.createElement('div');
    // errorDiv.className = 'field-error';
    // errorDiv.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 4px;';
    // errorDiv.textContent = message;

    // field.parentElement.appendChild(errorDiv);
  }

  updateFieldVisualState(field) {
    const isValid = this.isFieldValid(field);

    if (isValid) {
      //   field.style.borderColor = "#3ca200";
      // field.classList.remove('error-sign');
      field.classList.add("success-sign");
    } else {
      this.showFieldError(field);
    }
  }

  isFieldValid(field) {
    const value = field.value?.trim();

    if (!value || value === "0") return false;

    if (field.type === "email") {
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
    }

    if (field.type === "number") {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    }

    return true;
  }

  handleFormInput(event) {
    const field = event.target;

    if (!field.matches("input, select, textarea")) return;
    this.updateFieldVisualState(field);
  }

  handleTermsChange(event) {
    const checkbox = event.target;
    const label = document.getElementById("confirmFormLabel");

    if (checkbox.checked) {
      checkbox.classList.remove("error");
      if (label) label.style.color = "";
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
        uiManager.showSuccess(
          "Form submitted successfully! We will contact you soon."
        );
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
    let allErrorFields = []; // FIX #2: Collect all error fields for ordered scrolling

    // Validate property details
    const propertyFields = [
      "typeSelect",
      "storeyInput",
      "furnitureSelect",
      "areaForNormal",
    ];
    if (!this.validator.validateRequiredFields(propertyFields)) {
      isValid = false;
      propertyFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (
          field &&
          (field.classList.contains("error-sign") ||
            field.classList.contains("error"))
        ) {
          allErrorFields.push({ field, order: 1 }); // Property details first
        }
      });
    }

    // Validate current tab
    const tabErrors = this.validateCurrentTab();
    if (!tabErrors.isValid) {
      isValid = false;
      allErrorFields.push(
        ...tabErrors.fields.map((f) => ({ field: f, order: 2 }))
      ); // Main service second
    }

    // FIX #1: Validate optional services
    const optionalErrors = this.validateOptionalServices();
    if (!optionalErrors.isValid) {
      isValid = false;
      allErrorFields.push(
        ...optionalErrors.fields.map((f) => ({ field: f, order: 3 }))
      ); // Optional services third
    }

    // --- Validate Cleaning Address if checkbox is checked ---
    const cleaningCheckbox = document.getElementById("separateCleaningAddress");
    if (cleaningCheckbox && cleaningCheckbox.checked) {
      const cleaningFields = ["cleaningStreet", "cleaningNo", "cleaningZip"]; // حط الايديهات هنا
      cleaningFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (
          field &&
          (field.value.trim() === "" ||
            (field.tagName === "SELECT" && field.value === "0"))
        ) {
          field.classList.add("error-sign");
          allErrorFields.push({ field, order: 3 }); // نفس ترتيب optional services
          isValid = false;
        }
      });
    }
    const contactCheckbox = document.getElementById("separateContactPerson");
    if (contactCheckbox && contactCheckbox.checked) {
      const cleaningFields = ["contactFirstName"];
      cleaningFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (
          field &&
          (field.value.trim() === "" ||
            (field.tagName === "SELECT" && field.value === "0"))
        ) {
          field.classList.add("error-sign");
          allErrorFields.push({ field, order: 3 });
          isValid = false;
        }
      });
    }

    // Validate personal information
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
      "billingSalutation",
    ];

    if (!this.validator.validateRequiredFields(personalFields)) {
      isValid = false;
      personalFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (
          field &&
          (field.classList.contains("error-sign") ||
            field.classList.contains("error"))
        ) {
          allErrorFields.push({ field, order: 4 }); // Personal info last
        }
      });
    }

    // Validate email
    if (!this.validator.validateEmailField("billingEmail")) {
      isValid = false;
      const field = document.getElementById("billingEmail");
      if (field && !allErrorFields.find((e) => e.field === field)) {
        allErrorFields.push({ field, order: 4 });
      }
    }

    // Validate terms
    const termsCheckbox = document.getElementById("confirmForm");
    if (!termsCheckbox || !termsCheckbox.checked) {
      if (termsCheckbox) {
        termsCheckbox.classList.add("error");
        const label = document.getElementById("confirmFormLabel");
        if (label) label.style.color = "red";
      }
      isValid = false;
    }

    if (!isValid) {
      // FIX #2: Sort error fields by order (top to bottom)
      allErrorFields.sort((a, b) => a.order - b.order);

      if (allErrorFields.length > 0) {
        console.log(allErrorFields, "allErrorFields");

        const firstErrorField = allErrorFields[0].field;
        uiManager.scrollToError(firstErrorField);
      }

      // uiManager.showError('Please fill in all required fields correctly');
    }

    return isValid;
  }

  /**
   * Validate current tab and return error fields
   */
  validateCurrentTab() {
    let isValid = true;
    let errorFields = [];

    switch (this.currentTab) {
      case "normal-cleaning":
        const areaForNormal = document.getElementById("areaForNormal");
        const reasonForNormal = document.getElementById("reasonForNormal");
        if (!areaForNormal?.value || parseFloat(areaForNormal.value) <= 0) {
          this.showFieldError(
            areaForNormal,
            "Please enter area in square meters"
          );
          isValid = false;
          errorFields.push(areaForNormal);
        }
        if (!reasonForNormal?.value || reasonForNormal.value === "0") {
          this.showFieldError(reasonForNormal, "Please select a reason");
          isValid = false;
          errorFields.push(reasonForNormal);
        }
        if (!this.validator.validateRadioGroup("contaminationForNormal")) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForNormal"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "windows-cleaning":
        const casement = document.getElementById("casementForWindowCleaning");
        const reason = document.getElementById("reasonForWindowCleaning");
        const height = document.getElementById("heightInputForWindowCleaning");

        if (!casement?.value || parseFloat(casement.value) <= 0) {
          this.showFieldError(casement, "Please enter number of window sashes");
          isValid = false;
          errorFields.push(casement);
        }
        if (!reason?.value || reason.value === "0") {
          this.showFieldError(reason, "Please select a reason");
          isValid = false;
          errorFields.push(reason);
        }
        if (!height?.value || parseFloat(height.value) <= 0) {
          this.showFieldError(height, "Please enter room height");
          isValid = false;
          errorFields.push(height);
        }
        if (
          !this.validator.validateRadioGroup("contaminationForWindowCleaning")
        ) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForWindowCleaning"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "carpet":
        const totalArea = document.getElementById("totalAreaForCarpet");
        if (!totalArea?.value || parseFloat(totalArea.value) <= 0) {
          this.showFieldError(totalArea, "Please enter total area");
          isValid = false;
          errorFields.push(totalArea);
        }
        if (!this.validator.validateRadioGroup("contaminationForCarpet")) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForCarpet"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "upholstery-cleaning":
        // if (this.upholsteryItems.length === 0) {
        //     // uiManager.showError('Please select at least one furniture item');
        //     isValid = false;
        //     const firstUpholsteryInput = document.querySelector('.upholstery-input');
        //     if (firstUpholsteryInput) errorFields.push(firstUpholsteryInput);
        // }
        if (!this.validator.validateRadioGroup("contaminationForUpholstery")) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForUpholstery"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "spring-cleaning":
        const areaSpring = document.getElementById("areaForSpringCleaning");
        const reasonSpring = document.getElementById("reasonForSpringCleaning");
        if (!areaSpring?.value || parseFloat(areaSpring.value) <= 0) {
          this.showFieldError(areaSpring, "Please enter area");
          isValid = false;
          errorFields.push(areaSpring);
        }
        if (!reasonSpring?.value || reasonSpring.value === "0") {
          this.showFieldError(reasonSpring, "Please select a reason");
          isValid = false;
          errorFields.push(reasonSpring);
        }
        if (
          !this.validator.validateRadioGroup("contaminationForSpringCleaning")
        ) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForSpringCleaning"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "cleaning":
        const areaEnd = document.getElementById("areaForCleaning");
        const reasonEnd = document.getElementById("reasonForCleaning");
        if (!areaEnd?.value || parseFloat(areaEnd.value) <= 0) {
          this.showFieldError(areaEnd, "Please enter area");
          isValid = false;
          errorFields.push(areaEnd);
        }
        if (!reasonEnd?.value || reasonEnd.value === "0") {
          this.showFieldError(reasonEnd, "Please select a reason");
          isValid = false;
          errorFields.push(reasonEnd);
        }
        if (!this.validator.validateRadioGroup("contaminationForCleaning")) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForCleaning"]'
          );
          if (radio) errorFields.push(radio);
        }
        break;

      case "messie-apartment":
        const areaMessie = document.getElementById("areaForMessieApatment");
        const reasonMessie = document.getElementById("reasonForMessieApatment");
        if (!areaMessie?.value || parseFloat(areaMessie.value) <= 0) {
          this.showFieldError(areaMessie, "Please enter area");
          isValid = false;
          errorFields.push(areaMessie);
        }
        if (!reasonMessie?.value || reasonMessie.value === "0") {
          this.showFieldError(reasonMessie, "Please select a reason");
          isValid = false;
          errorFields.push(reasonMessie);
        }
        if (
          !this.validator.validateRadioGroup("contaminationForMessieApatment")
        ) {
          isValid = false;
          const radio = document.querySelector(
            'input[name="contaminationForMessieApatment"]'
          );
          if (radio) errorFields.push(radio);
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

    // Validate each active optional service
    this.optionalServices.forEach((boxId) => {
      const box = document.getElementById(boxId);
      if (!box || box.classList.contains("hidden")) return;

      switch (boxId) {
        case "box-1": // Window Cleaning Optional
          const reasonWindow = document.getElementById(
            "reasonForWindowCleaningOptional"
          );
          const casementWindow = document.getElementById(
            "casementForWindowCleaningOptional"
          );
          const heightWindow = document.getElementById(
            "heightInputForWindowCleaningOptional"
          );

          if (!reasonWindow?.value || reasonWindow.value === "0") {
            this.showFieldError(reasonWindow, "Please select a reason");
            isValid = false;
            errorFields.push(reasonWindow);
          }
          if (!casementWindow?.value || parseFloat(casementWindow.value) <= 0) {
            this.showFieldError(
              casementWindow,
              "Please enter number of window sashes"
            );
            isValid = false;
            errorFields.push(casementWindow);
          }
          if (!heightWindow?.value || parseFloat(heightWindow.value) <= 0) {
            this.showFieldError(heightWindow, "Please enter room height");
            isValid = false;
            errorFields.push(heightWindow);
          }
          if (
            !this.validator.validateRadioGroup(
              "contaminationForWindowCleaningOptional"
            )
          ) {
            isValid = false;
            const radio = document.querySelector(
              'input[name="contaminationForWindowCleaningOptional"]'
            );
            if (radio) errorFields.push(radio);
          }
          break;

        case "box-2": // Carpet Cleaning Optional
          const areaCarpet = document.getElementById(
            "totalAreaForCarpetOptional"
          );
          if (!areaCarpet?.value || parseFloat(areaCarpet.value) <= 0) {
            this.showFieldError(areaCarpet, "Please enter total area");
            isValid = false;
            errorFields.push(areaCarpet);
          }
          if (
            !this.validator.validateRadioGroup("contaminationForCarpetOptional")
          ) {
            isValid = false;
            const radio = document.querySelector(
              'input[name="contaminationForCarpetOptional"]'
            );
            if (radio) errorFields.push(radio);
          }
          break;

        case "box-3": // Upholstery Cleaning Optional
          // Check if any upholstery items are selected in this box
          // const upholsteryInputs = box.querySelectorAll('.upholstery-input-optional');
          // let hasItems = false;
          // upholsteryInputs.forEach(input => {
          //     if (parseInt(input.value) > 0) hasItems = true;
          // });

          // if (!hasItems) {
          //     uiManager.showError('Please select at least one furniture item in optional upholstery service');
          //     isValid = false;
          //     if (upholsteryInputs.length > 0) errorFields.push(upholsteryInputs[0]);
          // }
          if (
            !this.validator.validateRadioGroup(
              "contaminationForUpholsteryOptional"
            )
          ) {
            isValid = false;
            const radio = document.querySelector(
              'input[name="contaminationForUpholsteryOptional"]'
            );
            if (radio) errorFields.push(radio);
          }
          break;

        case "box-4": // Normal Cleaning Optional
          const areaNormal = document.getElementById("areaForNormalOption");
          const reasonNormal = document.getElementById("reasonForNormalOption");
          if (!areaNormal?.value || parseFloat(areaNormal.value) <= 0) {
            this.showFieldError(areaNormal, "Please enter area");
            isValid = false;
            errorFields.push(areaNormal);
          }
          if (!reasonNormal?.value || reasonNormal.value === "0") {
            this.showFieldError(reasonNormal, "Please select a reason");
            isValid = false;
            errorFields.push(reasonNormal);
          }
          if (
            !this.validator.validateRadioGroup("contaminationForNormalOption")
          ) {
            isValid = false;
            const radio = document.querySelector(
              'input[name="contaminationForNormalOption"]'
            );
            if (radio) errorFields.push(radio);
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
    // Reset form fields
    resetFormFields();

    // Reset internal state
    this.upholsteryItems = [];
    this.selectedDates = [];
    this.optionalServices = [];

    // Reset to default tab
    this.currentTab = "normal-cleaning";
    this.setActiveTab("normal-cleaning");

    // Clear validation errors
    this.validator.clearErrors();

    // Clear date picker
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }

    // Clear selected dates display
    const selectedDatesList = document.getElementById("selectedDatesList");
    if (selectedDatesList) {
      selectedDatesList.innerHTML = "";
    }

    // Hide all optional service boxes
    this.clearAllOptionalServices();

    // Hide address sections
    const cleaningAddressSection = document.querySelector(".ceaning-address");
    const contactPersonSection = document.querySelector(".contact-person");
    if (cleaningAddressSection) cleaningAddressSection.style.display = "none";
    if (contactPersonSection) contactPersonSection.style.display = "none";

    // Uncheck address toggles
    const cleaningAddressCheckbox = document.getElementById(
      "separateCleaningAddress"
    );
    const contactPersonCheckbox = document.getElementById(
      "separateContactPerson"
    );
    if (cleaningAddressCheckbox) cleaningAddressCheckbox.checked = false;
    if (contactPersonCheckbox) contactPersonCheckbox.checked = false;

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
