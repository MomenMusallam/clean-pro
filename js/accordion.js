/**
 * ACCORDION HANDLER - FIXED VERSION
 * 
 * Features:
 * - All tabs start CLOSED on mobile (users see all services)
 * - Can CLOSE active tab by clicking it again
 * - Shows the ORIGINAL form section in accordion (NO CLONING!)
 * - Works perfectly with responsive ScrollSmoother
 * - form.js handles EVERYTHING else
 */

(function() {
    'use strict';

    const MOBILE_BREAKPOINT = 992;
    let isAccordionMode = false;
    let formSection = null;
    let originalParent = null;

    /**
     * Check if mobile view
     */
    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    /**
     * Initialize accordion on mobile - ALL TABS CLOSED
     */
    function initAccordion() {
        if (isAccordionMode) return;

        console.log('🎯 [Accordion] Initializing mobile accordion...');
        
        const navItems = document.querySelectorAll('.nav-item');

        // Get the original form section
        formSection = document.querySelector('.container-tabs2-section');
        if (!formSection) {
            console.error('❌ [Accordion] Form section not found');
            return;
        }

        // Store original parent
        originalParent = formSection.parentElement;

        // IMPORTANT: Start with ALL tabs CLOSED
        navItems.forEach((navItem) => {
            const navLink = navItem.querySelector('.nav-link');
            if (!navLink) return;

            // Remove all active states
            navItem.classList.remove('accordion-active');
            navLink.classList.remove('active');
            
            // Remove any existing panels
            const existingPanel = navItem.querySelector('.accordion-panel-mobile');
            if (existingPanel) {
                existingPanel.remove();
            }
        });

        // Hide the form section initially (it will appear when user clicks a tab)
        if (formSection && originalParent) {
            formSection.style.display = 'none';
        }

        isAccordionMode = true;
        console.log('✅ [Accordion] Accordion initialized - ALL TABS CLOSED (users see all services)');
    }

    /**
     * Move original form section to accordion panel
     */
    function moveFormToAccordion(navItem) {
        // Show the form section
        if (formSection) {
            formSection.style.display = 'block';
        }

        // Create panel if doesn't exist
        let accordionPanel = navItem.querySelector('.accordion-panel-mobile');
        
        if (!accordionPanel) {
            accordionPanel = document.createElement('div');
            accordionPanel.className = 'accordion-panel-mobile';
            navItem.appendChild(accordionPanel);
        }

        // Move the ORIGINAL form section (not clone!)
        accordionPanel.innerHTML = '';
        accordionPanel.appendChild(formSection);

        // Force a reflow to ensure proper height calculation
        requestAnimationFrame(() => {
            accordionPanel.style.maxHeight = 'none';
        });
    }

    /**
     * Hide form section (when all tabs are closed)
     */
    function hideFormSection() {
        if (formSection) {
            formSection.style.display = 'none';
        }
    }

    /**
     * Destroy accordion and restore form to original position
     */
    function destroyAccordion() {
        if (!isAccordionMode) return;

        console.log('🔄 [Accordion] Removing accordion...');

        // Show the form section again
        if (formSection) {
            formSection.style.display = 'block';
        }

        // Move form section back to original parent
        if (formSection && originalParent) {
            originalParent.appendChild(formSection);
        }

        // Remove accordion panels
        const accordionPanels = document.querySelectorAll('.accordion-panel-mobile');
        accordionPanels.forEach(panel => panel.remove());

        // Remove active states
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('accordion-active'));

        // Reset any inline styles that might have been added
        if (formSection) {
            formSection.style.cssText = '';
        }

        isAccordionMode = false;
        console.log('✅ [Accordion] Accordion removed');
    }

    /**
     * Handle accordion button clicks - CAN CLOSE ACTIVE TAB
     */
    function handleAccordionClick(event) {
        if (!isMobileView()) return;

        const navLink = event.currentTarget;
        const navItem = navLink.closest('.nav-item');
        const clickedTabId = navLink.getAttribute('data-tab');

        console.log(`🖱️ [Accordion] Clicked: ${clickedTabId}`);

        // Check if this tab is currently active
        const isCurrentlyActive = navItem.classList.contains('accordion-active');

        // Close all accordions first
        const allNavItems = document.querySelectorAll('.nav-item');
        allNavItems.forEach(item => {
            item.classList.remove('accordion-active');
        });

        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });

        // If this tab was already active, close it (don't reopen)
        if (isCurrentlyActive) {
            console.log(`➖ [Accordion] Closed: ${clickedTabId}`);
            hideFormSection();
            
            // Scroll to the closed accordion button
            setTimeout(() => {
                const navItemRect = navItem.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = navItemRect.top + scrollTop - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 150);
            
            return; // Exit - don't open anything
        }

        // If it wasn't active, open it
        navItem.classList.add('accordion-active');
        navLink.classList.add('active');

        // Move form section to this accordion
        moveFormToAccordion(navItem);

        // Trigger the original tab button click (form.js handles tab switching)
        const originalTabButton = document.querySelector(`button[data-tab="${clickedTabId}"]`);
        if (originalTabButton && originalTabButton !== navLink) {
            originalTabButton.click();
        }

        // Smooth scroll to accordion with proper delay
        setTimeout(() => {
            const navItemRect = navItem.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = navItemRect.top + scrollTop - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }, 150);

        console.log(`✅ [Accordion] Opened: ${clickedTabId}`);
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        const nowMobile = isMobileView();

        if (nowMobile && !isAccordionMode) {
            // Switching to mobile
            setTimeout(() => {
                initAccordion();
            }, 100); // Small delay to let ScrollSmoother cleanup
        } else if (!nowMobile && isAccordionMode) {
            // Switching to desktop
            destroyAccordion();
        }
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleAccordionClick);
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 350);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 400);
        });
    }

    /**
     * Wait for form.js to initialize
     */
    function waitForFormInit() {
        return new Promise((resolve) => {
            if (window.CleaningFormApp && window.CleaningFormApp.initialized) {
                resolve();
                return;
            }

            document.addEventListener('formAppInitialized', () => {
                resolve();
            });

            setTimeout(resolve, 2000);
        });
    }

    /**
     * Initialize accordion system
     */
    async function init() {
        console.log('🚀 [Accordion] Starting...');

        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        console.log('⏳ [Accordion] Waiting for form.js...');
        await waitForFormInit();
        console.log('✅ [Accordion] form.js ready');

        // Wait a bit for ScrollSmoother to initialize/destroy
        setTimeout(() => {
            if (isMobileView()) {
                console.log('📱 [Accordion] Mobile - showing accordion (ALL TABS CLOSED)');
                initAccordion();
            } else {
                console.log('🖥️ [Accordion] Desktop - normal view');
            }

            initEventListeners();
            console.log('✅ [Accordion] Ready - Users can see all service types!');
        }, 300);
    }

    init();

})();