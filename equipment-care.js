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

    if (window.equipmentCare) {
        conditionHistory = window.equipmentCare.getPhoneConditionHistory(phoneLabel) || [];
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
    updatePhoneInfo(phoneLabel);
    loadLatestPhonePhoto(phoneLabel);
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
    document.getElementById('selected-phone-title').textContent = `Phone ${phoneLabel} - Condition History`;

    if (!window.equipmentCare) return;

    const history = window.equipmentCare.getPhoneConditionHistory(phoneLabel);
    const statsDiv = document.getElementById('phone-stats');

    if (history.length === 0) {
        statsDiv.innerHTML = '<p class="no-data">No condition history found for this phone.</p>';
        return;
    }

    const latestEntry = history[history.length - 1];
    const conditionBreakdown = history.reduce((acc, entry) => {
        acc[entry.condition] = (acc[entry.condition] || 0) + 1;
        return acc;
    }, {});

    statsDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Current Condition:</span>
            <span class="stat-value condition-${latestEntry.condition}">${latestEntry.condition.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Entries:</span>
            <span class="stat-value">${history.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Last Updated:</span>
            <span class="stat-value">${new Date(latestEntry.date).toLocaleDateString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Condition Breakdown:</span>
            <span class="stat-value">${Object.entries(conditionBreakdown).map(([condition, count]) => `${condition.replace('_', ' ')}: ${count}`).join(', ')}</span>
        </div>
    `;
}

function loadPhoneConditionHistory(phoneLabel) {
    if (!window.equipmentCare) return;

    const history = window.equipmentCare.getPhoneConditionHistory(phoneLabel);
    const historyDiv = document.getElementById('phone-condition-list');

    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="no-data">No condition history found for this phone.</p>';
        return;
    }

    historyDiv.innerHTML = history.map(entry => `
        <div class="condition-entry">
            <div class="condition-header">
                <span class="condition-date">${new Date(entry.date).toLocaleDateString()}</span>
                <span class="condition-status ${entry.condition}">${entry.condition.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="condition-content">
                <div class="condition-info">
                    <p><strong>Reported By:</strong> ${entry.reportedBy}</p>
                    <p><strong>Description:</strong> ${entry.description || 'No description'}</p>
                    ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
                </div>
                ${entry.photoData ? `
                <div class="condition-photo">
                    <img src="${entry.photoData}" alt="Condition photo" onclick="viewFullPhonePhoto('${entry.photoData}')">
                </div>
                ` : ''}
            </div>
            <div class="condition-actions">
                <button class="btn btn-small btn-danger" onclick="deletePhoneCondition('${phoneLabel}', '${entry.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
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
    document.getElementById('phone-photo-upload').click();
}

function handlePhonePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            equipmentCareState.setPhonePhotoData(e.target.result, 'upload');
            showPhonePhotoPreview();
        };
        reader.readAsDataURL(file);
    }
}

function showPhonePhotoPreview() {
    const previewContainer = document.getElementById('phone-photo-preview-container');
    const previewDiv = document.getElementById('phone-photo-preview');

    previewDiv.innerHTML = `<img src="${equipmentCareState.currentPhonePhotoData}" alt="Phone condition photo" style="max-width: 100%; max-height: 300px;">`;
    previewContainer.style.display = 'block';

    // Show modal
    document.getElementById('phone-photo-modal').style.display = 'block';
}

function confirmPhonePhoto() {
    if (!equipmentCareState.currentPhonePhotoData || !equipmentCareState.selectedPhone) {
        showNotification('No photo data or phone selected', 'error');
        return;
    }

    if (!window.equipmentCare) {
        showNotification('Equipment care system not available', 'error');
        return;
    }

    const conditionData = {
        reportedBy: document.getElementById('reported-by').value || 'Unknown',
        condition: document.getElementById('phone-condition').value || 'good',
        description: document.getElementById('phone-description').value || '',
        notes: document.getElementById('phone-notes').value || '',
        photoData: equipmentCareState.currentPhonePhotoData,
        photoType: equipmentCareState.currentPhonePhotoType
    };

    window.equipmentCare.addPhoneCondition(equipmentCareState.selectedPhone, conditionData);

    clearPhoneForm();
    loadPhoneConditionHistory(equipmentCareState.selectedPhone);
    updatePhoneInfo(equipmentCareState.selectedPhone);

    showNotification('Phone condition report added successfully!', 'success');
}

function cancelPhonePhoto() {
    equipmentCareState.clearPhonePhotoData();
    document.getElementById('phone-photo-preview-container').style.display = 'none';
    document.getElementById('phone-photo-upload').value = '';
    document.getElementById('phone-photo-modal').style.display = 'none';
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
        if (window.equipmentCare && window.equipmentCare.removePhoneCondition(phoneLabel, entryId)) {
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

// ========================================
// New Phone Photo Management Functions
// ========================================

function loadLatestPhonePhoto(phoneLabel) {
    const latestPhotoContainer = document.getElementById('latest-phone-photo');
    if (!latestPhotoContainer) return;

    if (!window.equipmentCare) {
        latestPhotoContainer.innerHTML = '<p class="no-photo">Equipment care system not available</p>';
        return;
    }

    const history = window.equipmentCare.getPhoneConditionHistory(phoneLabel) || [];
    const latestEntry = history.length > 0 ? history[history.length - 1] : null;

    if (latestEntry && latestEntry.photoData) {
        latestPhotoContainer.innerHTML = `
            <img src="${latestEntry.photoData}" alt="Latest phone photo" onclick="viewFullPhonePhoto('${latestEntry.photoData}')">
            <div class="photo-info">
                <span class="photo-date">${new Date(latestEntry.date).toLocaleDateString()}</span>
                <span class="photo-condition">${latestEntry.condition.replace('_', ' ').toUpperCase()}</span>
            </div>
        `;
    } else {
        latestPhotoContainer.innerHTML = '<p class="no-photo">No photo available for this phone</p>';
    }
}

function handlePhonePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            equipmentCareState.newPhotoData = e.target.result;
            showPhonePhotoComparison();
        };
        reader.readAsDataURL(file);
    }
}

