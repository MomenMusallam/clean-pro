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
    },

    // Calendar Settings
    calendar: {
        preferredDateLimit: window.appData?.preferredDateLimit || 3,
        note: window.appData?.calendarNote || '',
    },

    // Error Messages
    messages: {
        success: window.appData?.successMessage || '',
        error: 'An error occurred. Please try again.',
        validationError: window.appData?.fieldRequiredMessage || '',
        networkError: 'Network error. Please check your connection.',
        invalidEmail: 'Please enter a valid email address.',
        maxDatesExceeded: 'You can select up to {limit} dates only.',
    },
};

// Export individual configurations for tree-shaking
export const { api, services, locale, calendar, validation, ui, selectors, messages } = FormConfig;

export default FormConfig;
