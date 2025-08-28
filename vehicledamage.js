// Vehicle Damage Tool Functions
let vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
let currentImages = [];

function initVehicleDamageTool() {
    displayVehicles();
}

function handleImageUpload(event) {
    const files = event.target.files;
    currentImages = [];
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function addVehicle() {
    const vehicleId = document.getElementById('vehicle-id').value.trim();
    const vehicleType = document.getElementById('vehicle-type').value;
    const damageDescription = document.getElementById('damage-description').value.trim();
    
    if (!vehicleId || !vehicleType || !damageDescription || currentImages.length === 0) {
        alert('Please fill in all fields and upload at least one photo.');
        return;
    }
    
    const vehicle = {
        id: vehicleId,
        type: vehicleType,
        description: damageDescription,
        images: currentImages,
        date: new Date().toISOString(),
        damages: [{
            description: damageDescription,
            images: currentImages,
            date: new Date().toISOString()
        }]
    };
    
    // Check if vehicle already exists
    const existingIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (existingIndex !== -1) {
        // Add new damage to existing vehicle
        vehicles[existingIndex].damages.push({
            description: damageDescription,
            images: currentImages,
            date: new Date().toISOString()
        });
    } else {
        // Add new vehicle
        vehicles.push(vehicle);
    }
    
    // Save to localStorage
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    // Clear form
    document.getElementById('vehicle-id').value = '';
    document.getElementById('vehicle-type').value = '';
    document.getElementById('damage-description').value = '';
    currentImages = [];
    document.getElementById('damage-photos').value = '';
    
    // Refresh display
    displayVehicles();
    
    alert('Vehicle damage recorded successfully!');
}

function displayVehicles() {
    const container = document.getElementById('vehicles-container');
    
    if (vehicles.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No vehicles recorded yet. Add your first vehicle above.</p>';
        return;
    }
    
    container.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card">
            <div class="vehicle-header">
                <span class="vehicle-id">${vehicle.id}</span>
                <span class="damage-count">${vehicle.damages.length} damage(s)</span>
            </div>
            <p><strong>Type:</strong> ${vehicle.type}</p>
            <p><strong>Latest Damage:</strong> ${vehicle.damages[vehicle.damages.length - 1].description}</p>
            <div class="vehicle-images">
                ${vehicle.damages[vehicle.damages.length - 1].images.map(img => `
                    <img src="${img}" alt="Damage" class="damage-image" onclick="viewImage('${img}')">
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="viewVehicleHistory('${vehicle.id}')">View History</button>
        </div>
    `).join('');
}

function viewImage(imageSrc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(img);
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
}

function viewVehicleHistory(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    const history = vehicle.damages.map((damage, index) => `
        <div style="border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <h4>Damage #${index + 1} - ${new Date(damage.date).toLocaleDateString()}</h4>
            <p>${damage.description}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">
                ${damage.images.map(img => `
                    <img src="${img}" alt="Damage" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="viewImage('${img}')">
                `).join('')}
            </div>
        </div>
    `).join('');
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--white);
        padding: 2rem;
        border-radius: 12px;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
    `;
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>${vehicle.id} - Damage History</h2>
            <button onclick="this.closest('.modal').remove()" style="background: var(--danger); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
        ${history}
    `;
    
    modal.appendChild(content);
    modal.className = 'modal';
    document.body.appendChild(modal);
}

function takeDamagePhoto() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access not available on this device.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'camera-modal';
    modal.innerHTML = `
        <div class="camera-content">
            <h3>Take Damage Photo</h3>
            <video id="camera-video" autoplay></video>
            <div class="camera-buttons">
                <button class="btn btn-primary" onclick="captureDamagePhoto()">
                    <i class="fas fa-camera"></i> Capture
                </button>
                <button class="btn btn-secondary" onclick="closeCamera()">
                    Cancel
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
        })
        .catch(err => {
            alert('Error accessing camera: ' + err.message);
            modal.remove();
        });
}

function captureDamagePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL('image/jpeg');
    currentImages.push(photoData);
    closeCamera();
    // Optionally, update display if needed
}

function closeCamera() {
    const modal = document.querySelector('.camera-modal');
    if (modal) {
        const video = document.getElementById('camera-video');
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        modal.remove();
    }
}
