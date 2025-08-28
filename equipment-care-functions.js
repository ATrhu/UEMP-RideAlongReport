// Equipment Care Tool Functions
// This file handles the UI interactions for the Equipment Care tool

let selectedPhone = null;
let currentPhonePhotoData = null;
let currentPhonePhotoType = null;

function initEquipmentCareTool() {
    // Show the phone care tab by default
    showEquipmentTab('phone-care');
    
    // Populate the phone grid
    populatePhoneGrid();
    
    // Initialize battery pack interface
    initializeBatteryPackInterface();
    
    // Set default dates for battery pack history
    setDefaultBatteryPackDates();
}

// Tab navigation
function showEquipmentTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.equipment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected tab button
    event.target.classList.add('active');
    
    // Refresh data for the selected tab
    if (tabName === 'phone-care') {
        populatePhoneGrid();
    } else if (tabName === 'battery-packs') {
        refreshBatteryPackData();
    }
}

// Phone Care Functions
function populatePhoneGrid() {
    const phoneGrid = document.getElementById('phone-grid');
    const allPhones = window.equipmentCare.getAllPhoneConditions();
    
    phoneGrid.innerHTML = '';
    
    Object.keys(allPhones).forEach(phoneLabel => {
        const phoneElement = createPhoneElement(phoneLabel, allPhones[phoneLabel]);
        phoneGrid.appendChild(phoneElement);
    });
}

function createPhoneElement(phoneLabel, conditionHistory) {
    const phoneDiv = document.createElement('div');
    phoneDiv.className = 'phone-item';
    phoneDiv.onclick = () => selectPhone(phoneLabel);
    
    // Get latest condition
    const latestCondition = conditionHistory.length > 0 ? conditionHistory[conditionHistory.length - 1] : null;
    const conditionClass = latestCondition ? `condition-${latestCondition.condition}` : 'condition-none';
    
    phoneDiv.innerHTML = `
        <div class="phone-label">${phoneLabel}</div>
        <div class="phone-condition ${conditionClass}">
            ${latestCondition ? latestCondition.condition.replace('_', ' ').toUpperCase() : 'NO DATA'}
        </div>
        <div class="phone-history-count">
            <i class="fas fa-history"></i> ${conditionHistory.length} entries
        </div>
        ${latestCondition ? `<div class="last-update">Last: ${new Date(latestCondition.date).toLocaleDateString()}</div>` : ''}
    `;
    
    return phoneDiv;
}

function selectPhone(phoneLabel) {
    selectedPhone = phoneLabel;
    showPhoneConditionScreen();
    loadPhoneConditionHistory(phoneLabel);
    updatePhoneInfo(phoneLabel);
}

function showPhoneConditionScreen() {
    document.querySelector('.phone-selection-section').style.display = 'none';
    document.getElementById('phone-condition-screen').style.display = 'block';
}

function backToPhoneSelection() {
    document.querySelector('.phone-selection-section').style.display = 'block';
    document.getElementById('phone-condition-screen').style.display = 'none';
    selectedPhone = null;
    currentPhonePhotoData = null;
    currentPhonePhotoType = null;
}

