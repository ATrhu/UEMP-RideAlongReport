/**
 * UEMP Operations Hub V2 - Equipment Care Tool
 * Handles phone condition tracking and battery pack inventory
 */

// ========================================
// Equipment Care State Management
// ========================================

class EquipmentCareState {
    constructor() {
        this.selectedPhone = null;
        this.currentPhonePhotoData = null;
        this.currentPhonePhotoType = null;
        this.currentTab = 'phone-care';
        this.newPhotoData = null;
    }

    setSelectedPhone(phone) {
        this.selectedPhone = phone;
    }

    setPhonePhotoData(data, type) {
        this.currentPhonePhotoData = data;
        this.currentPhonePhotoType = type;
    }

    clearPhonePhotoData() {
        this.currentPhonePhotoData = null;
        this.currentPhonePhotoType = null;
    }

    setTab(tabName) {
        this.currentTab = tabName;
    }

    reset() {
        this.selectedPhone = null;
        this.clearPhonePhotoData();
    }
}

// ========================================
// Phone Condition Storage System
// ========================================

class PhoneConditionStorage {
    constructor() {
        this.storageKey = 'uemp_phone_conditions';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    getAllPhoneConditions() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading phone conditions from localStorage:', e);
            return {};
        }
    }

    getPhoneConditionHistory(phoneLabel) {
        const allConditions = this.getAllPhoneConditions();
        return allConditions[phoneLabel] || [];
    }

    addPhoneCondition(phoneLabel, conditionData) {
        try {
            const allConditions = this.getAllPhoneConditions();
            if (!allConditions[phoneLabel]) {
                allConditions[phoneLabel] = [];
            }

            // Add timestamp if not provided
            if (!conditionData.uploadDate) {
                conditionData.uploadDate = new Date().toISOString();
            }

            // Add unique ID
            conditionData.id = Date.now() + Math.random().toString(36).substr(2, 9);

            allConditions[phoneLabel].push(conditionData);
            localStorage.setItem(this.storageKey, JSON.stringify(allConditions));
            return true;
        } catch (e) {
            console.error('Error saving phone condition:', e);
            return false;
        }
    }

    removePhoneCondition(phoneLabel, conditionId) {
        try {
            const allConditions = this.getAllPhoneConditions();
            if (allConditions[phoneLabel]) {
                allConditions[phoneLabel] = allConditions[phoneLabel].filter(
                    condition => condition.id !== conditionId
                );
                localStorage.setItem(this.storageKey, JSON.stringify(allConditions));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error removing phone condition:', e);
            return false;
        }
    }
}

// ========================================
// Local Battery Pack Storage System
// ========================================

class BatteryPackStorage {
    constructor() {
        this.storageKey = 'uemp_battery_packs';
        this.loadData();
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.data = data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading battery pack data:', error);
            this.data = {};
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving battery pack data:', error);
        }
    }

    addBatteryPackEntry(bpNumber, date = null) {
        if (!date) {
            date = new Date().toISOString().split('T')[0]; // Today's date
        }

        if (!this.data[date]) {
            this.data[date] = [];
        }

        // Check if battery pack already exists for this date
        if (!this.data[date].includes(bpNumber)) {
            this.data[date].push(bpNumber);
            this.data[date].sort((a, b) => a - b); // Sort numerically
            this.saveData();
            return true;
        }
        return false;
    }

    removeBatteryPackEntry(bpNumber, date) {
        if (this.data[date]) {
            const index = this.data[date].indexOf(bpNumber);
            if (index > -1) {
                this.data[date].splice(index, 1);
                this.saveData();
                return true;
            }
        }
        return false;
    }

    getBatteryPackNumbersForDate(date) {
        return this.data[date] || [];
    }

    getBatteryPackStats() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        return {
            today: this.getBatteryPackNumbersForDate(today),
            yesterday: this.getBatteryPackNumbersForDate(yesterdayStr)
        };
    }

    getBatteryPackHistoryForDate(date) {
        const bpNumbers = this.getBatteryPackNumbersForDate(date);
        return bpNumbers.map(bp => ({
            batteryPackNumber: bp,
            date: date,
            id: `${date}_${bp}`
        }));
    }

    getBatteryPackHistoryForRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const history = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const entries = this.getBatteryPackHistoryForDate(dateStr);
            history.push(...entries);
        }

        return history;
    }
}

