/**
 * Error Handler Module
 * Provides comprehensive error handling, user-friendly messages, and recovery suggestions
 */

import { uiManager } from './uiManager.js';
import {FormConfig} from './config.js';

/**
 * Error severity levels
 */
export const ErrorSeverity = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

/**
 * Error types
 */
export const ErrorType = {
    VALIDATION: 'validation',
    NETWORK: 'network',
    SERVER: 'server',
    CLIENT: 'client',
    AUTHENTICATION: 'authentication',
    FILE_UPLOAD: 'file_upload',
    BROWSER: 'browser'
};

/**
 * Error Handler class
 */
export class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 50;
        this.userMessages = new Map();
        this.setupGlobalErrorHandling();
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Handle unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: ErrorType.CLIENT,
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                severity: ErrorSeverity.HIGH
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: ErrorType.CLIENT,
                message: 'Unhandled promise rejection',
                error: event.reason,
                severity: ErrorSeverity.HIGH
            });
            
            // Prevent the default console error
            event.preventDefault();
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            this.handleError({
                type: ErrorType.NETWORK,
                message: 'Internet connection lost',
                severity: ErrorSeverity.MEDIUM,
                userMessage: 'You appear to be offline. Please check your internet connection.',
                recoverable: true
            });
        });

        window.addEventListener('online', () => {
            this.showSuccess('Internet connection restored');
        });
    }

    /**
     * Handle any error with proper categorization and user feedback
     * @param {Object|Error} error - Error object or error details
     */
    handleError(error) {
        const processedError = this.processError(error);
        this.logError(processedError);
        this.showErrorToUser(processedError);
        
        // Report critical errors
        if (processedError.severity === ErrorSeverity.CRITICAL) {
            this.reportCriticalError(processedError);
        }
        
        return processedError;
    }

    /**
     * Process and categorize error
     * @param {Object|Error} error - Raw error
     * @returns {Object} Processed error
     */
    processError(error) {
        const processed = {
            id: this.generateErrorId(),
            timestamp: Date.now(),
            type: error.type || this.detectErrorType(error),
            severity: error.severity || this.detectSeverity(error),
            message: error.message || 'Unknown error',
            userMessage: error.userMessage || this.getUserFriendlyMessage(error),
            recoverable: error.recoverable !== undefined ? error.recoverable : this.isRecoverable(error),
            context: this.getErrorContext(error),
            suggestions: error.suggestions || this.getRecoverySuggestions(error),
            technical: {
                stack: error.stack || (error.error && error.error.stack),
                filename: error.filename,
                lineno: error.lineno,
                colno: error.colno,
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        };

        return processed;
    }

    /**
     * Detect error type from error object
     * @param {Object|Error} error - Error object
     * @returns {string} Error type
     */
    detectErrorType(error) {
        const message = error.message || '';
        const status = error.status || error.code || 0;

        if (status === 401 || status === 403) {
            return ErrorType.AUTHENTICATION;
        }

        if (status >= 500) {
            return ErrorType.SERVER;
        }

        if (status >= 400 && status < 500) {
            return ErrorType.CLIENT;
        }

        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
            return ErrorType.NETWORK;
        }

        if (message.includes('validation') || error.errors) {
            return ErrorType.VALIDATION;
        }

        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            return ErrorType.CLIENT;
        }

        return ErrorType.CLIENT;
    }

    /**
     * Detect error severity
     * @param {Object|Error} error - Error object
     * @returns {string} Severity level
     */
    detectSeverity(error) {
        const status = error.status || 0;
        const type = error.type || this.detectErrorType(error);

        if (type === ErrorType.AUTHENTICATION || status === 500) {
            return ErrorSeverity.HIGH;
        }

        if (type === ErrorType.VALIDATION || status === 422) {
            return ErrorSeverity.LOW;
        }

        if (type === ErrorType.NETWORK || status === 503) {
            return ErrorSeverity.MEDIUM;
        }

        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            return ErrorSeverity.HIGH;
        }

        return ErrorSeverity.MEDIUM;
    }

    /**
     * Get user-friendly error message
     * @param {Object|Error} error - Error object
     * @returns {string} User-friendly message
     */
    getUserFriendlyMessage(error) {
        const type = error.type || this.detectErrorType(error);
        const status = error.status || 0;

        const messages = {
            [ErrorType.NETWORK]: 'Connection problem. Please check your internet and try again.',
            [ErrorType.VALIDATION]: 'Please check your input and fix any highlighted errors.',
            [ErrorType.AUTHENTICATION]: 'Your session has expired. Please refresh the page.',
            [ErrorType.FILE_UPLOAD]: 'There was a problem uploading your files. Please try again.',
            [ErrorType.SERVER]: 'Server error. Please try again in a few moments.',
            [ErrorType.CLIENT]: 'Something went wrong. Please refresh the page and try again.'
        };

        if (status === 413) {
            return 'One or more files are too large. Please reduce file sizes and try again.';
        }

        if (status === 422) {
            return 'Please check your input. Some fields contain invalid information.';
        }

        if (status === 429) {
            return 'Too many requests. Please wait a moment and try again.';
        }

        return messages[type] || 'An unexpected error occurred. Please try again.';
    }

    /**
     * Check if error is recoverable
     * @param {Object|Error} error - Error object
     * @returns {boolean} Is recoverable
     */
    isRecoverable(error) {
        const type = error.type || this.detectErrorType(error);
        const status = error.status || 0;

        // Network errors are usually recoverable
        if (type === ErrorType.NETWORK) return true;

        // Validation errors are recoverable
        if (type === ErrorType.VALIDATION) return true;

        // File upload errors are recoverable
        if (type === ErrorType.FILE_UPLOAD) return true;

        // Server errors might be recoverable
        if (status >= 500 && status < 600) return true;

        // Rate limiting is recoverable
        if (status === 429) return true;

        return false;
    }

    /**
     * Get error context information
     * @param {Object|Error} error - Error object
     * @returns {Object} Context information
     */
    getErrorContext(error) {
        return {
            formTab: document.querySelector('.tab-section:not([style*="display: none"])')?.dataset.tab,
            activeElement: document.activeElement?.id || document.activeElement?.name,
            formData: this.getFormDataSummary(),
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                cookiesEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            }
        };
    }

    /**
     * Get form data summary for context
     * @returns {Object} Form data summary
     */
    getFormDataSummary() {
        const filledFields = [];
        const emptyRequiredFields = [];

        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.value && field.value.trim() !== '' && field.value !== '0') {
                filledFields.push(field.id || field.name);
            }
            
            if (field.hasAttribute('required') && (!field.value || field.value.trim() === '' || field.value === '0')) {
                emptyRequiredFields.push(field.id || field.name);
            }
        });

        return {
            filledFieldsCount: filledFields.length,
            emptyRequiredFieldsCount: emptyRequiredFields.length,
            hasFiles: document.querySelectorAll('input[type="file"]').length > 0
        };
    }

    /**
     * Get recovery suggestions
     * @param {Object|Error} error - Error object
     * @returns {Array} Recovery suggestions
     */
    getRecoverySuggestions(error) {
        const type = error.type || this.detectErrorType(error);
        const suggestions = [];

        switch (type) {
            case ErrorType.NETWORK:
                suggestions.push('Check your internet connection');
                suggestions.push('Try refreshing the page');
                suggestions.push('Disable any VPN or proxy');
                break;

            case ErrorType.VALIDATION:
                suggestions.push('Check all required fields are filled');
                suggestions.push('Verify email addresses are correct');
                suggestions.push('Ensure numbers are positive');
                break;

            case ErrorType.FILE_UPLOAD:
                suggestions.push('Check file sizes (max 5MB each)');
                suggestions.push('Use supported formats (JPG, PNG, GIF, WebP)');
                suggestions.push('Try uploading fewer files at once');
                break;

            case ErrorType.AUTHENTICATION:
                suggestions.push('Refresh the page');
                suggestions.push('Clear browser cache and cookies');
                break;

            case ErrorType.SERVER:
                suggestions.push('Wait a few moments and try again');
                suggestions.push('Check our status page for updates');
                suggestions.push('Contact support if problem persists');
                break;

            default:
                suggestions.push('Try refreshing the page');
                suggestions.push('Clear browser cache');
                suggestions.push('Try in a different browser');
        }

        return suggestions;
    }

    /**
     * Show error to user with appropriate UI
     * @param {Object} error - Processed error
     */
    showErrorToUser(error) {
        if (error.severity === ErrorSeverity.LOW) {
            this.showInlineError(error);
        } else {
            this.showModalError(error);
        }
    }

    /**
     * Show inline error for validation issues
     * @param {Object} error - Error object
     */
    showInlineError(error) {
        if (error.type === ErrorType.VALIDATION && error.context?.activeElement) {
            const field = document.getElementById(error.context.activeElement);
            if (field) {
                this.showFieldError(field, error.userMessage);
                return;
            }
        }

        // Fallback to notification
        uiManager.showError(error.userMessage);
    }

    /**
     * Show modal error for serious issues
     * @param {Object} error - Error object
     */
    showModalError(error) {
        const modal = this.createErrorModal(error);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    /**
     * Create error modal
     * @param {Object} error - Error object
     * @returns {HTMLElement} Modal element
     */
    createErrorModal(error) {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 500px;
            margin: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        `;

        content.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="color: #f44336; margin-right: 12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                    </svg>
                </div>
                <h3 style="margin: 0; color: #333;">Something went wrong</h3>
            </div>
            
            <p style="margin: 0 0 16px 0; color: #666; line-height: 1.5;">
                ${error.userMessage}
            </p>
            
            ${error.suggestions.length > 0 ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Try these solutions:</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                        ${error.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                ${error.recoverable ? `
                    <button class="retry-btn" style="
                        background: #3ca200;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Try Again</button>
                ` : ''}
                
                <button class="close-btn" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Close</button>
            </div>
            
            <details style="margin-top: 16px;">
                <summary style="cursor: pointer; font-size: 12px; color: #999;">
                    Technical details (Error ID: ${error.id})
                </summary>
                <pre style="
                    background: #f5f5f5;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    color: #666;
                    overflow: auto;
                    max-height: 100px;
                    margin-top: 8px;
                ">${JSON.stringify(error, null, 2)}</pre>
            </details>
        `;

        // Event handlers
        content.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal(modal);
        });

        const retryBtn = content.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.closeModal(modal);
                this.retryLastAction(error);
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        modal.appendChild(content);
        return modal;
    }

    /**
     * Close error modal
     * @param {HTMLElement} modal - Modal element
     */
    closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    /**
     * Show field-specific error
     * @param {HTMLElement} field - Field element
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.add('error-sign');
                field.classList.remove('success-sign');

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-sign');
        if (existingError) existingError.remove();
        
        // // Add new error message
        // const errorDiv = document.createElement('div');
        // errorDiv.className = 'field-error-message';
        // errorDiv.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 4px;';
        // errorDiv.textContent = message;
        
        // field.parentElement.appendChild(errorDiv);
        
        // // Auto-remove on input
        // const removeError = () => {
        //     field.classList.remove('error');
        //     if (errorDiv.parentNode) errorDiv.remove();
        //     field.removeEventListener('input', removeError);
        // };
        
        // field.addEventListener('input', removeError);
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        if (uiManager && uiManager.showSuccess) {
            uiManager.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }

    /**
     * Log error to internal log
     * @param {Object} error - Processed error
     */
    logError(error) {
        this.errorLog.unshift(error);
        
        // Keep log size manageable
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }
        
        console.error('Form Error:', error);
    }

    /**
     * Report critical error (could be sent to monitoring service)
     * @param {Object} error - Critical error
     */
    reportCriticalError(error) {
        // In production, this would send to error monitoring service
        console.error('CRITICAL ERROR:', error);
        
        // Store in localStorage for debugging
        try {
            const criticalErrors = JSON.parse(localStorage.getItem('form_critical_errors') || '[]');
            criticalErrors.unshift(error);
            localStorage.setItem('form_critical_errors', JSON.stringify(criticalErrors.slice(0, 10)));
        } catch (e) {
            // Ignore storage errors
        }
    }

    /**
     * Retry last action
     * @param {Object} error - Error context
     */
    retryLastAction(error) {
        // This would need to be integrated with the specific action that failed
        console.log('Retrying action for error:', error.id);
        
        // For now, just trigger a form validation
        const submitBtn = document.getElementById('SubmitForm');
        if (submitBtn) {
            submitBtn.click();
        }
    }

    /**
     * Generate unique error ID
     * @returns {string} Error ID
     */
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get error statistics for debugging
     * @returns {Object} Error statistics
     */
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            bySeverity: {},
            recent: this.errorLog.slice(0, 10)
        };

        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
        });

        return stats;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
        localStorage.removeItem('form_critical_errors');
        console.log('Error log cleared');
    }
}

