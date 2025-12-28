/**
 * Form Validation Module - OPTIMIZED VERSION
 */

import { validateEmail, getCheckedValues, getSelectedRadio } from "./utils.js";
import { FormConfig } from "./config.js";

/**
 * Validation class for form fields
 */
export class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errors = [];
    }

    /**
     * Validate required fields
     * @param {Array} fieldIds - Array of field IDs to validate
     * @param {string} message - Error message
     * @returns {boolean} Is valid
     */
    validateRequiredFields(fieldIds = [], message) {
        this.errors = [];

        fieldIds.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const value = field.value.trim();
            const isEmpty = !value || value == 0 || value === "";
            const isNotRequired = FormConfig.notRequiredFields.includes(
                field.id
            );
            if (isNotRequired) {
                if (value) {
                    field.classList.add("is-valid");
                } else {
                    field.classList.remove("is-valid");
                }
            } else {
                if (isEmpty) {
                    this.errors.push({
                        field: fieldId,
                        element: field,
                    });
                    // Add Bootstrap invalid class
                    showInvalid(field);
                } else {
                    clearInvalid(field);
                    field.classList.add("is-valid");
                }
            }
        });

        return this.errors.length === 0;
    }

    /**
     * Validate email field with proper regex
     * @param {string} fieldId - Email field ID
     * @returns {boolean} Is valid
     */
    validateEmailField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        const email = field.value.trim();
        clearInvalid(field);
        if (!email) {
            this.errors.push({
                field: fieldId,
                element: field,
                // message: "Email is required",
            });
            showInvalid(field);
            return false;
        }

        // Enhanced email validation regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            this.errors.push({
                field: fieldId,
                element: field,
                // message: "Please enter a valid email address",
            });
            showInvalid(field);
            return false;
        }

        clearInvalid(field);
        field.classList.add("is-valid");
        return true;
    }

    /**
     * Validate phone field
     * @param {string} fieldId - Phone field ID
     * @returns {boolean} Is valid
     */
    validatePhoneField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        clearInvalid(field);
        const phone = field.value.trim();

        if (!phone) {
            this.errors.push({
                field: fieldId,
                element: field,
                // message: "Phone is required",
            });
            showInvalid(field);
            return false;
        }

        if (phone.length < 5) {
            this.errors.push({
                field: fieldId,
                element: field,
                // message: "Please enter a valid phone number",
            });
            showInvalid(field);
            return false;
        }
        clearInvalid(field);
        field.classList.add("is-valid");
        return true;
    }

    /**
     * Validate radio group
     * @param {string} radioName - Radio group name
     * @returns {boolean} Is valid
     */
    validateRadioGroup(radioName) {
        const selected = getSelectedRadio(radioName);

        if (!selected) {
            this.errors.push({
                field: radioName,
                message: "Please select an option",
            });

            document
                .querySelectorAll(`input[name="${radioName}"]`)
                .forEach((radio) => {
                    radio.parentElement.classList.add("is-invalid");
                    radio.parentElement.classList.remove("is-valid");
                });

            return false;
        }

        document
            .querySelectorAll(`input[name="${radioName}"]`)
            .forEach((radio) => {
                radio.parentElement.classList.add("is-valid");
                radio.parentElement.classList.remove("is-invalid");
            });

        return true;
    }

    validateCheckbox(checkboxName) {
        const checkbox = document.getElementById(checkboxName);
        if (!checkbox.checked) {
            this.errors.push({
                field: checkboxName,
                message: "Please select at least one option",
            });

            checkbox.classList.add("is-invalid");
            checkbox.classList.remove("is-valid");

            return false;
        }

        checkbox.classList.add("is-valid");
        checkbox.classList.remove("is-invalid");

        return true;
    }

    /**
     * Validate number field
     * @param {string} fieldId - Field ID
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} Is valid
     */
    validateNumberField(fieldId, min = 0, max = Infinity) {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        clearInvalid(field);
        const value = parseFloat(field.value);

        if (isNaN(value) || value < min) {
            this.errors.push({
                field: fieldId,
                element: field,
                // message: `Value must be at least ${min}`,
            });
            field.classList.add("is-invalid");
            return false;
        }

        if (value > max) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: `Value must be at most ${max}`,
            });
            field.classList.add("is-invalid");
            return false;
        }

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        return true;
    }

    /**
     * Get first error element
     * @returns {HTMLElement|null} First error element
     */
    getFirstError() {
        if (this.errors.length === 0) return null;

        const firstError = this.errors.find((error) => error.element);
        return firstError ? firstError.element : null;
    }

    /**
     * Get all errors
     * @returns {Array} Array of errors
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Clear all validation errors
     */
    clearErrors() {
        this.errors = [];

        document.querySelectorAll(".is-invalid").forEach((el) => {
            clearInvalid(el);
        });
        document.querySelectorAll(".is-valid").forEach((el) => {
            el.classList.remove("is-valid");
        });
    }
}

