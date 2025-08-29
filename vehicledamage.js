// Vehicle Damage Check Tool - Updated for Centralized Fleet Management
// This tool now works with the fleet manager and damage history systems

let selectedVehicle = null;
let currentPhotoData = null;
let currentPhotoType = null;

function initVehicleDamageTool() {
    // Show the vehicle selection screen
    showVehicleSelectionScreen();
    
    // Force sync with handover data to ensure latest fleet information
    if (window.fleetManager && window.handoverData) {
        console.log('Vehicle Damage Check: Forcing sync with handover data');
        window.fleetManager.syncWithHandoverData(window.handoverData);
    }
    
    // Refresh fleet data from FleetManager and populate vehicles
    refreshFleetData();
    populateFleetVehicles();
}

function refreshFleetData() {
    // Ensure FleetManager has the latest data
    if (window.fleetManager && window.fleetManager.getFleetSummary) {
        const summary = window.fleetManager.getFleetSummary();
        console.log('Current Fleet Summary:', summary);
        
        // Force re-initialization if needed
        if (summary.branded.prime === 0 && summary.branded.cdv === 0) {
            console.log('Fleet data appears empty, re-initializing...');
            window.fleetManager.initializeDefaultFleet();
        }
    }
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
    
    console.log('All vehicles from FleetManager:', allVehicles);
    console.log('FleetManager data:', window.fleetManager.fleetData);
    
    // Clear existing grids
    document.getElementById('branded-vehicles').innerHTML = '';
    document.getElementById('fleet-share-vehicles').innerHTML = '';
    document.getElementById('merchant-vehicles').innerHTML = '';
    document.getElementById('rental-vehicles').innerHTML = '';
    
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
        }
    });
    
    // Log what was added to each category
    console.log('Branded vehicles count:', document.getElementById('branded-vehicles').children.length);
    console.log('Fleet Share vehicles count:', document.getElementById('fleet-share-vehicles').children.length);
    console.log('Merchant vehicles count:', document.getElementById('merchant-vehicles').children.length);
    console.log('Rental vehicles count:', document.getElementById('rental-vehicles').children.length);
}

function createVehicleElement(vehicle) {
    const vehicleDiv = document.createElement('div');
    vehicleDiv.className = 'vehicle-item';
    vehicleDiv.onclick = () => selectVehicle(vehicle);
    
    vehicleDiv.innerHTML = `
        <div class="vehicle-number">${vehicle.number}</div>
        <div class="vehicle-type">${vehicle.type}</div>
    `;
    
    return vehicleDiv;
}

function selectVehicle(vehicle) {
    selectedVehicle = vehicle;
    showVehicleDamageScreen();
    loadVehicleDamagePhotos(vehicle.id);
    updateVehicleInfo(vehicle);
}

function updateVehicleInfo(vehicle) {
    document.getElementById('selected-vehicle-title').textContent = `Vehicle ${vehicle.number} - ${vehicle.type}`;
}

function loadVehicleDamagePhotos(vehicleId) {
    const history = window.damageHistory.getVehicleDamageHistory(vehicleId);
    const photosGrid = document.getElementById('damage-photos-grid');
    
    if (history.length === 0) {
        photosGrid.innerHTML = '<p class="no-damage">No damage photos found for this vehicle.</p>';
        return;
    }
    
    photosGrid.innerHTML = history.map(entry => `
        <div class="damage-photo-item">
            <img src="${entry.photoData || 'placeholder.jpg'}" alt="Damage photo" onclick="viewFullPhoto('${entry.photoData}')">
            <div class="photo-info">
                <div class="photo-date">${new Date(entry.date).toLocaleDateString()}</div>
                ${entry.driver ? `<div class="photo-driver">Driver: ${entry.driver}</div>` : ''}
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
    
    // Show photo modal
    document.getElementById('photo-modal').style.display = 'block';
    
    // Start camera with back camera preference
    const constraints = {
        video: {
            facingMode: { ideal: 'environment' } // Prefer back camera
        }
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const video = document.getElementById('camera-feed');
            video.srcObject = stream;
            currentStream = stream;
            document.getElementById('camera-container').style.display = 'block';
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
            // Fallback to any available camera
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    const video = document.getElementById('camera-feed');
                    video.srcObject = stream;
                    currentStream = stream;
                    document.getElementById('camera-feed');
                    video.srcObject = stream;
                    currentStream = stream;
                    document.getElementById('camera-container').style.display = 'block';
                })
                .catch(fallbackErr => {
                    console.error('Fallback camera error:', fallbackErr);
                    alert('Unable to access camera. Please check permissions.');
                });
        });
}

function capturePhoto() {
    const video = document.getElementById('camera-feed');
    const canvas = document.createElement('canvas');
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
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    
    document.getElementById('camera-container').style.display = 'none';
}

function uploadDamagePhoto() {
    if (!selectedVehicle) {
        alert('Please select a vehicle first.');
        return;
    }
    
    // Hide camera container and show upload section
    document.getElementById('camera-container').style.display = 'none';
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
    
    // Set default date to today
    document.getElementById('photo-date').value = new Date().toISOString().split('T')[0];
}

function cancelPhoto() {
    currentPhotoData = null;
    currentPhotoType = null;
    document.getElementById('photo-preview-container').style.display = 'none';
    document.getElementById('damage-photo-upload').value = '';
    document.getElementById('photo-modal').style.display = 'none';
}

function confirmPhoto() {
    if (!currentPhotoData || !selectedVehicle) {
        alert('No photo data or vehicle selected.');
        return;
    }
    
    // Get form data
    const damageData = {
        driver: document.getElementById('driver-name').value || '',
        date: document.getElementById('photo-date').value || new Date().toISOString().split('T')[0],
        photoData: currentPhotoData,
        photoType: currentPhotoType
    };
    
    // Add damage entry
    window.damageHistory.addDamageEntry(selectedVehicle.id, damageData);
    
    // Clear form and photo
    clearDamageForm();
    
    // Reload damage photos
    loadVehicleDamagePhotos(selectedVehicle.id);
    
    // Show success message
    alert('Damage photo added successfully!');
}

function clearDamageForm() {
    document.getElementById('driver-name').value = '';
    document.getElementById('photo-date').value = new Date().toISOString().split('T')[0];
    cancelPhoto();
}

function editDamageEntry(vehicleId, entryId) {
    // Implementation for editing damage entries
    alert('Edit functionality coming soon!');
}

function deleteDamageEntry(vehicleId, entryId) {
    if (confirm('Are you sure you want to delete this damage photo?')) {
        if (window.damageHistory.removeDamageEntry(vehicleId, entryId)) {
            loadVehicleDamagePhotos(vehicleId);
            alert('Damage photo deleted successfully!');
        } else {
            alert('Failed to delete damage photo.');
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
