/**
 * Data Collection Module - Laravel Compatible (COMPLETE FIX)
 * Matches Laravel validation structure exactly
 */

import { getCheckedValues, getSelectedRadio } from './utils.js';
import { FormConfig } from './config.js';

/**
 * Data collector class aligned with Laravel validation
 */
export class DataCollector {
    constructor() {
        this.serviceIdMap = {
            'normal-cleaning': FormConfig.services.normalCleaning || '1',
            'windows-cleaning': FormConfig.services.windowCleaning || '2',
            'carpet': FormConfig.services.carpetCleaning || '3',
            'upholstery-cleaning': FormConfig.services.upholsteryCleaning || '4',
            'spring-cleaning': FormConfig.services.springCleaning || '5',
            'cleaning': FormConfig.services.endCleaning || '6',
            'messie-apartment': FormConfig.services.messieApartmentCleaning || '7',
        };

        // Box ID to tab mapping for optional services
        this.boxToTabMap = {
            'box-1': 'windows-cleaning',
            'box-2': 'carpet',
            'box-3': 'upholstery-cleaning',
            'box-4': 'normal-cleaning',
        };
    }

    /**
     * Collect service data for Normal Cleaning (ID: 1)
     * @param {boolean} isOptional - Is this an optional service
     * @returns {Object} Service data
     */
    collectNormalCleaningService(isOptional = false) {
        const prefix = isOptional ? 'Optional' : '';
        
        return {
            service_id: this.serviceIdMap['normal-cleaning'],
            reason_for_cleaning_id: document.getElementById(`reasonForNormal${prefix}`)?.value || null,
            area: document.getElementById(`areaForNormal${prefix}`)?.value || null,
            degree_of_contamination_id: getSelectedRadio(`contaminationForNormal${prefix}`) || null,
            cleaning_requests_ids: getCheckedValues(`requestsForNormal${prefix}`),
            additional_info: document.getElementById(`infoTextareaNormal${isOptional ? prefix : ''}`)?.value || '',
            images: this.getServiceImages(`formFileMultipleNormal${isOptional ? prefix : ''}`),
        };
    }

    /**
     * Collect service data for Window Cleaning (ID: 2)
     * @param {boolean} isOptional - Is this an optional service
     * @returns {Object} Service data
     */
    collectWindowCleaningService(isOptional = false) {
        const prefix = isOptional ? 'Optional' : '';
        
        return {
            service_id: this.serviceIdMap['windows-cleaning'],
            reason_for_cleaning_id: document.getElementById(`reasonForWindow${prefix}`)?.value || null,
            window_sash: document.getElementById(`casementForWindow${prefix}`)?.value || null,
            max_room_height: document.getElementById(`heightInputForWindow${prefix}`)?.value || null,
            degree_of_contamination_id: getSelectedRadio(`contaminationForWindow${prefix}`) || null,
            cleaning_requests_ids: getCheckedValues(`requestsForWindow${prefix}`),
            additional_info: document.getElementById(`infoTextareaWindow${isOptional }`)?.value || '',
            images: this.getServiceImages(`formFileMultipleWindow${isOptional }`),
        };
    }

    /**
     * Collect service data for Carpet Cleaning (ID: 3)
     * @param {boolean} isOptional - Is this an optional service
     * @returns {Object} Service data
     */
    collectCarpetCleaningService(isOptional = false) {
        const prefix = isOptional ? 'Optional' : '';
        
        return {
            service_id: this.serviceIdMap['carpet'],
            carpets: document.getElementById(`looseCarpetForCarpet${prefix}`)?.value || null,
            area: document.getElementById(`totalAreaForCarpet${prefix}`)?.value || null,
            fixed_carpet: document.getElementById(`fixedCarpetForCarpet${prefix}`)?.value || null,
            degree_of_contamination_id: getSelectedRadio(`contaminationForCarpet${prefix}`) || null,
            cleaning_requests_ids: getCheckedValues(`requestsForCarpet${prefix}`),
            additional_info: document.getElementById(`infoTextareaCarpet${isOptional}`)?.value || '',
            images: this.getServiceImages(`formFileMultipleCarpet${isOptional}`),
        };
    }

    /**
     * Collect service data for Upholstery Cleaning (ID: 4)
     * @param {Array} upholsteryItems - Array of furniture items
     * @param {boolean} isOptional - Is this an optional service
     * @returns {Object} Service data
     */
    collectUpholsteryCleaningService(upholsteryItems = [], isOptional = false) {
        const prefix = isOptional ? 'Optional' : '';
        
        // Collect upholstery items
        let furnitures = [];
        
        if (isOptional) {
            // For optional service, collect from optional box inputs
            const box = document.getElementById('box-3');
            if (box) {
                box.querySelectorAll('.upholstery-input-optional').forEach(input => {
                    const value = parseInt(input.value) || 0;
                    if (value > 0) {
                        furnitures.push({
                            furniture_type_id: Number(input.id.match(/\d+/)?.[0]),
                            furniture_num: value
                        });
                    }
                });
            }
        } else {
            // For main service, use provided upholsteryItems
            furnitures = upholsteryItems.map(item => ({
                furniture_type_id: item.furniture_type_id,
                furniture_num: parseInt(item.furniture_num) || 0,
            }));
        }
        
        return {
            service_id: this.serviceIdMap['upholstery-cleaning'],
            furnitures: furnitures,
            degree_of_contamination_id: getSelectedRadio(`contaminationForUpholstery${prefix}`) || null,
            cleaning_requests_ids: getCheckedValues(`requestsForUpholstery${prefix}`),
            additional_info: document.getElementById(`infoTextareaUpholstery${isOptional ? 'Carpet' : ''}`)?.value || '',
            images: this.getServiceImages(`formFileMultipleUpholstery${isOptional ? 'Carpet' : ''}`),
        };
    }