function showPhonePhotoComparison() {
    if (!equipmentCareState.newPhotoData) {
        showNotification('No photo selected', 'error');
        return;
    }

    // Get previous photo
    const phoneLabel = equipmentCareState.selectedPhone;
    const history = window.equipmentCare ? window.equipmentCare.getPhoneConditionHistory(phoneLabel) || [] : [];
    const previousEntry = history.length > 0 ? history[history.length - 1] : null;

    // Update comparison modal
    const previousContainer = document.getElementById('previous-photo-container');
    const newContainer = document.getElementById('new-photo-container');

    if (previousEntry && previousEntry.photoData) {
        previousContainer.innerHTML = `<img src="${previousEntry.photoData}" alt="Previous photo">`;
    } else {
        previousContainer.innerHTML = '<p class="no-photo">No previous photo</p>';
    }

    newContainer.innerHTML = `<img src="${equipmentCareState.newPhotoData}" alt="New photo">`;

    // Show modal
    document.getElementById('phone-comparison-modal').style.display = 'block';
}

function closePhoneComparison() {
    document.getElementById('phone-comparison-modal').style.display = 'none';
    equipmentCareState.newPhotoData = null;
    document.getElementById('phone-photo-upload').value = '';
}

function savePhonePhotoComparison() {
    // Hide comparison modal and show upload form
    document.getElementById('phone-comparison-modal').style.display = 'none';
    document.getElementById('phone-photo-upload-modal').style.display = 'block';
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

    if (!window.equipmentCare) {
        showNotification('Equipment care system not available', 'error');
        return;
    }

    const storageOption = document.querySelector('input[name="storage-option"]:checked').value;
    const isPermanent = storageOption === 'permanent';

    const conditionData = {
        reportedBy: document.getElementById('upload-reported-by').value || 'Unknown',
        condition: document.getElementById('upload-phone-condition').value || 'good',
        description: document.getElementById('upload-phone-description').value || '',
        notes: document.getElementById('upload-phone-notes').value || '',
        photoData: equipmentCareState.newPhotoData,
        photoType: 'upload',
        isPermanent: isPermanent,
        uploadDate: new Date().toISOString()
    };

    // Add the condition entry
    window.equipmentCare.addPhoneCondition(equipmentCareState.selectedPhone, conditionData);

    // Clean up
    cancelPhonePhotoUpload();

    // Refresh displays
    loadPhoneConditionHistory(equipmentCareState.selectedPhone);
    updatePhoneInfo(equipmentCareState.selectedPhone);
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
