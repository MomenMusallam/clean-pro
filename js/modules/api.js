/**
 * Enhanced API Communication Module
 * Handles all API requests with retry logic, error handling, and response processing
 */

import { convertToFormData } from "./utils.js";
import { FormConfig } from "./config.js";

/**
 * Enhanced API handler class with retry logic and better error handling
 */
export class ApiHandler {
    constructor() {
        this.baseUrl = FormConfig.api.routeUrl;
        this.csrfToken = FormConfig.api.csrfToken;
        this.timeout = FormConfig.api.timeout || 30000;
        this.retryAttempts = FormConfig.api.retryAttempts || 3;
        this.retryDelay = 1000; // Start with 1 second delay
    }

    /**
     * Submit form data with retry logic
     * @param {Object} data - Form data to submit
     * @returns {Promise} API response
     */
    async submitForm(data) {
        if (!this.csrfToken) {
            throw new Error("CSRF token not found. Please refresh the page.");
        }

        const formData = this.prepareFormData(data);

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.makeRequest(formData, attempt);

                if (!response.ok) {
                    const errorData = await this.handleErrorResponse(response);

                    // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
                    if (response.status >= 400 && response.status < 500) {
                        throw errorData;
                    }

                    // Retry on server errors if we have attempts left
                    if (attempt < this.retryAttempts) {
                        console.warn(
                            `Attempt ${attempt} failed with status ${response.status}, retrying...`
                        );
                        await this.delay(this.retryDelay * attempt); // Exponential backoff
                        continue;
                    }

                    throw errorData;
                }

                return await this.processSuccessResponse(response);
            } catch (error) {
                console.error(`API attempt ${attempt} failed:`, error);

                // If it's a network error and we have attempts left, retry
                if (
                    this.isNetworkError(error) &&
                    attempt < this.retryAttempts
                ) {
                    console.warn(
                        `Network error on attempt ${attempt}, retrying...`
                    );
                    await this.delay(this.retryDelay * attempt);
                    continue;
                }

                throw this.formatError(error, attempt);
            }
        }
    }

    /**
     * Make the actual HTTP request
     * @param {FormData} formData - Prepared form data
     * @param {number} attempt - Current attempt number
     * @returns {Promise<Response>} Fetch response
     */
    async makeRequest(formData, attempt) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": this.csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === "AbortError") {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }

            throw error;
        }
    }

    /**
     * Prepare form data for submission
     * @param {Object} data - Raw form data
     * @returns {FormData} Prepared FormData object
     */
    prepareFormData(data) {
        // Add metadata
        const enrichedData = {
            ...data,
            _timestamp: Date.now(),
            _locale: FormConfig.locale.current,
            _version: "1.0",
        };

        return convertToFormData(enrichedData);
    }

    /**
     * Process successful response
     * @param {Response} response - Fetch response
     * @returns {Object} Processed response data
     */
    async processSuccessResponse(response) {
        try {
            const data = await response.json();

            return {
                success: true,
                data: data,
                status: response.status,
                timestamp: Date.now(),
            };
        } catch (error) {
            console.warn("Response is not valid JSON:", error);

            return {
                success: true,
                data: { message: "Request completed successfully" },
                status: response.status,
                timestamp: Date.now(),
            };
        }
    }

    /**
     * Handle error response from server
     * @param {Response} response - Failed response
     * @returns {Object} Error details
     */
    async handleErrorResponse(response) {
        const status = response.status;
        let errorData = {
            status,
            message: this.getStatusMessage(status),
            errors: {},
            timestamp: Date.now(),
        };

        try {
            const responseData = await response.json();

            errorData = {
                ...errorData,
                message: responseData.message || errorData.message,
                errors: responseData.errors || {},
                details: responseData.details,
            };
        } catch (parseError) {
            console.warn("Could not parse error response as JSON:", parseError);
            errorData.message = response.statusText || errorData.message;
        }

        return errorData;
    }

    /**
     * Format error for consistent handling
     * @param {Error} error - Original error
     * @param {number} attempt - Final attempt number
     * @returns {Object} Formatted error
     */
    formatError(error, attempt) {
        return {
            success: false,
            error: error.message || "An unexpected error occurred",
            status: error.status || 0,
            errors: error.errors || {},
            attempts: attempt,
            timestamp: Date.now(),
        };
    }

    /**
     * Get user-friendly message for HTTP status codes
     * @param {number} status - HTTP status code
     * @returns {string} User-friendly message
     */
    getStatusMessage(status) {
        const messages = {
            400: "Bad request. Please check your input and try again.",
            401: "Your session has expired. Please refresh the page.",
            403: "You do not have permission to perform this action.",
            404: "The requested service is not available.",
            413: "One or more files are too large. Please reduce file sizes.",
            422: "Please check your input. Some fields contain invalid data.",
            429: "Too many requests. Please wait a moment and try again.",
            500: "Server error. Please try again in a few moments.",
            502: "Service temporarily unavailable. Please try again later.",
            503: "Service is currently under maintenance. Please try again later.",
            504: "Request timeout. Please check your connection and try again.",
        };

        return (
            messages[status] ||
            "An unexpected error occurred. Please try again."
        );
    }

    /**
     * Check if error is a network-related error
     * @param {Error} error - Error to check
     * @returns {boolean} Is network error
     */
    isNetworkError(error) {
        return (
            error.name === "TypeError" ||
            error.name === "NetworkError" ||
            error.message.includes("fetch") ||
            error.message.includes("network") ||
            error.message.includes("timeout")
        );
    }

    /**
     * Delay execution for specified time
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Delay promise
     */
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

/**
 * Create singleton instance
 */
export const apiHandler = new ApiHandler();

/**
 * Submit form data with validation
 * @param {Object} formData - Data to submit
 * @returns {Promise<Object>} Response promise
 */
export async function submitFormData(formData) {
    try {
        console.log("Submitting form data:", {
            tab: formData.tabName,
            hasPersonalInfo: !!formData.personalInfo,
            hasFiles: !!formData.files,
        });

        const response = await apiHandler.submitForm(formData);

        console.log("Form submission successful:", response);
        return response;
    } catch (error) {
        console.error("Form submission failed:", error);

        return {
            success: false,
            error: error.error || error.message || "Submission failed",
            status: error.status || 0,
            errors: error.errors || {},
            type: error.type || "network",
        };
    }
}

/**
 * Handle API response with callbacks
 * @param {Object} response - API response
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export function handleApiResponse(response, onSuccess, onError) {
    if (response.success) {
        if (typeof onSuccess === "function") {
            onSuccess(response.data, response);
        }
    } else {
        if (typeof onError === "function") {
            onError(response.error, response.errors, response);
        }
    }
}

/**
 * Upload progress tracking (for future enhancement)
 * @param {Function} onProgress - Progress callback
 * @returns {Function} Progress handler
 */
export function createProgressHandler(onProgress) {
    return (event) => {
        if (event.lengthComputable && typeof onProgress === "function") {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete, event);
        }
    };
}

export default {
    ApiHandler,
    apiHandler,
    submitFormData,
    handleApiResponse,
    createProgressHandler,
};