    /**
     * Collect service data for Spring Cleaning (ID: 5)
     * @returns {Object} Service data
     */
    collectSpringCleaningService() {
        return {
            service_id: this.serviceIdMap['spring-cleaning'],
            reason_for_cleaning_id: document.getElementById('reasonForSpringCleaning')?.value || null,
            area: document.getElementById('areaForSpringCleaning')?.value || null,
            degree_of_contamination_id: getSelectedRadio('contaminationForSpringCleaning') || null,
            cleaning_requests_ids: getCheckedValues('requestsForSpringCleaning'),
            additional_info: document.getElementById('infoTextareaForSpring')?.value || '',
            images: this.getServiceImages('formFileMultipleForSpring'),
        };
    }

    /**
     * Collect service data for End Cleaning (ID: 6)
     * @returns {Object} Service data
     */
    collectEndCleaningService() {
        return {
            service_id: this.serviceIdMap['cleaning'],
            reason_for_cleaning_id: document.getElementById('reasonForCleaning')?.value || null,
            area: document.getElementById('areaForCleaning')?.value || null,
            degree_of_contamination_id: getSelectedRadio('contaminationForCleaning') || null,
            cleaning_requests_ids: getCheckedValues('requestsForCleaning'),
            additional_info: document.getElementById('infoTextForCleaning')?.value || '',
            images: this.getServiceImages('formFileMultipleForCleaning'),
        };
    }

    /**
     * Collect service data for Messie Apartment Cleaning (ID: 7)
     * @returns {Object} Service data
     */
    collectMessieApartmentService() {
        return {
            service_id: this.serviceIdMap['messie-apartment'],
            reason_for_cleaning_id: document.getElementById('reasonForMessieApatment')?.value || null,
            area: document.getElementById('areaForMessieApatment')?.value || null,
            degree_of_contamination_id: getSelectedRadio('contaminationForMessieApatment') || null,
            cleaning_requests_ids: getCheckedValues('requestsForMessieApatment'),
            additional_info: document.getElementById('infoTextareaForMessieApatment')?.value || '',
            images: this.getServiceImages('formFileMultipleForMessieApatment'),
        };
    }

    /**
     * Get optional services based on active boxes
     * @param {Array} optionalBoxes - Array of active optional box IDs
     * @param {Array} upholsteryItems - Upholstery items for main form
     * @returns {Array} Array of optional service data
     */
    collectOptionalServices(optionalBoxes, upholsteryItems) {
        const optionalServices = [];

        optionalBoxes.forEach(boxId => {
            const box = document.getElementById(boxId);
            if (!box || box.classList.contains('hidden')) return;

            let serviceData = null;

            switch(boxId) {
                case 'box-1': // Window Cleaning
                    serviceData = this.collectWindowCleaningService(true);
                    break;
                case 'box-2': // Carpet Cleaning
                    serviceData = this.collectCarpetCleaningService(true);
                    break;
                case 'box-3': // Upholstery Cleaning
                    serviceData = this.collectUpholsteryCleaningService([], true);
                    break;
                case 'box-4': // Normal Cleaning
                    serviceData = this.collectNormalCleaningService(true);
                    break;
            }

            if (serviceData && this.hasServiceData(serviceData)) {
                optionalServices.push(serviceData);
            }
        });

        return optionalServices;
    }

    /**
     * Check if service has any meaningful data
     * @param {Object} serviceData - Service data object
     * @returns {boolean} Has data
     */
    hasServiceData(serviceData) {
        const hasRequiredData = 
            serviceData.area ||
            serviceData.window_sash ||
            serviceData.carpets ||
            (serviceData.furnitures && serviceData.furnitures.length > 0) ||
            serviceData.reason_for_cleaning_id ||
            serviceData.degree_of_contamination_id;

        return !!hasRequiredData;
    }

    /**
     * Get images for a service
     * @param {string} inputId - File input ID
     * @returns {Array} Array of File objects
     */
    getServiceImages(inputId) {
        const input = document.getElementById(inputId);
        return input && input.files ? Array.from(input.files) : [];
    }