// Initialize battery pack storage
const batteryPackStorage = new BatteryPackStorage();

// Initialize phone condition storage
const phoneConditionStorage = new PhoneConditionStorage();

// Initialize equipment care state
const equipmentCareState = new EquipmentCareState();

// ========================================
// UI Management
// ========================================

function initEquipmentCareTool() {
    console.log('Initializing Equipment Care Tool');
    equipmentCareState.reset();
    showEquipmentTab('phone-care');
    populatePhoneGrid();
    initializeBatteryPackInterface();
    setDefaultBatteryPackDates();

    // Load initial battery pack data
    refreshBatteryPackData();
}

function showEquipmentTab(tabName) {
    equipmentCareState.setTab(tabName);

    // Hide all tabs
    document.querySelectorAll('#equipment-care-interface .equipment-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Add active class to selected tab button
    event?.target?.classList.add('active');

    // Refresh data for the selected tab
    if (tabName === 'phone-care') {
        populatePhoneGrid();
    } else if (tabName === 'battery-packs') {
        refreshBatteryPackData();
    }
}

// ========================================
// Phone Care Management
// ========================================

function populatePhoneGrid() {
    const phoneGrid = document.getElementById('phone-grid');

    if (!phoneGrid) return;

    // Clear existing content
    phoneGrid.innerHTML = '';

    // Create phones 0-63
    for (let i = 0; i <= 63; i++) {
        const phoneElement = createPhoneElement(i.toString());
        phoneGrid.appendChild(phoneElement);
    }

    // Create ORS phone at the end
    const orsPhoneElement = createPhoneElement('ORS');
    phoneGrid.appendChild(orsPhoneElement);
}

function createPhoneElement(phoneLabel) {
    const phoneDiv = document.createElement('div');
    phoneDiv.className = 'phone-item';
    phoneDiv.onclick = () => selectPhone(phoneLabel);

    // Get phone condition info if equipment care is available
    let latestCondition = null;
    let conditionHistory = [];
    let hasPhoto = false;

    if (phoneConditionStorage) {
        conditionHistory = phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [];
        latestCondition = conditionHistory.length > 0 ? conditionHistory[conditionHistory.length - 1] : null;
        hasPhoto = latestCondition && latestCondition.photoData;
    }

    const conditionClass = latestCondition ? `condition-${latestCondition.condition}` : 'condition-none';

    phoneDiv.innerHTML = `
        <div class="phone-label">${phoneLabel}</div>
        <div class="phone-condition ${conditionClass}">
            ${latestCondition ? latestCondition.condition.replace('_', ' ').toUpperCase() : 'NO DATA'}
        </div>
        <div class="phone-info">
            <div class="phone-history-count">
                <i class="fas fa-history"></i> ${conditionHistory.length}
            </div>
            ${hasPhoto ? '<div class="phone-has-photo"><i class="fas fa-camera"></i></div>' : ''}
        </div>
        ${latestCondition ? `<div class="last-update">Last: ${new Date(latestCondition.date).toLocaleDateString()}</div>` : ''}
    `;

    return phoneDiv;
}

function selectPhone(phoneLabel) {
    equipmentCareState.setSelectedPhone(phoneLabel);
    showPhoneConditionScreen();
    loadPhoneConditionHistory(phoneLabel);
    loadDamageReports(phoneLabel);
    loadLatestPhonePhoto(phoneLabel);

    // Update the title
    document.getElementById('selected-phone-title').textContent = `Phone ${phoneLabel}`;
}

function showPhoneConditionScreen() {
    const selectionScreen = document.getElementById('phone-selection-screen');
    const conditionScreen = document.getElementById('phone-condition-screen');

    if (selectionScreen) selectionScreen.classList.remove('active');
    if (conditionScreen) conditionScreen.classList.add('active');
}

function backToPhoneSelection() {
    equipmentCareState.reset();
    const selectionScreen = document.getElementById('phone-selection-screen');
    const conditionScreen = document.getElementById('phone-condition-screen');

    if (conditionScreen) conditionScreen.classList.remove('active');
    if (selectionScreen) selectionScreen.classList.add('active');
}

function updatePhoneInfo(phoneLabel) {
    document.getElementById('selected-phone-title').textContent = `Phone ${phoneLabel}`;

    if (!phoneConditionStorage) return;

    // Skip stats update if phone-stats element doesn't exist (it's been removed)
    const statsDiv = document.getElementById('phone-stats');
    if (!statsDiv) return;
}

function loadPhoneConditionHistory(phoneLabel) {
    if (!phoneConditionStorage) return;

    const history = phoneConditionStorage.getPhoneConditionHistory(phoneLabel);
    const historyDiv = document.getElementById('phone-condition-list');

    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="no-data">No condition history found for this phone.</p>';
        return;
    }

    // Filter out damage reports from condition history (they appear in damage reports section)
    const regularEntries = history.filter(entry => !entry.isDamageReport && !entry.damageReported);

    if (regularEntries.length === 0) {
        historyDiv.innerHTML = '<p class="no-data">No condition history for this phone.</p>';
        return;
    }

    historyDiv.innerHTML = regularEntries.map(entry => `
        <div class="condition-entry-minimal">
            <div class="condition-summary" onclick="toggleConditionDetails('${entry.id}')">
                <span class="condition-date">${new Date(entry.uploadDate || entry.date).toLocaleDateString()}</span>
                <span class="condition-reporter">by ${entry.reportedBy}</span>
                <span class="condition-toggle-icon">
                    <i class="fas fa-chevron-down" id="icon-${entry.id}"></i>
                </span>
            </div>
            <div class="condition-details" id="details-${entry.id}" style="display: none;">
                <div class="condition-description">
                    ${entry.description || 'Photo uploaded'}
                </div>
                ${entry.photoData ? `
                <div class="condition-photo-preview">
                    <img src="${entry.photoData}" alt="Condition photo" onclick="viewFullPhonePhoto('${entry.photoData}')">
                </div>
                ` : ''}
                <div class="condition-actions-minimal">
                    <button class="btn btn-small btn-danger" onclick="deletePhoneCondition('${phoneLabel}', '${entry.id}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// Phone Photo Management
// ========================================

function takePhonePhoto() {
    if (!equipmentCareState.selectedPhone) {
        showNotification('Please select a phone first', 'error');
        return;
    }

    // In a real implementation, this would trigger camera
    // For now, we'll use file upload
    uploadPhonePhoto();
}

function uploadPhonePhoto() {
    console.log('uploadPhonePhoto called');
    const fileInput = document.getElementById('phone-photo-upload');
    console.log('File input element:', fileInput);

    if (fileInput) {
        // Clear any previous value to ensure onchange fires
        fileInput.value = '';
        console.log('File input value cleared');

        fileInput.click();
        console.log('File picker opened');
    } else {
        console.error('File input element not found');
    }
}







function clearPhoneForm() {
    document.getElementById('reported-by').value = '';
    document.getElementById('phone-condition').value = 'good';
    document.getElementById('phone-description').value = '';
    document.getElementById('phone-notes').value = '';
    cancelPhonePhoto();
}

function deletePhoneCondition(phoneLabel, entryId) {
    if (confirm('Are you sure you want to delete this condition entry?')) {
        if (phoneConditionStorage && phoneConditionStorage.removePhoneCondition(phoneLabel, entryId)) {
            loadPhoneConditionHistory(equipmentCareState.selectedPhone);
            updatePhoneInfo(equipmentCareState.selectedPhone);
            showNotification('Condition entry deleted successfully!', 'success');
        } else {
            showNotification('Failed to delete condition entry', 'error');
        }
    }
}

function viewFullPhonePhoto(photoData) {
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-photo" onclick="this.parentElement.remove()">&times;</span>
            <img src="${photoData}" alt="Full phone condition photo" style="max-width: 90vw; max-height: 90vh;">
        </div>
    `;

    document.body.appendChild(photoModal);
}

function viewDamageComparison(previousPhoto, newPhoto, date) {
    const comparisonModal = document.createElement('div');
    comparisonModal.className = 'photo-modal damage-comparison-modal';
    comparisonModal.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-photo" onclick="this.parentElement.remove()">&times;</span>
            <h3>Damage Comparison - ${date}</h3>
            <div class="damage-comparison-modal-content">
                <div class="damage-photo-section">
                    <h4>Previous Photo</h4>
                    <div class="damage-photo-container">
                        <img src="${previousPhoto}" alt="Previous photo" style="max-width: 100%; max-height: 300px;">
                    </div>
                </div>
                <div class="damage-photo-section">
                    <h4>New Photo (Damage Reported)</h4>
                    <div class="damage-photo-container">
                        <img src="${newPhoto}" alt="New photo with damage" style="max-width: 100%; max-height: 300px;">
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(comparisonModal);
}

// ========================================
// New Phone Photo Management Functions
// ========================================

function loadLatestPhonePhoto(phoneLabel) {
    const latestPhotoContainer = document.getElementById('latest-phone-photo');
    if (!latestPhotoContainer) return;

    if (!phoneConditionStorage) {
        latestPhotoContainer.innerHTML = '<p class="no-photo">Equipment care system not available</p>';
        return;
    }

    const history = phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [];
    const latestEntry = history.length > 0 ? history[history.length - 1] : null;

    if (latestEntry && latestEntry.photoData) {
        latestPhotoContainer.innerHTML = `
            <img src="${latestEntry.photoData}" alt="Latest phone photo" onclick="viewFullPhonePhoto('${latestEntry.photoData}')">
            <div class="photo-info">
                <span class="photo-date">${new Date(latestEntry.uploadDate || latestEntry.date).toLocaleDateString()}</span>
                <span class="photo-manager">by ${latestEntry.reportedBy}</span>
            </div>
        `;
    } else {
        latestPhotoContainer.innerHTML = '<p class="no-photo">No photo available for this phone</p>';
    }
}

function handlePhonePhotoUpload(event) {
    console.log('handlePhonePhotoUpload called', event);
    const file = event.target.files[0];
    console.log('Selected file:', file);

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('Invalid file type:', file.type);
            showNotification('Please select an image file', 'error');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.error('File too large:', file.size, 'bytes');
            showNotification('File too large. Maximum size is 10MB', 'error');
            return;
        }

        console.log('Processing file:', file.name, file.size, file.type);
        const reader = new FileReader();

        reader.onloadstart = function() {
            console.log('Started reading file...');
            showNotification('Processing image...', 'info');
        };

        reader.onload = function(e) {
            console.log('File loaded successfully');
            equipmentCareState.newPhotoData = e.target.result;
            showUploadConfirmation();
        };

        reader.onerror = function(e) {
            console.error('Error reading file:', e);
            showNotification('Error reading file. Please try again', 'error');
        };

        reader.readAsDataURL(file);
    } else {
        console.log('No file selected');
    }
}

