/**
 * UI Interactions Module - RESPONSIVE SCROLL VERSION
 * Handles all UI-related interactions with proper tab management
 * FIXED: Desktop uses container scroll, Mobile uses page scroll
 */

import { smoothScroll, createTooltip, removeTooltip } from './utils.js';

/**
 * UI Manager class
 */
export class UIManager {
    constructor() {
        this.activeTab = 'normal-cleaning';
        this.tooltips = new Map();
    }

    /**
     * Check if we're in mobile accordion mode
     */
    isMobileAccordionMode() {
        return window.innerWidth <= 992;
    }

    /**
     * Switch to specific tab
     * @param {string} tabName - Tab name to switch to
     */
    switchTab(tabName) {
        console.log('UIManager: Switching to tab:', tabName);
        
        // Update active button state
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Update active tab
        this.activeTab = tabName;
    }

    /**
     * Setup counter buttons
     */
    setupCounters() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-plus') || e.target.closest('.btn-plus')) {
                const button = e.target.classList.contains('btn-plus') ? e.target : e.target.closest('.btn-plus');
                this.incrementCounter(button);
            } else if (e.target.classList.contains('btn-minus') || e.target.closest('.btn-minus')) {
                const button = e.target.classList.contains('btn-minus') ? e.target : e.target.closest('.btn-minus');
                this.decrementCounter(button);
            }
        });
    }

    /**
     * Increment counter value
     * @param {HTMLElement} button - Plus button element
     */
    incrementCounter(button) {
        const counterBox = button.closest('.counter-box');
        if (!counterBox) return;

        const input = counterBox.querySelector('.counter-input, input[type="number"]');
        if (!input) return;

        const currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
        
        // Trigger input event for data collection
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Visual feedback
        input.style.borderColor = '#3ca200';
    }

    /**
     * Decrement counter value
     * @param {HTMLElement} button - Minus button element
     */
    decrementCounter(button) {
        const counterBox = button.closest('.counter-box');
        if (!counterBox) return;

        const input = counterBox.querySelector('.counter-input, input[type="number"]');
        if (!input) return;

        const currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
            input.value = currentValue - 1;
            
            // Trigger input event for data collection
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    /**
     * Setup image selection
     */
    setupImageSelection() {
        const thumbnails = document.querySelectorAll('.thumbnails img');
        
        thumbnails.forEach(img => {
            img.addEventListener('click', () => {
                thumbnails.forEach(i => i.classList.remove('selected-thumb'));
                img.classList.add('selected-thumb');
            });
        });
    }

    /**
     * Setup tooltips for labels
     */
    setupTooltips() {
        document.querySelectorAll('.cleaning-request label[data-full-text]').forEach(label => {
            label.addEventListener('mouseenter', (e) => {
                const text = label.getAttribute('data-full-text');
                if (text && !this.tooltips.has(label)) {
                    const tooltip = createTooltip(text, label);
                    this.tooltips.set(label, tooltip);
                }
            });

            label.addEventListener('mouseleave', () => {
                const tooltip = this.tooltips.get(label);
                if (tooltip) {
                    removeTooltip(tooltip);
                    this.tooltips.delete(label);
                }
            });
        });
    }

    /**
     * Setup dropdown box management
     */
    setupDropdownBoxes() {
        const dropdownItems = document.querySelectorAll('.dropdown-item:not(.disabled)');
        const boxes = document.getElementById('boxes');

        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showBox(item.dataset.value);
            });
        });

        // Setup remove buttons
        if (boxes) {
            boxes.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.btn-remove, .btn-remove-svg');
                if (removeBtn) {
                    const box = removeBtn.closest('[id^="box-"]');
                    if (box) {
                        this.hideBox(box.id);
                    }
                }
            });
        }
    }

    /**
     * Show specific box
     * @param {string} boxId - Box ID to show
     */
    showBox(boxId) {
        const box = document.getElementById(boxId);
        if (!box) return;

        // Show box
        box.classList.remove('hidden');

        // Disable dropdown item
        const dropdownItem = document.querySelector(`.dropdown-item[data-value="${boxId}"]`);
        if (dropdownItem) {
            dropdownItem.classList.add('disabled');
            dropdownItem.style.pointerEvents = 'none';
        }

        // Open accordion
        const accordion = box.querySelector('.accordion-collapse');
        if (accordion && typeof bootstrap !== 'undefined') {
            setTimeout(() => {
                const bsCollapse = new bootstrap.Collapse(accordion, { toggle: false });
                bsCollapse.show();
                
                // Scroll to box
                const container = document.querySelector('.container-tabs2-section');
                if (container) {
                    setTimeout(() => smoothScroll(container, box, 800), 100);
                }
            }, 100);
        }
    }

    /**
     * Hide specific box
     * @param {string} boxId - Box ID to hide
     */
    hideBox(boxId) {
        const box = document.getElementById(boxId);
        if (!box) return;

        // Hide accordion first
        const accordion = box.querySelector('.accordion-collapse');
        if (accordion && accordion._bsInstance) {
            accordion._bsInstance.hide();
        }

        // Hide box
        setTimeout(() => {
            box.classList.add('hidden');
        }, 300);

        // Re-enable dropdown item
        const dropdownItem = document.querySelector(`.dropdown-item[data-value="${boxId}"]`);
        if (dropdownItem) {
            dropdownItem.classList.remove('disabled');
            dropdownItem.style.pointerEvents = 'auto';
        }
    }

    /**
     * Setup accordion behaviors
     */
    setupAccordions() {
        // Auto-open first accordion on load
        const firstAccordion = document.querySelector('.accordion-item:first-child .accordion-collapse');
        if (firstAccordion && typeof bootstrap !== 'undefined') {
            const collapse = new bootstrap.Collapse(firstAccordion, { toggle: false });
            collapse.show();
        }
    }

    /**
     * Scroll to first error - RESPONSIVE VERSION
     * Desktop: Scroll within container
     * Mobile: Scroll the page
     * @param {HTMLElement} errorElement - First error element
     */
    scrollToError(errorElement) {
        if (!errorElement) return;

        console.log('📍 [UIManager] Scrolling to error element:', errorElement);

        if (this.isMobileAccordionMode()) {
            // MOBILE ACCORDION MODE - Scroll the PAGE
            console.log('📱 [UIManager] Mobile mode - scrolling page');
            
            const elementRect = errorElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Calculate target position with offset from top
            const targetPosition = elementRect.top + scrollTop - 100; // 100px offset

            // Smooth scroll the PAGE
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });

            console.log(`✅ [UIManager] Page scrolled to position: ${targetPosition}px`);
        } else {
            // DESKTOP MODE - Scroll within CONTAINER
            console.log('🖥️ [UIManager] Desktop mode - scrolling container');
            
            const container = document.querySelector('.container-tabs2-section');
            if (container) {
                // Use the smoothScroll utility function
                smoothScroll(container, errorElement, 800);
                console.log('✅ [UIManager] Container scrolled to error');
            } else {
                // Fallback: scroll page if container not found
                console.warn('⚠️ [UIManager] Container not found, using page scroll');
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Flash the error element
        this.flashErrorElement(errorElement);
    }

    /**
     * Flash error element to draw attention
     * @param {HTMLElement} element - Element to flash
     */
    flashErrorElement(element) {
        // Add visual feedback
        const originalBorder = element.style.borderColor;
        const originalBg = element.style.backgroundColor;
        
        element.style.transition = 'all 0.3s ease';
        element.style.borderColor = '#dc3545';
        element.style.backgroundColor = '#fff5f5';
        
        setTimeout(() => {
            element.style.borderColor = originalBorder;
            element.style.backgroundColor = originalBg;
        }, 2000);
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        // Create custom success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <div>
                    <p style="margin: 0;">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Create custom error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                    <strong style="display: block; margin-bottom: 4px;">Error!</strong>
                    <p style="margin: 0;">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Get active tab name
     * @returns {string} Active tab name
     */
    getActiveTab() {
        return this.activeTab;
    }

    /**
     * Initialize all UI interactions
     */
    initialize() {
        console.log('UIManager: Initializing...');
        
        this.setupCounters();
        this.setupImageSelection();
        this.setupTooltips();
        this.setupDropdownBoxes();
        this.setupAccordions();
        
        // Add CSS animations
        this.addAnimationStyles();
        
        console.log('UIManager: Initialized with active tab:', this.activeTab);
    }

    /**
     * Add CSS animation styles
     */
    addAnimationStyles() {
        if (document.getElementById('ui-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'ui-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .tab-section {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Create singleton instance
 */
export const uiManager = new UIManager();

export default UIManager;