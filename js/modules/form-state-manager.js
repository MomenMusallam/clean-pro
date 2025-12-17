/**
 * Form State Manager
 * Handles form state persistence, recovery, and management
 */

import { debounce } from './utils.js';
import { FormConfig } from './config.js';

/**
 * Form State Manager class
 */
export class FormStateManager {
    constructor() {
        this.storageKey = 'cleaning_form_state';
        this.autoSaveDelay = 2000; // Auto-save after 2 seconds of inactivity
        this.maxStorageAge = 24 * 60 * 60 * 1000; // 24 hours
        this.state = this.getDefaultState();
        this.listeners = new Set();
        this.debouncedSave = debounce(this.saveState.bind(this), this.autoSaveDelay);
    }

    /**
     * Get default form state
     * @returns {Object} Default state
     */
    getDefaultState() {
        return {
            currentTab: 'normal-cleaning',
            formData: {
                personalInfo: {},
                propertyDetails: {},
                serviceData: {},
                dates: [],
                files: {},
                optionalServices: [],
            },
            validation: {
                errors: {},
                touched: {},
            },
            ui: {
                accordionStates: {},
                checkboxStates: {},
                radioStates: {},
            },
            metadata: {
                created: Date.now(),
                lastModified: Date.now(),
                version: '1.0',
            },
        };
    }

    /**
     * Initialize state manager
     */
    initialize() {
        this.loadState();
        this.setupAutoSave();
        this.setupBeforeUnload();
        console.log('FormStateManager: Initialized');
    }

    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return;

            const parsedState = JSON.parse(stored);
            
            // Check if state is too old
            if (this.isStateExpired(parsedState)) {
                console.log('FormStateManager: Stored state expired, using default');
                this.clearState();
                return;
            }

            // Merge with default state to ensure all properties exist
            this.state = this.mergeStates(this.getDefaultState(), parsedState);
            this.state.metadata.lastModified = Date.now();
            
