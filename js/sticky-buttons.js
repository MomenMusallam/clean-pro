/**
 * ========================================================================
 * SMART STICKY BUTTONS SYSTEM - COMPLETE SOLUTION
 * ========================================================================
 * 
 * Requirements:
 * ✅ Desktop: Buttons responsive in normal position
 * ✅ Mobile Accordion: Sticky buttons at bottom when scrolling
 * ✅ Hide sticky when reaching real buttons
 * ✅ Close accordion = hide buttons
 * ✅ Button sizes: Plus = 1/3, Submit = 2/3
 * ✅ Auto-scroll to added services (BOTH real and sticky)
 * ✅ jQuery CounterUp fix (clean data before clone)
 * ✅ Exact clone of real buttons (dropdown, spinner, all content)
 * 
 * Author: Custom Solution
 * Date: Dec 26, 2024
 * ========================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================
    
    const CONFIG = {
        MOBILE_BREAKPOINT: 992,
        SCROLL_OFFSET: 100,
        SERVICE_SCROLL_DELAY: 600,
        ACCORDION_ANIMATION_DELAY: 450,
        OBSERVER_THRESHOLDS: [0, 0.1, 0.5, 1.0],
        OBSERVER_ROOT_MARGIN: '0px 0px -80px 0px',
        RETRY_ATTEMPTS: 10,
        RETRY_DELAY: 500
    };

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    
    const state = {
        stickyButtonsContainer: null,
        realButtonsElement: null,
        observer: null,
        isAccordionOpen: false,
        realButtonsInitialized: false
    };

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Check if mobile view
     */
    function isMobileView() {
        return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    }

    /**
     * Clean jQuery data and animations (prevents CounterUp errors)
     */
    function cleanJQueryData(element) {
        if (typeof jQuery === 'undefined') return;

        // Clean main element
        jQuery(element).removeData().off().stop(true, true);

        // Clean all children
        jQuery(element).find('*').each(function() {
            jQuery(this).removeData().off().stop(true, true);
        });

        // Remove CounterUp specific data attributes
        jQuery(element).find('[data-counterup-nums]').removeAttr('data-counterup-nums');
        jQuery(element).find('[data-counterup-func]').removeAttr('data-counterup-func');

        console.log('🧹 [Buttons] jQuery data cleaned');
    }

    /**
     * Scroll to service box after adding
     */
    function scrollToServiceBox(boxId, source = 'unknown') {
        if (!isMobileView()) return;

        console.log(`📍 [Buttons/${source}] Scrolling to service: ${boxId}`);

        setTimeout(() => {
            const box = document.getElementById(boxId);
            
            if (!box) {
                console.warn(`⚠️ [Buttons/${source}] Box ${boxId} not found`);
                return;
            }

            const boxRect = box.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = boxRect.top + scrollTop - CONFIG.SCROLL_OFFSET;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });

            console.log(`✅ [Buttons/${source}] Scrolled to position: ${targetPosition}px`);
        }, CONFIG.SERVICE_SCROLL_DELAY);
    }

    // ========================================================================
    // STICKY BUTTONS (Cloned)
    // ========================================================================
    
    /**
     * Remove IDs from cloned elements to avoid duplicates
     */
    function removeIdsFromClone(element) {
        if (element.id) {
            element.setAttribute('data-original-id', element.id);
            element.removeAttribute('id');
        }

        element.querySelectorAll('[id]').forEach(el => {
            el.setAttribute('data-original-id', el.id);
            el.removeAttribute('id');
        });
    }

    /**
     * Initialize Bootstrap dropdown on cloned button
     */
    function initializeClonedComponents() {
        if (typeof bootstrap === 'undefined') return;

        const dropdownButton = state.stickyButtonsContainer.querySelector('[data-bs-toggle="dropdown"]');
        
        if (dropdownButton) {
            new bootstrap.Dropdown(dropdownButton);
            console.log('🔽 [Buttons/Sticky] Dropdown initialized');
        }
    }

    /**
     * Setup click handlers for sticky buttons
     */
    function setupStickyButtonHandlers() {
        // Submit button
        const submitBtn = state.stickyButtonsContainer.querySelector('[data-original-id="SubmitForm"]');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const realSubmitBtn = document.getElementById('SubmitForm');
                if (realSubmitBtn) {
                    realSubmitBtn.click();
                    console.log('✅ [Buttons/Sticky] Submit triggered');
                }
            });
        }

        // Dropdown items - WITH AUTO-SCROLL
        const dropdownItems = state.stickyButtonsContainer.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const boxValue = item.getAttribute('data-value');
                
                // Click real dropdown item
                const realItem = document.querySelector(`.submit-form-btn .dropdown-item[data-value="${boxValue}"]`);
                if (realItem) {
                    realItem.click();
                    console.log(`➕ [Buttons/Sticky] Service added: ${boxValue}`);
                    
                    // AUTO-SCROLL to added service
                    if (boxValue) {
                        scrollToServiceBox(boxValue, 'Sticky');
                    }
                }
                
                // Close dropdown
                const dropdown = state.stickyButtonsContainer.querySelector('[data-bs-toggle="dropdown"]');
                if (dropdown && typeof bootstrap !== 'undefined') {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                    if (bsDropdown) bsDropdown.hide();
                }
            });
        });
    }

    /**
     * Create sticky buttons by cloning real buttons
     */
    function createStickyButtons() {
        if (state.stickyButtonsContainer) return;

        console.log('🔘 [Buttons/Sticky] Creating...');

        const realButtons = document.querySelector('.accordion-panel-mobile .submit-form-btn');
        
        if (!realButtons) {
            console.error('❌ [Buttons/Sticky] Real buttons not found');
            return;
        }

        // Clone and clean
        const clonedButtons = realButtons.cloneNode(true);
        cleanJQueryData(clonedButtons);
        removeIdsFromClone(clonedButtons);
        
        // Create container
        state.stickyButtonsContainer = document.createElement('div');
        state.stickyButtonsContainer.id = 'sticky-submit-buttons';
        state.stickyButtonsContainer.appendChild(clonedButtons);
        document.body.appendChild(state.stickyButtonsContainer);

        // Initialize
        initializeClonedComponents();
        setupStickyButtonHandlers();

        console.log('✅ [Buttons/Sticky] Created and ready');
    }

    /**
     * Show sticky buttons
     */
    function showStickyButtons() {
        if (!state.stickyButtonsContainer || !state.isAccordionOpen) return;
        
        state.stickyButtonsContainer.classList.add('visible');
        state.stickyButtonsContainer.classList.remove('at-real-position');
    }

    /**
     * Hide sticky buttons
     */
    function hideStickyButtons() {
        if (!state.stickyButtonsContainer) return;
        
        state.stickyButtonsContainer.classList.add('at-real-position');
        state.stickyButtonsContainer.classList.remove('visible');
    }

    /**
     * Remove sticky buttons completely
     */
    function removeStickyButtons() {
        if (!state.stickyButtonsContainer) return;

        console.log('🗑️ [Buttons/Sticky] Removing...');
        cleanJQueryData(state.stickyButtonsContainer);
        
        state.stickyButtonsContainer.classList.remove('visible', 'at-real-position');
        
        setTimeout(() => {
            if (state.stickyButtonsContainer && state.stickyButtonsContainer.parentNode) {
                state.stickyButtonsContainer.parentNode.removeChild(state.stickyButtonsContainer);
            }
            state.stickyButtonsContainer = null;
        }, 300);

        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }

        console.log('✅ [Buttons/Sticky] Removed');
    }

    /**
     * Setup Intersection Observer for show/hide logic
     */
    function setupButtonObserver() {
        state.realButtonsElement = document.querySelector('.accordion-panel-mobile .submit-form-btn');
        
        if (!state.realButtonsElement) {
            console.warn('⚠️ [Buttons/Observer] Real buttons not found');
            return;
        }

        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hideStickyButtons(); // Real buttons visible
                } else {
                    showStickyButtons(); // Real buttons not visible
                }
            });
        }, {
            threshold: CONFIG.OBSERVER_THRESHOLDS,
            rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
        });

        state.observer.observe(state.realButtonsElement);
        console.log('👀 [Buttons/Observer] Watching real buttons');
    }

    /**
     * Check initial visibility
     */
    function checkInitialButtonVisibility() {
        if (!state.realButtonsElement) return;

        const rect = state.realButtonsElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top > windowHeight) {
            showStickyButtons();
        } else {
            hideStickyButtons();
        }
    }

    /**
     * Sync dropdown options between real and sticky
     */
    function syncDropdownOptions() {
        if (!state.stickyButtonsContainer) return;

        const realItems = document.querySelectorAll('.submit-form-btn .dropdown-item');
        const stickyItems = state.stickyButtonsContainer.querySelectorAll('.dropdown-item');

        realItems.forEach((realItem, index) => {
            const stickyItem = stickyItems[index];
            if (stickyItem) {
                stickyItem.style.display = realItem.style.display;
                
                if (realItem.classList.contains('disabled')) {
                    stickyItem.classList.add('disabled');
                } else {
                    stickyItem.classList.remove('disabled');
                }
            }
        });
    }

    // ========================================================================
    // REAL ACCORDION BUTTONS
    // ========================================================================
    
    /**
     * Setup scroll behavior on real accordion buttons
     */
    function setupRealButtonsScroll() {
        const dropdownMenu = document.querySelector('.accordion-panel-mobile .submit-form-btn .dropdown-menu');
        
        if (!dropdownMenu) {
            return false;
        }

        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        
        if (!dropdownItems || dropdownItems.length === 0) {
            return false;
        }

        console.log(`🔧 [Buttons/Real] Found ${dropdownItems.length} dropdown items`);

        // Add click listeners
        dropdownItems.forEach(item => {
            if (item.hasAttribute('data-scroll-listener')) {
                return; // Already added
            }

            item.setAttribute('data-scroll-listener', 'true');

            item.addEventListener('click', function() {
                const boxValue = this.getAttribute('data-value');
                
                if (boxValue) {
                    console.log(`➕ [Buttons/Real] Service added: ${boxValue}`);
                    scrollToServiceBox(boxValue, 'Real');
                }
            });
        });

        console.log('✅ [Buttons/Real] Scroll listeners added');
        state.realButtonsInitialized = true;
        return true;
    }

    /**
     * Initialize real buttons with retry
     */
    function initRealButtons() {
        let attempts = 0;
        
        const trySetup = () => {
            attempts++;
            
            if (setupRealButtonsScroll()) {
                return;
            }

            if (attempts < CONFIG.RETRY_ATTEMPTS) {
                console.log(`🔄 [Buttons/Real] Retry ${attempts}/${CONFIG.RETRY_ATTEMPTS}...`);
                setTimeout(trySetup, CONFIG.RETRY_DELAY);
            }
        };

        trySetup();
    }

    // ========================================================================
    // ACCORDION LIFECYCLE
    // ========================================================================
    
    /**
     * Handle accordion open
     */
    function onAccordionOpen() {
        if (!isMobileView()) return;

        console.log('📂 [Buttons] Accordion opened');
        state.isAccordionOpen = true;

        setTimeout(() => {
            // Create sticky buttons
            createStickyButtons();
            
            // Initialize real buttons if not already done
            if (!state.realButtonsInitialized) {
                initRealButtons();
            }
            
            // Sync and setup observer
            setTimeout(() => {
                syncDropdownOptions();
                setupButtonObserver();
                checkInitialButtonVisibility();
            }, 200);
            
        }, CONFIG.ACCORDION_ANIMATION_DELAY);
    }

    /**
     * Handle accordion close
     */
    function onAccordionClose() {
        console.log('📁 [Buttons] Accordion closed');
        state.isAccordionOpen = false;
        state.realButtonsInitialized = false;
        removeStickyButtons();
    }

    /**
     * Monitor accordion state changes
     */
    function monitorAccordion() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(navItem => {
            const navLink = navItem.querySelector('.nav-link');
            if (!navLink) return;

            navLink.addEventListener('click', () => {
                if (!isMobileView()) return;

                setTimeout(() => {
                    const isActive = navItem.classList.contains('accordion-active');
                    
                    if (isActive) {
                        onAccordionOpen();
                    } else {
                        onAccordionClose();
                    }
                }, 100);
            });
        });
    }

    /**
     * Monitor dropdown changes for syncing
     */
    function monitorDropdownChanges() {
        const dropdownMenu = document.querySelector('.submit-form-btn .dropdown-menu');
        
        if (dropdownMenu && typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                if (isMobileView() && state.isAccordionOpen) {
                    syncDropdownOptions();
                    
                    // Re-setup real buttons if needed
                    if (!state.realButtonsInitialized) {
                        setupRealButtonsScroll();
                    }
                }
            });

            observer.observe(dropdownMenu, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    }

    /**
     * Monitor accordion panel changes
     */
    function monitorAccordionPanel() {
        const container = document.querySelector('.tabs-sidebar');
        
        if (container && typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                if (isMobileView() && state.isAccordionOpen && !state.realButtonsInitialized) {
                    setupRealButtonsScroll();
                }
            });

            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    // ========================================================================
    // RESPONSIVE HANDLING
    // ========================================================================
    
    /**
     * Handle window resize
     */
    function handleResize() {
        if (!isMobileView() && state.stickyButtonsContainer) {
            removeStickyButtons();
            state.isAccordionOpen = false;
            state.realButtonsInitialized = false;
        }
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    /**
     * Initialize the complete button system
     */
    function init() {
        console.log('🚀 [Buttons] Initializing complete system...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSystem);
        } else {
            initSystem();
        }
    }

    function initSystem() {
        setTimeout(() => {
            monitorAccordion();
            monitorDropdownChanges();
            monitorAccordionPanel();

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(handleResize, 250);
            });

            console.log('✅ [Buttons] System ready');
            console.log('📋 [Buttons] Features:');
            console.log('  ✅ Sticky buttons (1/3 + 2/3)');
            console.log('  ✅ Auto-scroll to services (Real + Sticky)');
            console.log('  ✅ Show/hide on scroll');
            console.log('  ✅ jQuery CounterUp safe');
            console.log('  ✅ Exact clones with all functionality');
        }, 600);
    }

    // Start the system
    init();

})();