// ========================================
// New Photo Management System
// ========================================

function showUploadConfirmation() {
    console.log('showUploadConfirmation called');
    console.log('newPhotoData exists:', !!equipmentCareState.newPhotoData);

    if (!equipmentCareState.newPhotoData) {
        console.log('No photo data, showing error');
        showNotification('No photo selected', 'error');
        return;
    }

    // Set the preview image
    const previewImg = document.getElementById('confirmation-photo-preview');
    console.log('Preview image element:', previewImg);

    if (previewImg) {
        previewImg.src = equipmentCareState.newPhotoData;
        console.log('Preview image src set');
    } else {
        console.error('Preview image element not found');
        showNotification('Error displaying photo preview', 'error');
        return;
    }

    // Show the modal
    const modal = document.getElementById('upload-confirmation-modal');
    console.log('Modal element:', modal);

    if (modal) {
        modal.style.display = 'block';
        console.log('Modal displayed');
    } else {
        console.error('Modal element not found');
        showNotification('Error opening confirmation dialog', 'error');
    }
}

function cancelUploadConfirmation() {
    document.getElementById('upload-confirmation-modal').style.display = 'none';
    equipmentCareState.newPhotoData = null;
    document.getElementById('phone-photo-upload').value = '';
}

function retryUpload() {
    document.getElementById('upload-confirmation-modal').style.display = 'none';
    document.getElementById('phone-photo-upload').value = '';
    // The user can click upload again
}

