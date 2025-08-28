// Vehicle Damage Check Tool - Updated for Centralized Fleet Management
// This tool now works with the fleet manager and damage history systems

let selectedVehicle = null;
let currentPhotoData = null;
let currentPhotoType = null;

function initVehicleDamageTool() {
    // Show the vehicle selection screen
    showVehicleSelectionScreen();
    
    // Populate the fleet vehicles
    populateFleetVehicles();
}

function showVehicleSelectionScreen() {
    document.getElementById('vehicle-selection-screen').style.display = 'block';
    document.getElementById('vehicle-damage-screen').style.display = 'none';
}

function showVehicleDamageScreen() {
    document.getElementById('vehicle-selection-screen').style.display = 'none';
    document.getElementById('vehicle-damage-screen').style.display = 'block';
}

function backToVehicleSelection() {
    showVehicleSelectionScreen();
    selectedVehicle = null;
    currentPhotoData = null;
    currentPhotoType = null;
}

function populateFleetVehicles() {
    // Get all vehicles from the fleet manager
    const allVehicles = window.fleetManager.getAllVehicles();
    
    // Clear existing grids
    document.getElementById('branded-vehicles').innerHTML = '';
    document.getElementById('fleet-share-vehicles').innerHTML = '';
    document.getElementById('merchant-vehicles').innerHTML = '';
    document.getElementById('rental-vehicles').innerHTML = '';
    document.getElementById('oos-vehicles').innerHTML = '';
    
    // Populate each category
    allVehicles.forEach(vehicle => {
        const vehicleElement = createVehicleElement(vehicle);
        
        if (vehicle.category === 'branded') {
            document.getElementById('branded-vehicles').appendChild(vehicleElement);
        } else if (vehicle.category === 'fleetShare') {
            document.getElementById('fleet-share-vehicles').appendChild(vehicleElement);
        } else if (vehicle.category === 'merchant') {
            document.getElementById('merchant-vehicles').appendChild(vehicleElement);
        } else if (vehicle.category === 'rental') {
            document.getElementById('rental-vehicles').appendChild(vehicleElement);
        } else if (vehicle.category === 'oos') {
            document.getElementById('oos-vehicles').appendChild(vehicleElement);
        }
    });
}

function createVehicleElement(vehicle) {
    const vehicleDiv = document.createElement('div');
    vehicleDiv.className = 'vehicle-item';
    vehicleDiv.onclick = () => selectVehicle(vehicle);
    
    // Get damage stats for this vehicle
    const stats = window.damageHistory.getVehicleDamageStats(vehicle.id);
    
    vehicleDiv.innerHTML = `
        <div class="vehicle-number">${vehicle.number}</div>
        <div class="vehicle-type">${vehicle.type}</div>
        <div class="vehicle-damage-count">
            <i class="fas fa-exclamation-triangle"></i> ${stats.totalEntries} damage reports
        </div>
        ${stats.lastDamage ? `<div class="last-damage">Last: ${new Date(stats.lastDamage).toLocaleDateString()}</div>` : ''}
    `;
    
    return vehicleDiv;
}

function selectVehicle(vehicle) {
    selectedVehicle = vehicle;
    showVehicleDamageScreen();
    loadVehicleDamageHistory(vehicle);
    updateVehicleInfo(vehicle);
}