/**
 * Setup real-time validation - Works with input-wrapper structure
 * @param {HTMLElement} input - Input element
 */
export function setupRealtimeValidation(input) {
    if (!input) return;

    // Real-time validation on input
    input.addEventListener("input", () => {
        validateFieldRealtime(input);
    });

    // Validation on blur with error messages
    input.addEventListener("blur", () => {
        validateFieldRealtime(input);
    });

    // Validation on blur with error messages
    input.addEventListener("change", () => {
        validateFieldRealtime(input);
    });

    // For select elements, also validate on change
    if (input.tagName === "SELECT") {
        input.addEventListener("change", () => {
            validateFieldRealtime(input);
        });
    }
}

/**
 * Validate field in real-time with visual feedback
 * Works with the checkmark system from setupCheckMarks
 * @param {HTMLElement} field - Field to validate
 * @param {boolean} showErrors - Whether to show error messages
 */
function validateFieldRealtime(field) {
    const value = field.value.trim();
    const isNotRequired = FormConfig.notRequiredFields.includes(field.id);

    // Reset state
    clearInvalid(field);
    field.classList.remove("is-valid");

    // ================= OPTIONAL FIELDS =================
    if (isNotRequired) {
        if (value) {
            field.classList.add("is-valid");
        }
        return;
    }

    // ================= REQUIRED FIELDS =================

    // Email
    if (field.type === "email") {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!value) {
            showInvalid(field, "This field is required");
        } else if (!emailRegex.test(value)) {
            showInvalid(field, "Please enter a valid email");
        } else {
            field.classList.add("is-valid");
        }
        return;
    }

    // Number
    if (field.type === "number") {
        const numValue = parseFloat(value);

        if (!value) {
            showInvalid(field, "This field is required");
        } else if (isNaN(numValue) || numValue <= 0) {
            showInvalid(field, "Please enter a valid number");
        } else {
            field.classList.add("is-valid");
        }
        return;
    }

    // Select
    if (field.tagName === "SELECT") {
        if (!value || value === "0") {
            if(field.id == 'billingSalutation' || field.id == 'contactSalutation') return; 
            showInvalid(field, "Please select an option");
        } else {
            field.classList.add("is-valid");
            if(field.id == 'billingSalutation' || field.id == 'contactSalutation') return;            
            const firstOption = field.querySelector(
                'option[value="0"], option[value=""]'
            );
            if (firstOption) firstOption.disabled = true;
        }
        return;
    }

    // Text / Textarea
    if (!value || value === "0") {
        showInvalid(field);
    } else {
        field.classList.add("is-valid");
    }
}

function showInvalid(field, message = FormConfig.messages.validationError) {
    const wrapper = field.parentElement;

    field.classList.remove("is-valid");
    field.classList.add("is-invalid");

    const existingError = wrapper.querySelector(".invalid-feedback");
    if (!existingError && !wrapper.classList.contains("counter-box")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "invalid-feedback";
        errorDiv.style.display = "contents";
        errorDiv.textContent = message;
        wrapper.appendChild(errorDiv);
    }
}

function clearInvalid(field) {
    const wrapper = field.parentElement;

    field.classList.remove("is-invalid");
    const existingError = wrapper.querySelector(".invalid-feedback");
    if (existingError) existingError.remove();
}

/**
 * Setup validation for radio group
 * @param {string} radioName - Radio group name
 */
export function setupRadioValidation(radioName) {
    const radios = document.getElementsByName(radioName);

    radios.forEach((radio) => {
        radio.addEventListener("click", () => {
            radios.forEach((r) => {
                r.parentElement.classList.remove("is-invalid");
                r.parentElement.classList.remove("is-valid");
            });

            // ;
        });
    });
}

/**
 * Initialize all validation setups
 */
export function initializeValidation() {
    // Setup real-time validation for all inputs, selects, and textareas
    document
        .querySelectorAll(
            'input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea, select'
        )
        .forEach((input) => {
            // Skip if already in upholstery wrapper or file inputs
            if (input.closest(".upholstery-wrapper") || input.type === "file")
                return;

            setupRealtimeValidation(input);
        });

    // Setup radio validations
    const radioGroups = [
        "contaminationForNormal",
        "contaminationForWindowCleaning",
        "contaminationForCarpet",
        "contaminationForSpringCleaning",
        "contaminationForCleaning",
        "contaminationForMessieApatment",
        "contaminationForUpholstery",
        "contaminationForWindowCleaningOptional",
        "contaminationForCarpetOptional",
        "contaminationForUpholsteryOptional",
        "contaminationForNormalOption",
    ];

    radioGroups.forEach(setupRadioValidation);
}

export default {
    FormValidator,
    setupRealtimeValidation,
    setupRadioValidation,
    initializeValidation,
};