function confirmUpload() {
    console.log('confirmUpload called');
    document.getElementById('upload-confirmation-modal').style.display = 'none';

    // Get current photo for comparison
    const phoneLabel = equipmentCareState.selectedPhone;
    console.log('Selected phone:', phoneLabel);

    const history = phoneConditionStorage ? phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [] : [];
    console.log('Phone history length:', history.length);

    const currentEntry = history.length > 0 ? history[history.length - 1] : null;
    console.log('Current entry exists:', !!currentEntry);

    if (currentEntry && currentEntry.photoData) {
        console.log('Showing photo comparison modal');
        // Show comparison modal
        showPhotoComparison(currentEntry.photoData, equipmentCareState.newPhotoData);
    } else {
        console.log('Saving new photo directly');
        // No previous photo, just save the new one
        saveNewPhoto();
    }
}

function showPhotoComparison(previousPhoto, newPhoto) {
    // Set photos in modal
    document.getElementById('comparison-modal-previous').innerHTML = `<img src="${previousPhoto}" alt="Previous photo" style="max-width: 100%; max-height: 400px;">`;
    document.getElementById('comparison-modal-new').innerHTML = `<img src="${newPhoto}" alt="New photo" style="max-width: 100%; max-height: 400px;">`;

    // Clear any previous description
    document.getElementById('modal-damage-description').value = '';

    // Show modal
    document.getElementById('photo-comparison-modal').style.display = 'block';
}