    /**
     * Collect personal information matching Laravel validation
     * @returns {Object} Personal data
     */
    collectPersonalInfo() {
        const hasSeparateAddress = document.getElementById('separateCleaningAddress')?.checked || false;
        const hasSeparateContact = document.getElementById('separateContactPerson')?.checked || false;

        const personalData = {
            // Required fields
            email: document.getElementById('billingEmail')?.value || '',
            phone: document.getElementById('billingMobile')?.value || '',
            gender: document.getElementById('billingCountry')?.value || '',
            honorific_title: document.getElementById('billingSalutation')?.value || '',
            first_name: document.getElementById('billingFirstName')?.value || '',
            last_name: document.getElementById('billingSecondName')?.value || '',
            street: document.getElementById('billingStreet')?.value || '',
            street_number: document.getElementById('billingNo')?.value || '',
            zip_code: document.getElementById('billingZip')?.value || '',
            city: document.getElementById('billingCity')?.value || '',
            
            // Optional company
            company: document.getElementById('billingCompany')?.value || null,
            
            // Flags
            is_separate_address: hasSeparateAddress ? 1 : 0,
            is_separate_contact: hasSeparateContact ? 1 : 0,
            
            // Terms acceptance
            terms_accepted: document.getElementById('confirmForm')?.checked ? 1 : 0,
        };

        // Add separate address if checked
        if (hasSeparateAddress) {
            personalData.separate_company = document.getElementById('cleaningCompany')?.value || '';
            personalData.separate_street = document.getElementById('cleaningStreet')?.value || '';
            personalData.separate_street_number = document.getElementById('cleaningNo')?.value || '';
            personalData.separate_zip_code = document.getElementById('cleaningZip')?.value || '';
            personalData.separate_city = document.getElementById('cleaningCity')?.value || '';
        }

        // Add separate contact if checked
        if (hasSeparateContact) {
            personalData.separate_gender = document.getElementById('contactCountry')?.value || '';
            personalData.separate_honorific_title = document.getElementById('contactSalutation')?.value || '';
            personalData.separate_first_name = document.getElementById('contactFirstName')?.value || '';
            personalData.separate_last_name = document.getElementById('contactSecondName')?.value || '';
            personalData.separate_email = document.getElementById('contactEmail')?.value || '';
            personalData.separate_phone = document.getElementById('contactMobile')?.value || '';
            personalData.separate_additional_names = document.getElementById('contactNote')?.value || '';
        }

        return personalData;
    }

    /**
     * Collect property details
     * @returns {Object} Property data
     */
    collectPropertyDetails() {
        return {
            location_type_id: document.getElementById('typeSelect')?.value || null,
            floor: document.getElementById('storeyInput')?.value || '',
            location_status_id: document.getElementById('furnitureSelect')?.value || null,
        };
    }

    /**
     * Collect dates
     * @param {Array} selectedDates - Array of Date objects
     * @returns {Array} Formatted date strings
     */
    collectDates(selectedDates) {
        return selectedDates.map(date => {
            // Format as Y-m-d for Laravel
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });
    }

    /**
     * Collect all form data in Laravel-compatible format
     * @param {string} activeTab - Current active tab
     * @param {Array} upholsteryItems - Upholstery items array
     * @param {Array} selectedDates - Selected dates array
     * @param {Array} optionalBoxes - Active optional service boxes
     * @returns {Object} Complete form data
     */
    collectAllData(activeTab, upholsteryItems = [], selectedDates = [], optionalBoxes = []) {
        // Collect main service data
        const mainService = this.getMainServiceData(activeTab, upholsteryItems);
        
        // Collect optional services
        const optionalServices = this.collectOptionalServices(optionalBoxes, upholsteryItems);
        
        // Combine all services
        const servicesRequested = [mainService, ...optionalServices].filter(Boolean);

        // Build final data structure
        const formData = {
            lang: FormConfig.locale.current || 'en',
            preferred_date: this.collectDates(selectedDates),
            ...this.collectPropertyDetails(),
            services_requested: servicesRequested,
            ...this.collectPersonalInfo(),
        };

        console.log('Collected form data:', formData);
        return formData;
    }

    /**
     * Get main service data based on active tab
     * @param {string} activeTab - Active tab name
     * @param {Array} upholsteryItems - Upholstery items
     * @returns {Object} Main service data
     */
    getMainServiceData(activeTab, upholsteryItems) {
        const serviceCollectors = {
            'normal-cleaning': () => this.collectNormalCleaningService(),
            'windows-cleaning': () => this.collectWindowCleaningService(),
            'carpet': () => this.collectCarpetCleaningService(),
            'upholstery-cleaning': () => this.collectUpholsteryCleaningService(upholsteryItems),
            'spring-cleaning': () => this.collectSpringCleaningService(),
            'cleaning': () => this.collectEndCleaningService(),
            'messie-apartment': () => this.collectMessieApartmentService(),
        };

        const collector = serviceCollectors[activeTab];
        return collector ? collector() : null;
    }
}

/**
 * Create singleton instance
 */
export const dataCollector = new DataCollector();

export default DataCollector;