/**
 * UEMP Operations Hub V2 - Vehicle Damage Check Tool
 * Handles photo-based vehicle damage tracking
 */

// ========================================
// Vehicle Damage State Management
// ========================================

class VehicleDamageState {
    constructor() {
        this.selectedVehicle = null;
        this.currentPhotoData = null;
        this.currentPhotoType = null;
        this.currentScreen = 'vehicle-selection-screen';
    }

    setSelectedVehicle(vehicle) {
        this.selectedVehicle = vehicle;
    }

    setPhotoData(data, type) {
        this.currentPhotoData = data;
        this.currentPhotoType = type;
    }

    clearPhotoData() {
        this.currentPhotoData = null;
        this.currentPhotoType = null;
    }

    setScreen(screenId) {
        this.currentScreen = screenId;
    }

    reset() {
        this.selectedVehicle = null;
        this.clearPhotoData();
        this.setScreen('vehicle-selection-screen');
    }
}

// Initialize vehicle damage state
const vehicleDamageState = new VehicleDamageState();

// ========================================
// UI Management
// ========================================

function initVehicleDamageTool() {
    console.log('Initializing Vehicle Damage Tool');
    vehicleDamageState.reset();
    showVehicleDamageScreen('vehicle-selection-screen');
    populateFleetVehicles();

    // Set default date
    document.getElementById('photo-date').value = new Date().toISOString().split('T')[0];
}

function showVehicleDamageScreen(screenId) {
    vehicleDamageState.setScreen(screenId);

    // Hide all screens
    document.querySelectorAll('#vehicle-damage-interface .interface-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// ========================================
// Fleet Vehicle Management
// ========================================

function populateFleetVehicles() {
    // Clear existing grids
    document.getElementById('branded-vehicles').innerHTML = '';
    document.getElementById('fleet-share-vehicles').innerHTML = '';
    document.getElementById('merchant-vehicles').innerHTML = '';
    document.getElementById('rental-vehicles').innerHTML = '';

    if (!window.fleetManager) {
        console.error('FleetManager not available');
        return;
    }

    // Get all vehicles from FleetManager
    const allVehicles = window.fleetManager.getAllVehicles();
    console.log('Populating vehicles:', allVehicles.length);

    // Group vehicles by category
    const vehiclesByCategory = {
        branded: allVehicles.filter(v => v.category === 'branded'),
        fleetShare: allVehicles.filter(v => v.category === 'fleetShare'),
        merchant: allVehicles.filter(v => v.category === 'merchant'),
        rental: allVehicles.filter(v => v.category === 'rental')
    };

    // Populate each category
    Object.entries(vehiclesByCategory).forEach(([category, vehicles]) => {
        const gridId = category === 'fleetShare' ? 'fleet-share-vehicles' : `${category}-vehicles`;
        const grid = document.getElementById(gridId);

        vehicles.forEach(vehicle => {
            const vehicleElement = createVehicleElement(vehicle);
            grid.appendChild(vehicleElement);
        });
    });
}

function createVehicleElement(vehicle) {
    const vehicleDiv = document.createElement('div');
    vehicleDiv.className = 'vehicle-item';
    vehicleDiv.onclick = () => selectVehicle(vehicle);

    vehicleDiv.innerHTML = `
        <div class="vehicle-number">${vehicle.number}</div>
        <div class="vehicle-type">${vehicle.type}</div>
        <div class="vehicle-damage-count">${getVehicleDamageCount(vehicle.id)}</div>
    `;

    return vehicleDiv;
}

function getVehicleDamageCount(vehicleId) {
    if (!window.damageHistory) return 0;
    const history = window.damageHistory.getVehicleDamageHistory(vehicleId);
    return history.length;
}

function selectVehicle(vehicle) {
    vehicleDamageState.setSelectedVehicle(vehicle);
    showVehicleDamageScreen('vehicle-damage-screen');
    updateVehicleInfo(vehicle);
    loadVehicleDamagePhotos(vehicle.id);
}

function updateVehicleInfo(vehicle) {
    document.getElementById('selected-vehicle-title').textContent = `Vehicle ${vehicle.number} - ${vehicle.type}`;
}

function backToVehicleSelection() {
    vehicleDamageState.reset();
    showVehicleDamageScreen('vehicle-selection-screen');
}

// ========================================
// Photo Management
// ========================================

function takeDamagePhoto() {
    if (!vehicleDamageState.selectedVehicle) {
        showNotification('Please select a vehicle first', 'error');
        return;
    }

    // In a real implementation, this would trigger camera
    // For now, we'll use file upload as fallback
    uploadDamagePhoto();
}

function uploadDamagePhoto() {
    document.getElementById('damage-photo-upload').click();
}

function handleDamagePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            vehicleDamageState.setPhotoData(e.target.result, 'upload');
            showPhotoPreview();
        };
        reader.readAsDataURL(file);
    }
}