function closePhotoComparisonModal() {
    document.getElementById('photo-comparison-modal').style.display = 'none';
}

function reportDamageFromModal() {
    const description = document.getElementById('modal-damage-description').value;

    if (!equipmentCareState.newPhotoData) {
        showNotification('No photo to report damage with', 'error');
        return;
    }

    const phoneLabel = equipmentCareState.selectedPhone;
    const history = phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [];
    const currentEntry = history.length > 0 ? history[history.length - 1] : null;

    if (!phoneConditionStorage) {
        showNotification('Equipment care system not available', 'error');
        return;
    }

    // Create damage report with both photos
    const currentUser = app.getUser() || 'Manager';
    const damageData = {
        reportedBy: currentUser, // Use actual logged-in user
        condition: 'damaged',
        description: description || 'Damage reported',
        photoData: equipmentCareState.newPhotoData,
        previousPhotoData: currentEntry ? currentEntry.photoData : null,
        photoType: 'damage_report',
        isDamageReport: true,
        damageReported: true,
        uploadDate: new Date().toISOString()
    };

    const success = phoneConditionStorage.addPhoneCondition(phoneLabel, damageData);

    if (success) {
        // Close modal
        closePhotoComparisonModal();

        // Update displays
        loadLatestPhonePhoto(equipmentCareState.selectedPhone);
        loadPhoneConditionHistory(equipmentCareState.selectedPhone);
        loadDamageReports(equipmentCareState.selectedPhone);

        showNotification('Damage reported successfully!', 'success');
    } else {
        showNotification('Failed to report damage', 'error');
    }
}

function toggleConditionDetails(entryId) {
    const detailsDiv = document.getElementById(`details-${entryId}`);
    const icon = document.getElementById(`icon-${entryId}`);

    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
    } else {
        detailsDiv.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
    }
}

function cancelComparison() {
    // Reset to latest photo view
    document.getElementById('latest-phone-photo').style.display = 'block';
    document.getElementById('photo-comparison-container').style.display = 'none';
    document.getElementById('damage-description-section').style.display = 'none';
    document.getElementById('comparison-actions').style.display = 'none';
    document.getElementById('photo-section-title').textContent = 'Latest Photo';

    // Clean up
    equipmentCareState.newPhotoData = null;
    document.getElementById('phone-photo-upload').value = '';
    document.getElementById('phone-damage-description').value = '';
}

function saveNewPhoto() {
    console.log('saveNewPhoto called');

    if (!equipmentCareState.newPhotoData || !equipmentCareState.selectedPhone) {
        console.log('Missing photo data or phone selection');
        showNotification('No photo data or phone selected', 'error');
        return;
    }

    if (!phoneConditionStorage) {
        console.log('Phone condition storage not available');
        showNotification('Equipment care system not available', 'error');
        return;
    }

    console.log('Creating condition data');
    const currentUser = app.getUser() || 'Manager';
    const conditionData = {
        reportedBy: currentUser, // Use actual logged-in user
        condition: 'good', // Default condition for uploaded photos
        description: 'Photo uploaded',
        photoData: equipmentCareState.newPhotoData,
        photoType: 'condition_photo',
        uploadDate: new Date().toISOString()
    };

    console.log('Saving photo to storage');
    const success = phoneConditionStorage.addPhoneCondition(equipmentCareState.selectedPhone, conditionData);

    if (success) {
        console.log('Photo saved successfully, updating displays');
        // Update displays
        loadLatestPhonePhoto(equipmentCareState.selectedPhone);
        loadPhoneConditionHistory(equipmentCareState.selectedPhone);

        // Reset to normal view
        cancelComparison();

        showNotification('Photo saved successfully!', 'success');

        // Reset the file input for next upload
        document.getElementById('phone-photo-upload').value = '';
    } else {
        console.log('Failed to save photo');
        showNotification('Failed to save photo', 'error');
    }
}