function updateVehicleInfo(vehicle) {
    document.getElementById('selected-vehicle-title').textContent = `Vehicle ${vehicle.number} - ${vehicle.type}`;
    document.getElementById('vehicle-summary-title').textContent = `Vehicle ${vehicle.number} - ${vehicle.type}`;
    
    // Update damage statistics
    const stats = window.damageHistory.getVehicleDamageStats(vehicle.id);
    const statsDiv = document.getElementById('damage-stats');
    
    statsDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Total Damage Reports:</span>
            <span class="stat-value">${stats.totalEntries}</span>
        </div>
        ${stats.lastDamage ? `
        <div class="stat-item">
            <span class="stat-label">Last Damage:</span>
            <span class="stat-value">${new Date(stats.lastDamage).toLocaleDateString()}</span>
        </div>
        ` : ''}
        <div class="stat-item">
            <span class="stat-label">Severity Breakdown:</span>
            <span class="stat-value">${Object.entries(stats.severityBreakdown).map(([severity, count]) => `${severity}: ${count}`).join(', ') || 'None'}</span>
        </div>
    `;
}

function loadVehicleDamageHistory(vehicle) {
    const history = window.damageHistory.getVehicleDamageHistory(vehicle.id);
    const historyDiv = document.getElementById('damage-history-list');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="no-damage">No damage history found for this vehicle.</p>';
        return;
    }
    
    historyDiv.innerHTML = history.map(entry => `
        <div class="damage-entry">
            <div class="damage-header">
                <span class="damage-date">${new Date(entry.date).toLocaleDateString()}</span>
                <span class="damage-severity ${entry.severity}">${entry.severity.toUpperCase()}</span>
            </div>
            <div class="damage-content">
                <div class="damage-info">
                    <p><strong>Driver:</strong> ${entry.driver}</p>
                    <p><strong>Description:</strong> ${entry.description}</p>
                    <p><strong>Location:</strong> ${entry.location}</p>
                    ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
                </div>
                ${entry.photoData ? `
                <div class="damage-photo">
                    <img src="${entry.photoData}" alt="Damage photo" onclick="viewFullPhoto('${entry.photoData}')">
                </div>
                ` : ''}
            </div>
            <div class="damage-actions">
                <button class="btn btn-small btn-secondary" onclick="editDamageEntry('${vehicle.id}', '${entry.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteDamageEntry('${vehicle.id}', '${entry.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function takeDamagePhoto() {
    if (!selectedVehicle) {
        alert('Please select a vehicle first.');
        return;
    }
    
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not available in your browser.');
        return;
    }
    
    // Create camera modal
    const cameraModal = document.createElement('div');
    cameraModal.className = 'camera-modal';
    cameraModal.innerHTML = `
        <div class="camera-content">
            <h3>Take Damage Photo</h3>
            <video id="camera-video" autoplay></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div class="camera-controls">
                <button class="btn btn-primary" onclick="capturePhoto()">
                    <i class="fas fa-camera"></i> Capture Photo
                </button>
                <button class="btn btn-secondary" onclick="closeCamera()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cameraModal);
    
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
            window.cameraStream = stream;
        })
        .catch(err => {
            alert('Error accessing camera: ' + err.message);
            document.body.removeChild(cameraModal);
        });
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    currentPhotoData = canvas.toDataURL('image/jpeg', 0.8);
    currentPhotoType = 'camera';
    
    // Close camera and show preview
    closeCamera();
    showPhotoPreview();
}

function closeCamera() {
    if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        window.cameraStream = null;
    }
    
    const cameraModal = document.querySelector('.camera-modal');
    if (cameraModal) {
        document.body.removeChild(cameraModal);
    }
}

function uploadDamagePhoto() {
    if (!selectedVehicle) {
        alert('Please select a vehicle first.');
        return;
    }
    
    document.getElementById('damage-photo-upload').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhotoData = e.target.result;
            currentPhotoType = 'upload';
            showPhotoPreview();
        };
        reader.readAsDataURL(file);
    }
}

function showPhotoPreview() {
    const previewContainer = document.getElementById('photo-preview-container');
    const previewDiv = document.getElementById('photo-preview');
    
    previewDiv.innerHTML = `<img src="${currentPhotoData}" alt="Photo preview" style="max-width: 100%; max-height: 300px;">`;
    previewContainer.style.display = 'block';
}

function cancelPhoto() {
    currentPhotoData = null;
    currentPhotoType = null;
    document.getElementById('photo-preview-container').style.display = 'none';
    document.getElementById('damage-photo-upload').value = '';
}

function confirmPhoto() {
    if (!currentPhotoData || !selectedVehicle) {
        alert('No photo data or vehicle selected.');
        return;
    }
    
    // Get form data
    const damageData = {
        driver: document.getElementById('driver-name').value || 'Unknown',
        description: document.getElementById('damage-description').value || '',
        severity: document.getElementById('damage-severity').value || 'minor',
        location: document.getElementById('damage-location').value || '',
        notes: document.getElementById('damage-notes').value || '',
        photoData: currentPhotoData,
        photoType: currentPhotoType
    };
    
    // Add damage entry
    window.damageHistory.addDamageEntry(selectedVehicle.id, damageData);
    
    // Clear form and photo
    clearDamageForm();
    
    // Reload damage history
    loadVehicleDamageHistory(selectedVehicle);
    updateVehicleInfo(selectedVehicle);
    
    // Show success message
    alert('Damage report added successfully!');
}

function clearDamageForm() {
    document.getElementById('driver-name').value = '';
    document.getElementById('damage-description').value = '';
    document.getElementById('damage-severity').value = 'minor';
    document.getElementById('damage-location').value = '';
    document.getElementById('damage-notes').value = '';
    cancelPhoto();
}

function editDamageEntry(vehicleId, entryId) {
    // Implementation for editing damage entries
    alert('Edit functionality coming soon!');
}

function deleteDamageEntry(vehicleId, entryId) {
    if (confirm('Are you sure you want to delete this damage entry?')) {
        if (window.damageHistory.removeDamageEntry(vehicleId, entryId)) {
            loadVehicleDamageHistory(selectedVehicle);
            updateVehicleInfo(selectedVehicle);
            alert('Damage entry deleted successfully!');
        } else {
            alert('Failed to delete damage entry.');
        }
    }
}

function viewFullPhoto(photoData) {
    // Create modal to view full-size photo
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-photo" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${photoData}" alt="Full damage photo" style="max-width: 90vw; max-height: 90vh;">
        </div>
    `;
    
    document.body.appendChild(photoModal);
}