            console.log('FormStateManager: State loaded from storage');
            this.notifyListeners('state-loaded', this.state);
            
        } catch (error) {
            console.error('FormStateManager: Error loading state:', error);
            this.clearState();
        }
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            this.state.metadata.lastModified = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            console.log('FormStateManager: State saved');
            this.notifyListeners('state-saved', this.state);
        } catch (error) {
            console.error('FormStateManager: Error saving state:', error);
            
            // Try to free up space by clearing old data
            if (error.name === 'QuotaExceededError') {
                this.clearState();
                console.warn('FormStateManager: Storage quota exceeded, state cleared');
            }
        }
    }

    /**
     * Update form data
     * @param {string} section - Data section (personalInfo, serviceData, etc.)
     * @param {Object} data - Data to update
     */
    updateFormData(section, data) {
        if (!this.state.formData[section]) {
            this.state.formData[section] = {};
        }

        this.state.formData[section] = {
            ...this.state.formData[section],
            ...data,
        };

        this.debouncedSave();
        this.notifyListeners('form-data-updated', { section, data });
    }

    /**
     * Update current tab
     * @param {string} tabName - New tab name
     */
    updateCurrentTab(tabName) {
        this.state.currentTab = tabName;
        this.debouncedSave();
        this.notifyListeners('tab-changed', { tabName });
    }

    /**
     * Update validation errors
     * @param {Object} errors - Validation errors
     */
    updateValidationErrors(errors) {
        this.state.validation.errors = { ...errors };
        this.notifyListeners('validation-updated', { errors });
    }

    /**
     * Mark field as touched
     * @param {string} fieldName - Field name
     */
    markFieldTouched(fieldName) {
        this.state.validation.touched[fieldName] = true;
        this.debouncedSave();
    }

    /**
     * Update dates
     * @param {Array} dates - Selected dates
     */
    updateDates(dates) {
        this.state.formData.dates = [...dates];
        this.debouncedSave();
        this.notifyListeners('dates-updated', { dates });
    }

    /**
     * Update files
     * @param {string} inputId - File input ID
     * @param {Array} files - File list
     */
    updateFiles(inputId, files) {
        this.state.formData.files[inputId] = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
        }));
        
        this.debouncedSave();
        this.notifyListeners('files-updated', { inputId, files });
    }

    /**
     * Update optional services
     * @param {Array} services - Optional services array
     */
    updateOptionalServices(services) {
        this.state.formData.optionalServices = [...services];
        this.debouncedSave();
        this.notifyListeners('optional-services-updated', { services });
    }

    /**
     * Get form data
     * @param {string} section - Optional section to get
     * @returns {Object} Form data
     */
    getFormData(section = null) {
        if (section) {
            return this.state.formData[section] || {};
        }
        return this.state.formData;
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Check if there's unsaved data
     * @returns {boolean} Has unsaved data
     */
    hasUnsavedData() {
        const formData = this.state.formData;
        
        // Check if any form section has data
        return (
            Object.keys(formData.personalInfo).length > 0 ||
            Object.keys(formData.serviceData).length > 0 ||
            formData.dates.length > 0 ||
            Object.keys(formData.files).length > 0
        );
    }

    /**
     * Restore form from state
     */
    restoreFormFromState() {
        if (!this.hasUnsavedData()) return false;

        try {
            // Restore personal info
            this.restorePersonalInfo();
            
            // Restore property details
            this.restorePropertyDetails();
            
            // Restore service data
            this.restoreServiceData();
            
            // Restore dates
            this.restoreDates();
            
            // Restore tab
            this.restoreCurrentTab();
            
            console.log('FormStateManager: Form restored from state');
            this.notifyListeners('form-restored', this.state);
            return true;
            
        } catch (error) {
            console.error('FormStateManager: Error restoring form:', error);
            return false;
        }
    }

    /**
     * Restore personal information fields
     */
    restorePersonalInfo() {
        const personalInfo = this.state.formData.personalInfo;
        
        Object.entries(personalInfo).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field && value) {
                if (field.type === 'checkbox') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
                
                // Trigger events to update UI state
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    /**
     * Restore property details
     */
    restorePropertyDetails() {
        const propertyDetails = this.state.formData.propertyDetails;
        
        ['typeSelect', 'storeyInput', 'furnitureSelect'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = propertyDetails[fieldId];
            
            if (field && value) {
                field.value = value;
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    /**
     * Restore service-specific data
     */
    restoreServiceData() {
        const serviceData = this.state.formData.serviceData;
        
        Object.entries(serviceData).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            if (field.type === 'radio') {
                if (field.value === value) {
                    field.checked = true;
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (field.type === 'checkbox') {
                if (Array.isArray(value) && value.includes(field.value)) {
                    field.checked = true;
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                field.value = value;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    /**
     * Restore selected dates
     */
    restoreDates() {
        const dates = this.state.formData.dates;
        if (dates.length > 0) {
            // This would need to be integrated with the date picker
            this.notifyListeners('restore-dates', { dates });
        }
    }

    /**
     * Restore current tab
     */
    restoreCurrentTab() {
        const tabName = this.state.currentTab;
        if (tabName && tabName !== 'normal-cleaning') {
            this.notifyListeners('restore-tab', { tabName });
        }
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        // Listen for form input changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.handleFormInput(e.target);
            }
        });

        // Listen for checkbox/radio changes
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"], input[type="radio"]')) {
                this.handleFormInput(e.target);
            }
        });
    }

    /**
     * Handle form input changes
     * @param {HTMLElement} field - Form field that changed
     */
    handleFormInput(field) {
        const fieldId = field.id;
        if (!fieldId) return;

        let value;
        if (field.type === 'checkbox') {
            value = field.checked;
        } else if (field.type === 'radio') {
            if (field.checked) {
                value = field.value;
            } else {
                return; // Don't save unchecked radio buttons
            }
        } else {
            value = field.value;
        }

        // Determine section based on field ID
        const section = this.getFieldSection(fieldId);
        this.updateFormData(section, { [fieldId]: value });
        this.markFieldTouched(fieldId);
    }

    /**
     * Get section for field ID
     * @param {string} fieldId - Field ID
     * @returns {string} Section name
     */
    getFieldSection(fieldId) {
        if (fieldId.startsWith('billing') || fieldId.includes('Email') || fieldId.includes('Phone')) {
            return 'personalInfo';
        }
        
        if (['typeSelect', 'storeyInput', 'furnitureSelect'].includes(fieldId)) {
            return 'propertyDetails';
        }
        
        return 'serviceData';
    }

    /**
     * Setup beforeunload warning
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedData()) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.returnValue = message;
                return message;
            }
        });
    }

    /**
     * Check if state is expired
     * @param {Object} state - State to check
     * @returns {boolean} Is expired
     */
    isStateExpired(state) {
        if (!state.metadata || !state.metadata.created) return true;
        return Date.now() - state.metadata.created > this.maxStorageAge;
    }

    /**
     * Merge two states
     * @param {Object} defaultState - Default state
     * @param {Object} storedState - Stored state
     * @returns {Object} Merged state
     */
    mergeStates(defaultState, storedState) {
        const merged = { ...defaultState };
        
        Object.keys(storedState).forEach(key => {
            if (typeof defaultState[key] === 'object' && defaultState[key] !== null) {
                merged[key] = { ...defaultState[key], ...storedState[key] };
            } else {
                merged[key] = storedState[key];
            }
        });
        
        return merged;
    }

    /**
     * Clear all state
     */
    clearState() {
        localStorage.removeItem(this.storageKey);
        this.state = this.getDefaultState();
        console.log('FormStateManager: State cleared');
        this.notifyListeners('state-cleared');
    }

    /**
     * Add event listener
     * @param {Function} listener - Event listener function
     */
    addListener(listener) {
        this.listeners.add(listener);
    }

    /**
     * Remove event listener
     * @param {Function} listener - Event listener function
     */
    removeListener(listener) {
        this.listeners.delete(listener);
    }

    /**
     * Notify all listeners
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    notifyListeners(event, data = {}) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('FormStateManager: Error in listener:', error);
            }
        });
    }

    /**
     * Export state for debugging
     * @returns {Object} Serializable state
     */
    exportState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * Import state (for debugging/testing)
     * @param {Object} importedState - State to import
     */
    importState(importedState) {
        this.state = this.mergeStates(this.getDefaultState(), importedState);
        this.saveState();
        this.notifyListeners('state-imported', this.state);
    }
}

/**
 * Create singleton instance
 */
export const formStateManager = new FormStateManager();

export default FormStateManager;