function reportDamage() {
    if (!equipmentCareState.newPhotoData) {
        showNotification('No photo to report damage with', 'error');
        return;
    }

    const phoneLabel = equipmentCareState.selectedPhone;
    const history = phoneConditionStorage ? phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [] : [];
    const currentEntry = history.length > 0 ? history[history.length - 1] : null;

    if (!phoneConditionStorage) {
        showNotification('Equipment care system not available', 'error');
        return;
    }

    // Create damage report with both photos
    const currentUser = app.getUser() || 'Manager';
    const damageData = {
        reportedBy: currentUser, // Use actual logged-in user
        condition: 'damaged',
        description: document.getElementById('phone-damage-description').value || 'Damage reported',
        photoData: equipmentCareState.newPhotoData,
        previousPhotoData: currentEntry ? currentEntry.photoData : null,
        photoType: 'damage_report',
        isDamageReport: true,
        damageReported: true,
        uploadDate: new Date().toISOString()
    };

    phoneConditionStorage.addPhoneCondition(phoneLabel, damageData);

    // Save the new photo as the latest photo
    saveNewPhoto();

    // Load damage reports
    loadDamageReports(phoneLabel);

    showNotification('Damage reported and photo updated!', 'success');
}

function loadDamageReports(phoneLabel) {
    if (!phoneConditionStorage) return;

    const history = phoneConditionStorage.getPhoneConditionHistory(phoneLabel) || [];
    const damageReportsList = document.getElementById('damage-reports-list');

    // Filter only damage reports
    const damageReports = history.filter(entry => entry.isDamageReport || entry.damageReported);

    if (damageReports.length === 0) {
        damageReportsList.innerHTML = '<p class="no-data">No damage reports for this phone.</p>';
        return;
    }

    damageReportsList.innerHTML = damageReports.map(entry => `
        <div class="damage-report-item">
            <div class="damage-report-header">
                <span class="damage-report-date">${new Date(entry.uploadDate || entry.date).toLocaleString()}</span>
                <span class="damage-report-manager">Reported by: ${entry.reportedBy}</span>
            </div>
            <div class="damage-report-description">
                ${entry.description || 'No description'}
            </div>
            <div class="damage-report-photos">
                <button class="btn btn-small btn-primary" onclick="viewDamageComparison('${entry.previousPhotoData || ''}', '${entry.photoData}', '${new Date(entry.date).toLocaleString()}')">
                    <i class="fas fa-images"></i> View Comparison
                </button>
            </div>
        </div>
    `).join('');
}

function cancelPhonePhotoUpload() {
    equipmentCareState.newPhotoData = null;
    document.getElementById('phone-photo-upload-modal').style.display = 'none';
    document.getElementById('phone-photo-upload').value = '';
}

function confirmPhonePhotoUpload() {
    if (!equipmentCareState.newPhotoData || !equipmentCareState.selectedPhone) {
        showNotification('No photo data or phone selected', 'error');
        return;
    }

    if (!phoneConditionStorage) {
        showNotification('Equipment care system not available', 'error');
        return;
    }

    const conditionData = {
        reportedBy: 'Manager', // Will be set by login system
        condition: 'good', // Default condition
        description: document.getElementById('upload-phone-description').value || 'Photo uploaded',
        photoData: equipmentCareState.newPhotoData,
        photoType: 'condition_photo',
        uploadDate: new Date().toISOString()
    };

    // Add the condition entry
    phoneConditionStorage.addPhoneCondition(equipmentCareState.selectedPhone, conditionData);

    // Clean up
    cancelPhonePhotoUpload();

    // Refresh displays
    loadPhoneConditionHistory(equipmentCareState.selectedPhone);
    loadLatestPhonePhoto(equipmentCareState.selectedPhone);

    showNotification('Phone photo uploaded successfully!', 'success');
}

