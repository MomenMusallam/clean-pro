/**
 * Utility Functions Module
 * Reusable helper functions
 */

/**
 * Smooth scroll to element with easing
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} target - Target element to scroll to
 * @param {number} duration - Animation duration in ms
 */
export function smoothScroll(container, target, duration = 600) {
    if (!container || !target) return;

    const start = container.scrollTop;
    const targetPosition = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
    const change = targetPosition;
    let currentTime = 0;

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    function animateScroll() {
        currentTime += 16; // ~60fps
        const val = easeInOutQuad(currentTime, start, change, duration);
        container.scrollTop = val;

        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
    }

    animateScroll();
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Convert nested object to FormData
 * @param {Object} data - Data object to convert
 * @returns {FormData} FormData instance
 */
export function convertToFormData(data) {
    const formData = new FormData();

    function appendItem(key, value) {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
            value.forEach((v, i) => appendItem(`${key}[${i}]`, v));
        } else if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Date)) {
            Object.keys(value).forEach((subKey) => appendItem(`${key}[${subKey}]`, value[subKey]));
        } else {
            formData.append(key, value);
        }
    }

    Object.keys(data).forEach((key) => appendItem(key, data[key]));
    return formData;
}

/**
 * Safely get nested object property
 * @param {Object} obj - Object to search
 * @param {string} path - Dot notation path
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Found value or default
 */
export function getNestedValue(obj, path, defaultValue = null) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
}

/**
 * Remove all error states from form elements
 */
export function clearErrorStates() {
    document.querySelectorAll('input, select, textarea').forEach((el) => {
        el.classList.remove('error');
        el.style.borderColor = '';
    });

    document.querySelectorAll('.error-icon').forEach((icon) => icon.remove());
}

/**
 * Show/hide loading state
 * @param {boolean} show - Whether to show loading
 * @param {HTMLElement} button - Button element
 */
export function toggleLoadingState(show, button) {
    const loading = button?.querySelector('.submit-spiner');
    const icon = button?.querySelector('.submit-icon');

    if (loading) loading.style.display = show ? 'block' : 'none';
    if (icon) icon.style.display = show ? 'none' : 'block';
    
    if (button) {
        if (show) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    }
}

/**
 * Format date to locale string
 * @param {Date} date - Date object
 * @param {string} locale - Locale string
 * @returns {string} Formatted date
 */
export function formatDate(date, locale = 'en-GB') {
    return date.toLocaleDateString(locale);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) && email.toLowerCase().endsWith('.com');
}

/**
 * Get all checked checkbox values
 * @param {string} name - Checkbox name attribute
 * @returns {Array} Array of values
 */
export function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map((el) => el.value);
}

/**
 * Get selected radio value
 * @param {string} name - Radio name attribute
 * @returns {string|null} Selected value or null
 */
export function getSelectedRadio(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : null;
}

/**
 * Reset all form fields
 */
export function resetFormFields() {
    document.querySelectorAll('input, select, textarea').forEach((input) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else if (input.type !== 'file') {
            input.value = '';
            input.style.borderColor = '';
        }
    });

    document.querySelectorAll('.checkInput').forEach((el) => {
        el.style.display = 'none';
    });
}

/**
 * Show error on specific field
 * @param {HTMLElement} field - Field element
 * @param {string} message - Error message
 */
export function showFieldError(field, message = '') {
    if (!field) return;

    field.classList.add('error');
    field.classList.add('error-sign');

    
    // if (message) {
    //     const errorDiv = document.createElement('div');
    //     errorDiv.className = 'error-message';
    //     errorDiv.textContent = message;
    //     errorDiv.style.color = 'red';
    //     errorDiv.style.fontSize = '12px';
    //     errorDiv.style.marginTop = '4px';
        
    //     field.parentElement.appendChild(errorDiv);
    // }
}

/**
 * Remove specific element's error state
 * @param {HTMLElement} field - Field element
 */
export function clearFieldError(field) {
    if (!field) return;

    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMessage = field.parentElement?.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Is in viewport
 */
export function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Lazy load images
 * @param {string} selector - Image selector
 */
export function lazyLoadImages(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Create tooltip element
 * @param {string} text - Tooltip text
 * @param {HTMLElement} target - Target element
 */
export function createTooltip(text, target) {
    if (!text || !target) return null;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: #fff;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        white-space: nowrap;
    `;

    document.body.appendChild(tooltip);

    const rect = target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';

    return tooltip;
}

/**
 * Remove tooltip
 * @param {HTMLElement} tooltip - Tooltip element
 */
export function removeTooltip(tooltip) {
    if (tooltip && tooltip.parentElement) {
        tooltip.remove();
    }
}

export default {
    smoothScroll,
    debounce,
    throttle,
    convertToFormData,
    getNestedValue,
    clearErrorStates,
    toggleLoadingState,
    formatDate,
    validateEmail,
    getCheckedValues,
    getSelectedRadio,
    resetFormFields,
    showFieldError,
    clearFieldError,
    isInViewport,
    lazyLoadImages,
    createTooltip,
    removeTooltip,
};