function updatePhoneInfo(phoneLabel) {
    document.getElementById('selected-phone-title').textContent = `Phone ${phoneLabel} - Condition History`;
    document.getElementById('phone-summary-title').textContent = `Phone ${phoneLabel}`;
    
    // Update phone statistics
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

// Phone Photo Functions
function takePhonePhoto() {
    if (!selectedPhone) {
        alert('Please select a phone first.');
        return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not available in your browser.');
        return;
    }
    
    const cameraModal = document.createElement('div');
    cameraModal.className = 'camera-modal';
    cameraModal.innerHTML = `
        <div class="camera-content">
            <h3>Take Phone Condition Photo</h3>
            <video id="camera-video" autoplay></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div class="camera-controls">
                <button class="btn btn-primary" onclick="capturePhonePhoto()">
                    <i class="fas fa-camera"></i> Capture Photo
                </button>
                <button class="btn btn-secondary" onclick="closePhoneCamera()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cameraModal);
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
            window.phoneCameraStream = stream;
        })
        .catch(err => {
            alert('Error accessing camera: ' + err.message);
            document.body.removeChild(cameraModal);
        });
}

function capturePhonePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    currentPhonePhotoData = canvas.toDataURL('image/jpeg', 0.8);
    currentPhonePhotoType = 'camera';
    
    closePhoneCamera();
    showPhonePhotoPreview();
}

function closePhoneCamera() {
    if (window.phoneCameraStream) {
        window.phoneCameraStream.getTracks().forEach(track => track.stop());
        window.phoneCameraStream = null;
    }
    
    const cameraModal = document.querySelector('.camera-modal');
    if (cameraModal) {
        document.body.removeChild(cameraModal);
    }
}

function uploadPhonePhoto() {
    if (!selectedPhone) {
        alert('Please select a phone first.');
        return;
    }
    
    document.getElementById('phone-photo-upload').click();
}

function handlePhonePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhonePhotoData = e.target.result;
            currentPhonePhotoType = 'upload';
            showPhonePhotoPreview();
        };
        reader.readAsDataURL(file);
    }
}

function showPhonePhotoPreview() {
    const previewContainer = document.getElementById('phone-photo-preview-container');
    const previewDiv = document.getElementById('phone-photo-preview');
    
    previewDiv.innerHTML = `<img src="${currentPhonePhotoData}" alt="Photo preview" style="max-width: 100%; max-height: 300px;">`;
    previewContainer.style.display = 'block';
}

function cancelPhonePhoto() {
    currentPhonePhotoData = null;
    currentPhonePhotoType = null;
    document.getElementById('phone-photo-preview-container').style.display = 'none';
    document.getElementById('phone-photo-upload').value = '';
}

function confirmPhonePhoto() {
    if (!currentPhonePhotoData || !selectedPhone) {
        alert('No photo data or phone selected.');
        return;
    }
    
    const conditionData = {
        reportedBy: document.getElementById('reported-by').value || 'Unknown',
        condition: document.getElementById('phone-condition').value || 'good',
        description: document.getElementById('phone-description').value || '',
        notes: document.getElementById('phone-notes').value || '',
        photoData: currentPhonePhotoData,
        photoType: currentPhonePhotoType
    };
    
    window.equipmentCare.addPhoneCondition(selectedPhone, conditionData);
    
    clearPhoneForm();
    loadPhoneConditionHistory(selectedPhone);
    updatePhoneInfo(selectedPhone);
    
    alert('Phone condition report added successfully!');
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
        if (window.equipmentCare.removePhoneCondition(phoneLabel, entryId)) {
            loadPhoneConditionHistory(selectedPhone);
            updatePhoneInfo(selectedPhone);
            alert('Condition entry deleted successfully!');
        } else {
            alert('Failed to delete condition entry.');
        }
    }
}

function viewFullPhonePhoto(photoData) {
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-photo" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${photoData}" alt="Full phone photo" style="max-width: 90vw; max-height: 90vh;">
        </div>
    `;
    
    document.body.appendChild(photoModal);
}

// Battery Pack Functions
function initializeBatteryPackInterface() {
    refreshBatteryPackData();
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
        alert('Please enter a battery pack number.');
        return;
    }
    
    const bpNum = parseInt(bpNumber);
    if (isNaN(bpNum) || bpNum < 1) {
        alert('Please enter a valid battery pack number.');
        return;
    }
    
    window.equipmentCare.addBatteryPackEntry(bpNum);
    
    // Clear input
    document.getElementById('battery-pack-number').value = '';
    
    // Refresh display
    refreshBatteryPackData();
    
    alert(`Battery Pack ${bpNum} added to today's inventory!`);
}

function refreshBatteryPackData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Update today's inventory
    const todayBPs = window.equipmentCare.getBatteryPackNumbersForDate(today);
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
    const stats = window.equipmentCare.getBatteryPackStats();
    
    document.getElementById('today-stats').innerHTML = `
        <div class="stat-number">${stats.today.length}</div>
        <div class="stat-label">Battery Packs</div>
    `;
    
    document.getElementById('yesterday-stats').innerHTML = `
        <div class="stat-number">${stats.yesterday.length}</div>
        <div class="stat-label">Battery Packs</div>
    `;
}

function removeBatteryPack(bpNumber, date) {
    if (confirm(`Remove Battery Pack ${bpNumber} from ${date}?`)) {
        // Find and remove the entry
        const entries = window.equipmentCare.getBatteryPackHistoryForDate(date);
        const entry = entries.find(e => e.batteryPackNumber === parseInt(bpNumber));
        
        if (entry) {
            if (window.equipmentCare.removeBatteryPackEntry(entry.id)) {
                refreshBatteryPackData();
                alert(`Battery Pack ${bpNumber} removed successfully!`);
            } else {
                alert('Failed to remove battery pack.');
            }
        }
    }
}

function viewInventoryHistory() {
    const startDate = document.getElementById('start-date-bp').value;
    const endDate = document.getElementById('end-date-bp').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }
    
    const history = window.equipmentCare.getBatteryPackHistoryForRange(startDate, endDate);
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