/**
 * Create singleton instance
 */
export const errorHandler = new ErrorHandler();

/**
 * Convenient error handling functions
 */

/**
 * Handle validation error
 * @param {Object} errors - Validation errors
 * @param {HTMLElement} firstErrorField - First field with error
 */
export function handleValidationError(errors, firstErrorField = null) {
    errorHandler.handleError({
        type: ErrorType.VALIDATION,
        message: 'Validation failed',
        errors: errors,
        severity: ErrorSeverity.LOW,
        context: { activeElement: firstErrorField?.id }
    });
}

/**
 * Handle network error
 * @param {Error} networkError - Network error
 */
export function handleNetworkError(networkError) {
    errorHandler.handleError({
        type: ErrorType.NETWORK,
        error: networkError,
        recoverable: true
    });
}

/**
 * Handle API error
 * @param {Object} apiResponse - API error response
 */
export function handleApiError(apiResponse) {
    errorHandler.handleError({
        type: apiResponse.status >= 500 ? ErrorType.SERVER : ErrorType.CLIENT,
        message: apiResponse.error,
        status: apiResponse.status,
        errors: apiResponse.errors,
        recoverable: apiResponse.status >= 500 || apiResponse.status === 429
    });
}

export default {
    ErrorHandler,
    errorHandler,
    ErrorSeverity,
    ErrorType,
    handleValidationError,
    handleNetworkError,
    handleApiError
};