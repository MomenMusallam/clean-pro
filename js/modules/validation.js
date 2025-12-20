/**
 * Form Validation Module - OPTIMIZED VERSION
 * Works with input-wrapper structure from setupCheckMarks
 */

import { validateEmail, getCheckedValues, getSelectedRadio } from './utils.js';
import { validation as validationConfig } from './config.js';

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

        fieldIds.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const value = field.value.trim();
            const isEmpty = !value || value == 0 || value === '';
            
            if (isEmpty) {
                this.errors.push({
                    field: fieldId,
                    element: field,
                });
                
                // Add error styling
                field.classList.add('error-sign');
                
                // Add error message
                const wrapper = field.closest('.input-wrapper') || field.parentElement;
                const existingError = wrapper.querySelector(".field-error");
                if (!existingError) {
                    const errorDiv = document.createElement("div");
                    errorDiv.className = "field-error";
                    errorDiv.style.cssText = "color: #f44336; font-size: 12px; margin-top: 4px;";
                    errorDiv.textContent = message;
                    wrapper.appendChild(errorDiv);
                }
            } else {
                field.classList.remove('error-sign');
                
                // Remove error message
                const wrapper = field.closest('.input-wrapper') || field.parentElement;
                const existingError = wrapper.querySelector(".field-error");
                if (existingError) existingError.remove();
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
        const wrapper = field.closest('.input-wrapper') || field.parentElement;
        
        // Remove previous error messages
        const existingError = wrapper.querySelector(".field-error");
        if (existingError) existingError.remove();
        
        if (!email) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Email is required',
            });
            field.classList.add('error-sign');
            return false;
        }

        // Enhanced email validation regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(email)) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Please enter a valid email address',
            });
            field.classList.add('error-sign');
            
            // Show error message
            const errorDiv = document.createElement("div");
            errorDiv.className = "field-error";
            errorDiv.style.cssText = "color: #f44336; font-size: 12px; margin-top: 4px;";
            errorDiv.textContent = 'Please enter a valid email address';
            wrapper.appendChild(errorDiv);
            
            return false;
        }

        field.classList.remove('error-sign');
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

        const phone = field.value.trim();
        
        if (!phone) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Phone is required',
            });
            field.classList.add('error-sign');
            return false;
        }

        if (phone.length < 5) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Please enter a valid phone number',
            });
            field.classList.add('error-sign');
            return false;
        }

        field.classList.remove('error-sign');
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
                message: 'Please select an option',
            });

            document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
                radio.parentElement.classList.add('error');
            });

            return false;
        }

        document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
            radio.parentElement.classList.remove('error');
        });

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

        const value = parseFloat(field.value);

        if (isNaN(value) || value < min) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: `Value must be at least ${min}`,
            });
            field.classList.add('error-sign');
            return false;
        }

        if (value > max) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: `Value must be at most ${max}`,
            });
            field.classList.add('error-sign');
            return false;
        }

        field.classList.remove('error-sign');
        return true;
    }

    /**
     * Get first error element
     * @returns {HTMLElement|null} First error element
     */
    getFirstError() {
        if (this.errors.length === 0) return null;
        
        const firstError = this.errors.find(error => error.element);
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
        
        document.querySelectorAll('.error-sign').forEach(el => {
            el.classList.remove('error-sign');
        });

        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        document.querySelectorAll('.field-error').forEach(el => {
            el.remove();
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
    input.addEventListener('input', () => {
        validateFieldRealtime(input, false);
    });

    // Validation on blur with error messages
    input.addEventListener('blur', () => {
        validateFieldRealtime(input, true);
    });

    // For select elements, also validate on change
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
            validateFieldRealtime(input, false);
        });
    }
}

/**
 * Validate field in real-time with visual feedback
 * Works with the checkmark system from setupCheckMarks
 * @param {HTMLElement} field - Field to validate
 * @param {boolean} showErrors - Whether to show error messages
 */
function validateFieldRealtime(field, showErrors = false) {
    const value = field.value.trim();
    const wrapper = field.closest('.input-wrapper') || field.parentElement;
    const checkmark = wrapper.querySelector('.checkInput');
    
    // Remove previous error messages
    const existingError = wrapper.querySelector(".field-error");
    if (existingError) existingError.remove();

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!value) {
            // Empty field - hide both checkmark and error
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'none';
        } else if (emailRegex.test(value)) {
            // Valid email - show checkmark
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'block';
        } else {
            // Invalid email - show error icon
            field.classList.add('error-sign');
            if (checkmark) checkmark.style.display = 'none';
            
            if (showErrors) {
                const errorDiv = document.createElement("div");
                errorDiv.className = "field-error";
                errorDiv.style.cssText = "color: #f44336; font-size: 12px; margin-top: 4px;";
                errorDiv.textContent = "Please enter a valid email address";
                wrapper.appendChild(errorDiv);
            }
        }
    }
    // Number validation
    else if (field.type === 'number') {
        const numValue = parseFloat(value);
        
        if (!value) {
            // Empty field
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'none';
        } else if (!isNaN(numValue) && numValue > 0) {
            // Valid number - show checkmark
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'block';
        } else {
            // Invalid number - show error
            field.classList.add('error-sign');
            if (checkmark) checkmark.style.display = 'none';
        }
    }
    // Select validation
    else if (field.tagName === 'SELECT') {
        if (!value || value === '0' || value === '') {
            // No selection or default option - show error icon
            field.classList.add('error-sign');
            // Selects don't have checkmarks in your setup
        } else {
            // Valid selection - remove error
            field.classList.remove('error-sign');
        }
    }
    // Text/textarea validation
    else {
        if (!value || value === '0') {
            // Empty field
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'none';
        } else {
            // Has value - show checkmark
            field.classList.remove('error-sign');
            if (checkmark) checkmark.style.display = 'block';
        }
    }
}

/**
 * Setup validation for radio group
 * @param {string} radioName - Radio group name
 */
export function setupRadioValidation(radioName) {
    const radios = document.getElementsByName(radioName);

    radios.forEach((radio) => {
        radio.addEventListener('click', () => {
            radios.forEach((r) => {
                r.parentElement.classList.remove('error');
            });
            radio.parentElement.classList.add('selected');
        });
    });
}

/**
 * Initialize all validation setups
 */
export function initializeValidation() {
    // Setup real-time validation for all inputs, selects, and textareas
    document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea, select').forEach(input => {
        // Skip if already in upholstery wrapper or file inputs
        if (input.closest('.upholstery-wrapper') || input.type === 'file') return;
        
        setupRealtimeValidation(input);
    });

    // Setup radio validations
    const radioGroups = [
        'contaminationForNormal',
        'contaminationForWindowCleaning',
        'contaminationForCarpet',
        'contaminationForSpringCleaning',
        'contaminationForCleaning',
        'contaminationForMessieApatment',
        'contaminationForUpholstery',
        'contaminationForWindowCleaningOptional',
        'contaminationForCarpetOptional',
        'contaminationForUpholsteryOptional',
        'contaminationForNormalOption',
    ];

    radioGroups.forEach(setupRadioValidation);
}

export default {
    FormValidator,
    setupRealtimeValidation,
    setupRadioValidation,
    initializeValidation,
};