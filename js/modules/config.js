/**
 * Form Configuration Module
 * Centralized configuration for form behavior
 */

export const FormConfig = {
    // API Configuration
    api: {
        routeUrl: window.appData?.routeUrl || '',
        csrfToken: window.appData?.csrfToken || '',
    },

    // Service IDs
    services: {
        normalCleaning: window.appData?.normalCleaningServiceId || '',
        windowCleaning: window.appData?.windowCleaningServiceId || '',
        carpetCleaning: window.appData?.carpetCleaningServiceId || '',
        upholsteryCleaning: window.appData?.upholsteryCleaningServiceId || '',
        springCleaning: window.appData?.springCleaningServiceId || '',
        endCleaning: window.appData?.endCleaningServiceId || '',
        messieApartmentCleaning: window.appData?.messieApartmentCleaningServiceId || '',
    },

    // Localization
    locale: {
        current: window.appData?.locale || 'en',
        language: window.appData?.lang || 'en',
    },

    // Calendar Settings
    calendar: {
        preferredDateLimit: window.appData?.preferredDateLimit || 3,
        note: window.appData?.calendarNote || '',
        minDate: 1, // Days from today
        dateFormat: 'd/m/Y',
    },

    // Validation Rules
    validation: {
        emailDomain: '.com',
        minInputValue: 0,
        requiredFields: [
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
        ],
    },

    // UI Settings
    ui: {
        scrollDuration: 800, // milliseconds
        loadingDelay: 1000, // milliseconds
        animationDelay: 500, // milliseconds
        tooltipOffset: 5, // pixels
    },

    // Selectors - Centralized DOM selectors
    selectors: {
        form: '#bookingForm',
        submitBtn: '#SubmitForm',
        loading: '.submit-spiner',
        submitIcon: '.submit-icon',
        confirmRadio: '#confirmForm',
        confirmLabel: '#confirmFormLabel',
        datePicker: '#datepicker',
        selectedDatesList: '#selectedDatesList',
        tabSection: '.tab-section',
        dropdown: '#whichDropdown',
        boxes: '#boxes',
        containerSection: '.container-tabs2-section',
    },

    // Error Messages
    messages: {
        success: 'Form submitted successfully!',
        error: 'An error occurred. Please try again.',
        validationError: 'Please fill in all required fields.',
        networkError: 'Network error. Please check your connection.',
        invalidEmail: 'Please enter a valid email address.',
        maxDatesExceeded: 'You can select up to {limit} dates only.',
    },
};

// Export individual configurations for tree-shaking
export const { api, services, locale, calendar, validation, ui, selectors, messages } = FormConfig;

export default FormConfig;