// ========================================
// Battery Pack Management
// ========================================

function initializeBatteryPackInterface() {
    refreshBatteryPackData();
    setDefaultBatteryPackDates();
}

function setDefaultBatteryPackDates() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    document.getElementById('start-date-bp').value = yesterday.toISOString().split('T')[0];
    document.getElementById('end-date-bp').value = today.toISOString().split('T')[0];
}

function addBatteryPack() {
    const bpNumber = document.getElementById('battery-pack-number').value.trim();

    if (!bpNumber) {
        showNotification('Please enter a battery pack number', 'error');
        return;
    }

    const bpNum = parseInt(bpNumber);
    if (isNaN(bpNum) || bpNum < 0) {
        showNotification('Please enter a valid battery pack number (0 or greater)', 'error');
        return;
    }

    batteryPackStorage.addBatteryPackEntry(bpNum);

    // Clear input
    document.getElementById('battery-pack-number').value = '';

    // Refresh display
    refreshBatteryPackData();

    showNotification(`Battery Pack ${bpNum} added successfully!`, 'success');
}

function handleBatteryPackKeyPress(event) {
    // Check if Enter key was pressed
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Prevent form submission
        addBatteryPack();
    }
}

function refreshBatteryPackData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Update today's inventory
    const todayBPs = batteryPackStorage.getBatteryPackNumbersForDate(today);
    const todayDiv = document.getElementById('today-battery-packs');

    if (todayBPs.length === 0) {
        todayDiv.innerHTML = '<p class="no-data">No battery packs recorded for today.</p>';
    } else {
        todayDiv.innerHTML = todayBPs.map(bp => `
            <div class="battery-pack-item">
                <span class="bp-number">BP ${bp}</span>
                <button class="btn btn-small btn-danger" onclick="removeBatteryPack('${bp}', '${today}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Update quick stats
    updateQuickStats();
}

function updateQuickStats() {
    const stats = batteryPackStorage.getBatteryPackStats();

    document.getElementById('today-stats').innerHTML = `
        <div class="stat-number">${stats.today.length}</div>
        <div class="stat-label">Battery Packs Today</div>
    `;

    document.getElementById('yesterday-stats').innerHTML = `
        <div class="stat-number">${stats.yesterday.length}</div>
        <div class="stat-label">Battery Packs Yesterday</div>
    `;
}

function removeBatteryPack(bpNumber, date) {
    if (confirm(`Remove Battery Pack ${bpNumber} from ${date}?`)) {
        const bpNum = parseInt(bpNumber);

        if (batteryPackStorage.removeBatteryPackEntry(bpNum, date)) {
            refreshBatteryPackData();
            showNotification(`Battery Pack ${bpNumber} removed successfully!`, 'success');
        } else {
            showNotification('Failed to remove battery pack', 'error');
        }
    }
}

function viewInventoryHistory() {
    const startDate = document.getElementById('start-date-bp').value;
    const endDate = document.getElementById('end-date-bp').value;

    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }

    const history = batteryPackStorage.getBatteryPackHistoryForRange(startDate, endDate);
    const resultsDiv = document.getElementById('inventory-history-results');

    if (history.length === 0) {
        resultsDiv.innerHTML = '<p class="no-data">No inventory history found for the selected date range.</p>';
        return;
    }

    // Group by date
    const groupedByDate = history.reduce((acc, entry) => {
        if (!acc[entry.date]) {
            acc[entry.date] = [];
        }
        acc[entry.date].push(entry);
        return acc;
    }, {});

    resultsDiv.innerHTML = Object.entries(groupedByDate).map(([date, entries]) => `
        <div class="history-date-group">
            <h5>${new Date(date).toLocaleDateString()}</h5>
            <div class="bp-list">
                ${entries.map(entry => `
                    <span class="bp-tag">BP ${entry.batteryPackNumber}</span>
                `).join('')}
            </div>
            <div class="date-summary">
                Total: ${entries.length} battery packs
            </div>
        </div>
    `).join('');
}

// ========================================
// Utility Functions
// ========================================

function showNotification(message, type = 'info') {
    // Fallback notification system for equipment care
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========================================
// Initialization
// ========================================

console.log('Equipment Care Tool loaded and ready');
