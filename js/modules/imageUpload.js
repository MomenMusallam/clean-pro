/**
 * Image Upload Handler Module
 * Handles image preview and validation for file uploads
 */

/**
 * Setup image upload with preview
 * @param {string} inputId - File input ID
 * @param {string} previewId - Preview container ID
 * @param {string} counterId - Counter element class
 * @param {number} maxFiles - Maximum files allowed
 */
export function setupImageUpload(inputId, previewId, counterId, maxFiles = 5) {
    const fileInput = document.getElementById(inputId);
    const previewContainer = document.getElementById(previewId);
    const counterElement = document.querySelector(`.${counterId}`);

    if (!fileInput || !previewContainer) return;

    let selectedFiles = [];

    fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);

        // Check if total files exceed limit
        if (selectedFiles.length + files.length > maxFiles) {
            alert(`You can upload maximum ${maxFiles} images`);
            return;
        }

        // Validate and add files
        files.forEach((file) => {
            if (validateFile(file)) {
                selectedFiles.push(file);
                addPreview(file, previewContainer, selectedFiles);
            }
        });

        updateCounter(counterElement, selectedFiles.length, maxFiles);
        updateFileInput(fileInput, selectedFiles);
    });

    // Remove file handler
    previewContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-image")) {
            const index = parseInt(e.target.dataset.index);
            removeFile(
                index,
                selectedFiles,
                previewContainer,
                counterElement,
                fileInput,
                maxFiles
            );
        }
    });
}

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @returns {boolean} Is valid
 */
function validateFile(file) {
    const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
        alert(
            `Invalid file type: ${file.name}. Please upload images only (JPEG, PNG, GIF, WebP)`
        );
        return false;
    }

    if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 5MB`);
        return false;
    }

    return true;
}

/**
 * Add image preview
 * @param {File} file - File to preview
 * @param {HTMLElement} container - Preview container
 * @param {Array} files - Files array
 */
function addPreview(file, container, files) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const index = files.indexOf(file);

        const previewDiv = document.createElement("div");
        previewDiv.className = "image-preview-item";
        previewDiv.style.cssText = `
            position: relative;
            width: 100px;
            height: 100px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
        `;

        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-image";
        removeBtn.dataset.index = index;
        removeBtn.innerHTML = "×";
        removeBtn.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            width: 24px;
            height: 24px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;

        removeBtn.addEventListener("mouseenter", () => {
            removeBtn.style.background = "rgba(255, 0, 0, 1)";
        });

        removeBtn.addEventListener("mouseleave", () => {
            removeBtn.style.background = "rgba(255, 0, 0, 0.8)";
        });

        previewDiv.appendChild(img);
        previewDiv.appendChild(removeBtn);
        container.appendChild(previewDiv);
    };

    reader.readAsDataURL(file);
}

/**
 * Remove file from selection
 * @param {number} index - File index
 * @param {Array} files - Files array
 * @param {HTMLElement} container - Preview container
 * @param {HTMLElement} counter - Counter element
 * @param {HTMLElement} input - File input
 * @param {number} maxFiles - Max files allowed
 */
function removeFile(index, files, container, counter, input, maxFiles) {
    files.splice(index, 1);

    // Clear and rebuild preview
    container.innerHTML = "";
    files.forEach((file) => addPreview(file, container, files));

    updateCounter(counter, files.length, maxFiles);
    updateFileInput(input, files);
}

/**
 * Update counter display
 * @param {HTMLElement} counter - Counter element
 * @param {number} current - Current count
 * @param {number} max - Maximum count
 */
function updateCounter(counter, current, max) {
    if (counter) {
        counter.textContent = `${current}/${max}`;

        if (current >= max) {
            counter.style.color = "#ff5b5b";
        } else {
            counter.style.color = "#000";
        }
    }
}

/**
 * Update file input with selected files
 * @param {HTMLElement} input - File input
 * @param {Array} files - Files array
 */
function updateFileInput(input, files) {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    input.files = dt.files;
}

/**
 * Get selected files
 * @param {string} inputId - File input ID
 * @returns {Array} Array of files
 */
export function getUploadedFiles(inputId) {
    const input = document.getElementById(inputId);
    return input ? Array.from(input.files) : [];
}

/**
 * Clear all uploads
 * @param {string} inputId - File input ID
 * @param {string} previewId - Preview container ID
 * @param {string} counterId - Counter element class
 * @param {number} maxFiles - Maximum files
 */
export function clearUploads(inputId, previewId, counterId, maxFiles = 5) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const counter = document.querySelector(`.${counterId}`);

    if (input) input.value = "";
    if (preview) preview.innerHTML = "";
    if (counter) counter.textContent = `0/${maxFiles}`;
}

/**
 * Initialize all image upload handlers
 */
export function initializeImageUploads() {
    // Optional service uploads (if they exist)
    setupImageUpload(
        "formFileMultipleWindow",
        "previewWindow",
        "imgCountWindow",
        5
    );
    setupImageUpload(
        "formFileMultipleUpholstery",
        "previewUpholstery",
        "imgCountUpholstery",
        5
    );
    setupImageUpload(
        "formFileMultipleCarpet",
        "previewCarpet",
        "imgCountCarpet",
        5
    );
    setupImageUpload(
        "formFileMultipleNormal",
        "previewNormal",
        "imgCountNormal",
        5
    );

    setupImageUpload(
        "formFileMultipleForSpring",
        "previewSpring",
        "imgCountSpring",
        5
    );
    setupImageUpload(
        "formFileMultipleForMessieApatment",
        "previewMessieApatment",
        "imgCountMessieApatment",
        5
    );
    setupImageUpload(
        "formFileMultipleForCleaning",
        "previewCleaning",
        "imgCountcleaning",
        5
    );

    setupImageUpload(
        "formFileMultipleWindowOptional",
        "previewWindowOptionall",
        "imgCountWindowOptional",
        5
    );
    setupImageUpload(
        "formFileMultipleUpholsteryOptional",
        "previewUpholsteryOptional",
        "imgCountUpholsteryOptional",
        5
    );
    setupImageUpload(
        "formFileMultipleCarpetOptional",
        "previewCarpetOptional",
        "imgCountCarpetOptional",
        5
    );
    setupImageUpload(
        "formFileMultipleNormalOptional",
        "previewNormalOptional",
        "imgCountNormalOptional",
        5
    );
}

export default {
    setupImageUpload,
    getUploadedFiles,
    clearUploads,
    initializeImageUploads,
};