function showPhotoPreview() {
    const previewContainer = document.getElementById('photo-preview-container');
    const previewDiv = document.getElementById('photo-preview');

    previewDiv.innerHTML = `<img src="${vehicleDamageState.currentPhotoData}" alt="Damage photo preview" style="max-width: 100%; max-height: 300px;">`;
    previewContainer.style.display = 'block';

    // Show modal
    document.getElementById('photo-modal').style.display = 'block';
}

function confirmDamagePhoto() {
    if (!vehicleDamageState.currentPhotoData || !vehicleDamageState.selectedVehicle) {
        showNotification('No photo data or vehicle selected', 'error');
        return;
    }

    // Get form data
    const damageData = {
        driver: document.getElementById('driver-name').value || '',
        date: document.getElementById('photo-date').value || new Date().toISOString().split('T')[0],
        photoData: vehicleDamageState.currentPhotoData,
        photoType: vehicleDamageState.currentPhotoType,
        description: document.getElementById('damage-description').value || '',
        severity: document.getElementById('damage-severity').value || 'minor',
        location: document.getElementById('damage-location').value || ''
    };

    // Add damage entry
    if (window.damageHistory) {
        window.damageHistory.addDamageEntry(vehicleDamageState.selectedVehicle.id, damageData);
    }

    // Clear form and reload
    clearDamageForm();
    loadVehicleDamagePhotos(vehicleDamageState.selectedVehicle.id);

    showNotification('Damage photo added successfully!', 'success');
}

function cancelDamagePhoto() {
    vehicleDamageState.clearPhotoData();
    document.getElementById('photo-preview-container').style.display = 'none';
    document.getElementById('damage-photo-upload').value = '';
    document.getElementById('photo-modal').style.display = 'none';
}

function clearDamageForm() {
    document.getElementById('driver-name').value = '';
    document.getElementById('photo-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('damage-description').value = '';
    document.getElementById('damage-severity').value = 'minor';
    document.getElementById('damage-location').value = '';
    cancelDamagePhoto();
}

// ========================================
// Damage History Management
// ========================================

function loadVehicleDamagePhotos(vehicleId) {
    const photosGrid = document.getElementById('damage-photos-grid');

    if (!window.damageHistory) {
        photosGrid.innerHTML = '<p class="no-damage">Damage history system not available</p>';
        return;
    }

    const history = window.damageHistory.getVehicleDamageHistory(vehicleId);

    if (history.length === 0) {
        photosGrid.innerHTML = '<p class="no-damage">No damage photos found for this vehicle.</p>';
        return;
    }

    photosGrid.innerHTML = history.map(entry => `
        <div class="damage-photo-item">
            <img src="${entry.photoData || 'placeholder.jpg'}" alt="Damage photo" onclick="viewFullDamagePhoto('${entry.photoData}')">
            <div class="photo-info">
                <div class="photo-date">${new Date(entry.date).toLocaleDateString()}</div>
                ${entry.driver ? `<div class="photo-driver">Driver: ${entry.driver}</div>` : ''}
                ${entry.severity ? `<div class="photo-severity severity-${entry.severity}">${entry.severity.toUpperCase()}</div>` : ''}
            </div>
            <div class="photo-actions">
                <button class="btn btn-small btn-danger" onclick="deleteDamageEntry('${vehicleId}', '${entry.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function viewFullDamagePhoto(photoData) {
    // Create modal to view full-size photo
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-photo" onclick="this.parentElement.remove()">&times;</span>
            <img src="${photoData}" alt="Full damage photo" style="max-width: 90vw; max-height: 90vh;">
        </div>
    `;

    document.body.appendChild(photoModal);
}

function deleteDamageEntry(vehicleId, entryId) {
    if (confirm('Are you sure you want to delete this damage photo?')) {
        if (window.damageHistory && window.damageHistory.removeDamageEntry(vehicleId, entryId)) {
            loadVehicleDamagePhotos(vehicleId);
            showNotification('Damage photo deleted successfully!', 'success');
        } else {
            showNotification('Failed to delete damage photo', 'error');
        }
    }
}

// ========================================
// Utility Functions
// ========================================

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    }
}

// ========================================
// Initialization
// ========================================

console.log('Vehicle Damage Tool loaded and ready');
