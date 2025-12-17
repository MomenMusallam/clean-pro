/**
 * Form Validation Module - FIXED VERSION
 * Handles all form validation logic with live validation
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
     * @returns {boolean} Is valid
     */
    validateRequiredFields(fieldIds = []) {
        this.errors = [];

        fieldIds.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const value = field.value.trim();
            
            if (!value || value === '0' || value === '') {
                this.errors.push({
                    field: fieldId,
                    element: field,
                    message: 'This field is required',
                });
                field.classList.add('error-sign');
                field.classList.remove('success-sign');
            } else {
                field.classList.remove('error-sign');
                field.classList.add('success-sign');
            }
        });

        return this.errors.length === 0;
    }

    /**
     * Validate email field
     * @param {string} fieldId - Email field ID
     * @returns {boolean} Is valid
     */
    validateEmailField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        const email = field.value.trim();
        
        if (!email) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Email is required',
            });
            field.classList.add('error-sign');
            field.classList.remove('success-sign');
            return false;
        }

        if (!validateEmail(email)) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Please enter a valid email ending with .com',
            });
            field.classList.add('error-sign');
            field.classList.remove('success-sign');
            return false;
        }

        field.classList.remove('error-sign');
        field.classList.add('success-sign');
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
            field.classList.remove('success-sign');
            return false;
        }

        if (phone.length < 5) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: 'Please enter a valid phone number',
            });
            field.classList.add('error-sign');
            field.classList.remove('success-sign');
            return false;
        }

        field.classList.remove('error-sign');
        field.classList.add('success-sign');
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
            field.classList.remove('success-sign');
            return false;
        }

        if (value > max) {
            this.errors.push({
                field: fieldId,
                element: field,
                message: `Value must be at most ${max}`,
            });
            field.classList.add('error-sign');
            field.classList.remove('success-sign');
            return false;
        }

        field.classList.remove('error-sign');
        field.classList.add('success-sign');
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
        
        document.querySelectorAll('.error-sign, .success-sign').forEach(el => {
            el.classList.remove('error-sign');
            el.classList.remove('success-sign');
        });

        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
}

/**
 * Setup real-time validation for input field
 * @param {HTMLElement} input - Input element
 */
export function setupRealtimeValidation(input) {
    if (!input) return;

    input.addEventListener('input', () => {
        const value = input.value.trim();

        // Email validation
        if (input.type === 'email') {
            if (value && validateEmail(value)) {
                input.classList.remove('error-sign');
                input.classList.add('success-sign');
            } else if (value) {
                input.classList.add('error-sign');
                input.classList.remove('success-sign');
            } else {
                input.classList.remove('error-sign');
                input.classList.remove('success-sign');
            }
        }
        // Number validation
        else if (input.type === 'number') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue > 0) {
                input.classList.remove('error-sign');
                input.classList.add('success-sign');
            } else if (value) {
                input.classList.add('error-sign');
                input.classList.remove('success-sign');
            } else {
                input.classList.remove('error-sign');
                input.classList.remove('success-sign');
            }
        }
        // Text validation
        else if (input.tagName === 'SELECT') {
            if (value !== '' && value !== '0') {
                input.classList.remove('error-sign');
                input.classList.add('success-sign');
            } else {
                input.classList.remove('error-sign');
                input.classList.remove('success-sign');
            }
        }
        else {
            if (value !== '' && value !== '0') {
                input.classList.remove('error-sign');
                input.classList.add('success-sign');
            } else {
                input.classList.remove('error-sign');
                input.classList.remove('success-sign');
            }
        }
    });

    // Also validate on blur for better UX
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && (!value || value === '0')) {
            input.classList.add('error-sign');
            input.classList.remove('success-sign');
        }
    });
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
    // Setup real-time validation for all inputs
    document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea, select').forEach(input => {
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