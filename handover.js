// Handover Report Functions
let handoverCurrentStep = 0;
const handoverSteps = ['date-screen', 'fleet-screen', 'equipment-screen', 'review-screen', 'handover-result-screen'];
let handoverData = {
    startDate: '',
    endDate: '',
    fleet: {
        prime: [],
        cdv: [],
        merchant: [],
        fleetSharePrime: [],
        fleetShareCdv: [],
        rental: [],
        oos: []
    },
    equipment: {},
    otherNotes: '',
    notSelectedReasons: {}
};

function initHandoverTool() {
    handoverCurrentStep = 0;
    showHandoverStep(0);
    initializeFleetGrids();
    setDefaultDates();
    document.getElementById('oos-phones-count').addEventListener('input', updateOosPhonesDetails);
}

function setDefaultDates() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    document.getElementById('start-date').value = yesterday.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
}

function initializeFleetGrids() {
    // Initialize Prime vans (0-17)
    const primeGrid = document.getElementById('prime-vans');
    primeGrid.innerHTML = '';
    for (let i = 0; i <= 17; i++) {
        const button = document.createElement('button');
        button.className = 'van-button';
        button.textContent = i;
        button.onclick = () => toggleVanSelection('prime', i, button);
        primeGrid.appendChild(button);
    }

    // Initialize CDV vans (32-40)
    const cdvGrid = document.getElementById('cdv-vans');
    cdvGrid.innerHTML = '';
    for (let i = 32; i <= 40; i++) {
        const button = document.createElement('button');
        button.className = 'van-button';
        button.textContent = i;
        button.onclick = () => toggleVanSelection('cdv', i, button);
        cdvGrid.appendChild(button);
    }

    // Initialize Merchant vans
    const merchantGrid = document.getElementById('merchant-vans');
    merchantGrid.innerHTML = '';
    [25, 30, 31, 41].forEach(num => {
        const button = document.createElement('button');
        button.className = 'van-button';
        button.textContent = num;
        button.onclick = () => toggleVanSelection('merchant', num, button);
        merchantGrid.appendChild(button);
    });

    // Initialize Fleet Share Prime vans
    const fleetSharePrimeGrid = document.getElementById('fleet-share-prime');
    fleetSharePrimeGrid.innerHTML = '';
    [18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 42, 43].forEach(num => {
        const button = document.createElement('button');
        button.className = 'van-button';
        button.textContent = num;
        button.onclick = () => toggleVanSelection('fleetSharePrime', num, button);
        fleetSharePrimeGrid.appendChild(button);
    });

    // Initialize Fleet Share CDV vans
    const fleetShareCdvGrid = document.getElementById('fleet-share-cdv');
    fleetShareCdvGrid.innerHTML = '';
    [44].forEach(num => {
        const button = document.createElement('button');
        button.className = 'van-button';
        button.textContent = num;
        button.onclick = () => toggleVanSelection('fleetShareCdv', num, button);
        fleetShareCdvGrid.appendChild(button);
    });

    // Initialize Rental vans (none)
    const rentalGrid = document.getElementById('rental-vans');
    rentalGrid.innerHTML = '<p style="color: var(--text-secondary);">No rental vans currently</p>';

    // Initialize OOS vans
    const oosGrid = document.getElementById('oos-vans');
    oosGrid.innerHTML = '';
    [4, 5, 12, 14, 15, 16, 17, 27].forEach(num => {
        const button = document.createElement('button');
        button.className = 'van-button oos';
        button.textContent = num;
        button.onclick = () => toggleVanSelection('oos', num, button);
        oosGrid.appendChild(button);
    });
}

function toggleVanSelection(category, vanNumber, button) {
    if (category === 'oos') {
        if (button.classList.contains('oos')) {
            button.classList.remove('oos');
            const index = handoverData.fleet.oos.indexOf(vanNumber);
            if (index > -1) {
                handoverData.fleet.oos.splice(index, 1);
            }
        } else {
            button.classList.add('oos');
            if (!handoverData.fleet.oos.includes(vanNumber)) {
                handoverData.fleet.oos.push(vanNumber);
            }
        }
    } else {
        button.classList.toggle('selected');
        const fleetArray = handoverData.fleet[category];
        if (button.classList.contains('selected')) {
            if (!fleetArray.includes(vanNumber)) {
                fleetArray.push(vanNumber);
            }
        } else {
            const index = fleetArray.indexOf(vanNumber);
            if (index > -1) {
                fleetArray.splice(index, 1);
            }
        }
    }
}

function selectAllVans(gridId) {
    const grid = document.getElementById(gridId);
    const buttons = grid.querySelectorAll('.van-button');
    const category = gridId.replace('-vans', '');
    buttons.forEach(btn => {
        const van = parseInt(btn.textContent);
        if (category === 'oos') {
            if (!btn.classList.contains('oos')) {
                btn.click();
            }
        } else {
            if (!btn.classList.contains('selected')) {
                btn.click();
            }
        }
    });
}

function nextHandoverStep() {
    let valid = true;
    switch(handoverCurrentStep) {
        case 0:
            handoverData.startDate = document.getElementById('start-date').value;
            handoverData.endDate = document.getElementById('end-date').value;
            if (!handoverData.startDate || !handoverData.endDate) {
                alert('Please select dates');
                valid = false;
            }
            break;
        case 1:
            collectFleetData();
            break;
        case 2:
            collectEquipmentData();
            break;
    }
    if (valid && handoverCurrentStep < handoverSteps.length - 1) {
        handoverCurrentStep++;
        showHandoverStep(handoverCurrentStep);
    }
}

function prevHandoverStep() {
    if (handoverCurrentStep > 0) {
        handoverCurrentStep--;
        showHandoverStep(handoverCurrentStep);
    }
}

function showHandoverStep(step) {
    document.querySelectorAll('.handover-interface .screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const currentScreen = document.getElementById(handoverSteps[step]);
    if (currentScreen) {
        currentScreen.classList.add('active');
    }

    document.getElementById('handover-prev-btn').disabled = (step === 0);
    document.getElementById('handover-next-btn').disabled = (step === handoverSteps.length - 1);

    if (step === 1) {
        collectFleetData();
    } else if (step === 2) {
        collectEquipmentData();
    }
}

function collectFleetData() {
    handoverData.otherNotes = document.getElementById('other-notes').value;
}

function collectEquipmentData() {
    handoverData.equipment = {
        phones: document.getElementById('phones-count').value,
        gasCards: document.getElementById('gas-cards-count').value,
        handtrucks: document.getElementById('handtrucks-count').value,
        chargers: document.getElementById('chargers-count').value,
        phoneHolders: document.getElementById('phone-holders').value,
        cables: document.getElementById('cables').value,
        walkieTalkies: document.getElementById('walkie-talkies-count').value,
        boosters: document.getElementById('boosters-count').value,
        boostersNotes: document.getElementById('boosters-notes').value,
        ipad: document.getElementById('ipad-count').value,
        missingEquipment: document.getElementById('missing-equipment').value
    };

    handoverData.equipment.oosPhones = [];
    const count = parseInt(document.getElementById('oos-phones-count').value) || 0;
    for (let i = 1; i <= count; i++) {
        const label = document.getElementById(`oos-phone-label-${i}`).value;
        const reason = document.getElementById(`oos-phone-reason-${i}`).value;
        handoverData.equipment.oosPhones.push({label, reason});
    }
}

function updateOosPhonesDetails() {
    const count = parseInt(document.getElementById('oos-phones-count').value) || 0;
    const container = document.getElementById('oos-phones-details');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <input type="text" id="oos-phone-label-${i}" placeholder="Label for OOS phone #${i}">
            <input type="text" id="oos-phone-reason-${i}" placeholder="Reason for OOS phone #${i}">
        `;
    }
}

function checkNotSelected() {
    handoverData.notSelectedReasons = {};
    const categories = {
        prime: {ids: Array.from({length: 18}, (_, i) => i), selected: handoverData.fleet.prime},
        cdv: {ids: Array.from({length: 9}, (_, i) => i + 32), selected: handoverData.fleet.cdv},
        merchant: {ids: [25,30,31,41], selected: handoverData.fleet.merchant},
        fleetSharePrime: {ids: [18,19,20,21,22,23,24,26,27,28,29,42,43], selected: handoverData.fleet.fleetSharePrime},
        fleetShareCdv: {ids: [44], selected: handoverData.fleet.fleetShareCdv},
        rental: {ids: [], selected: handoverData.fleet.rental}
    };

    for (const cat in categories) {
        const expected = categories[cat].ids;
        const selected = categories[cat].selected;
        for (const van of expected) {
            if (!selected.includes(van)) {
                const reason = prompt(`Why was van ${van} not selected in ${cat}?`);
                if (reason) {
                    handoverData.notSelectedReasons[van] = reason;
                }
            }
        }
    }
}

function displayPhotos() {
    displayPhotoGrid('van-photos', handoverData.photos.van);
    displayPhotoGrid('equipment-photos', handoverData.photos.equipment);
}

function displayPhotoGrid(containerId, photos) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo}" alt="Photo">
            <button class="remove-photo" onclick="removePhoto('${containerId}', ${index})">×</button>
        `;
        container.appendChild(photoItem);
    });
}

function removePhoto(containerId, index) {
    const photoType = containerId === 'van-photos' ? 'van' : 'equipment';
    handoverData.photos[photoType].splice(index, 1);
    displayPhotoGrid(containerId, handoverData.photos[photoType]);
}

function takePhoto(type) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access not available on this device.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'camera-modal';
    modal.innerHTML = `
        <div class="camera-content">
            <h3>Take ${type === 'van' ? 'Van' : 'Equipment'} Photo</h3>
            <video id="camera-video" autoplay></video>
            <div class="camera-buttons">
                <button class="btn btn-primary" onclick="capturePhoto('${type}')">
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

function capturePhoto(type) {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    
    handoverData.photos[type].push(photoData);
    
    closeCamera();
    displayPhotoGrid(type === 'van' ? 'van-photos' : 'equipment-photos', handoverData.photos[type]);
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

function showHandoverPreview() {
    const preview = document.getElementById('handover-preview');
    const startDate = new Date(handoverData.startDate);
    const endDate = new Date(handoverData.endDate);
    
    const previewHTML = `
        <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3>Handover Period</h3>
            <p><strong>Start:</strong> ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' })}</p>
            <p><strong>End:</strong> ${endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' })}</p>
        </div>
        
        <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3>Fleet Summary</h3>
            <p><strong>Prime Vans:</strong> ${handoverData.fleet.prime.length > 0 ? handoverData.fleet.prime.join(', ') : 'None selected'}</p>
            <p><strong>CDV Vans:</strong> ${handoverData.fleet.cdv.length > 0 ? handoverData.fleet.cdv.join(', ') : 'None selected'}</p>
            <p><strong>OOS Vans:</strong> ${handoverData.fleet.oos.length > 0 ? handoverData.fleet.oos.join(', ') : 'None'}</p>
        </div>
    `;
    
    preview.innerHTML = previewHTML;
}

function generateHandoverReport() {
    const startDate = new Date(handoverData.startDate + 'T12:00:00');
    const endDate = new Date(handoverData.endDate + 'T12:00:00');
    
    Object.keys(handoverData.fleet).forEach(key => {
        handoverData.fleet[key].sort((a, b) => a - b);
    });
    
    let report = `📱🚨HANDOVER🚨📱\n\n`;
    report += `DATE: ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' })}\n\n`;
    
    report += `● AMAZON BRANDED VANS:\n`;
    report += `  ○ Prime(${handoverData.fleet.prime.length > 0 ? handoverData.fleet.prime.join(', ') : 'none'})\n`;
    report += `  ○ CDV(${handoverData.fleet.cdv.length > 0 ? handoverData.fleet.cdv.join(', ') : 'none'})\n`;
    report += `● MERCHANT VANS:\n`;
    report += `  ○ ${handoverData.fleet.merchant.length > 0 ? handoverData.fleet.merchant.join(', ') : 'none'}\n`;
    report += `● FLEET SHARE VANS:\n`;
    report += `  ○ Prime (${handoverData.fleet.fleetSharePrime.length > 0 ? handoverData.fleet.fleetSharePrime.join(', ') : 'none'})\n`;
    report += `  ○ CDV (${handoverData.fleet.fleetShareCdv.length > 0 ? handoverData.fleet.fleetShareCdv.join(', ') : 'none'})\n`;
    report += `● RENTAL VANS:\n`;
    report += `  ○ ${handoverData.fleet.rental.length > 0 ? handoverData.fleet.rental.join(', ') : 'none'}\n`;
    report += `● OOS VANS:\n`;
    report += `  ○ ${handoverData.fleet.oos.length > 0 ? handoverData.fleet.oos.join(',') : 'none'}\n`;
    
    if (Object.keys(handoverData.notSelectedReasons).length > 0) {
        report += `● NOT SELECTED VANS:\n`;
        for (const van in handoverData.notSelectedReasons) {
            report += `  ○ Van ${van}: ${handoverData.notSelectedReasons[van]}\n`;
        }
    }
    
    if (handoverData.otherNotes) {
        report += `● OTHER:\n  ○ ${handoverData.otherNotes}\n`;
    }
    
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● PHONES:\n`;
    report += `  ○ Total: ${handoverData.equipment.phones} (Includes ORS)\n`;
    if (handoverData.equipment.oosPhones.length > 0) {
        report += `  ○ OOS: ${handoverData.equipment.oosPhones.length}\n`;
        handoverData.equipment.oosPhones.forEach(p => {
            report += `    ○ Phone ${p.label}: ${p.reason}\n`;
        });
    } else {
        report += `  ○ OOS: none\n`;
    }
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● GAS CARDS:\n`;
    report += `  ○ Total: ${handoverData.equipment.gasCards}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● HANDTRUCKS:\n`;
    report += `  ○ Total: ${handoverData.equipment.handtrucks}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● PORTABLE CHARGERS:\n`;
    report += `  ○ Total: ${handoverData.equipment.chargers}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● EXTRA EQUIPMENT IN CAGE:\n`;
    report += `  ○ Phone holders: ${handoverData.equipment.phoneHolders}\n`;
    report += `  ○ Cables: ${handoverData.equipment.cables}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● WALKIE TALKIES:\n`;
    report += `  ○ Total: ${handoverData.equipment.walkieTalkies}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● BOOSTERS:\n`;
    report += `  ○ Total: ${handoverData.equipment.boosters}`;
    if (handoverData.equipment.boostersNotes) {
        report += ` (${handoverData.equipment.boostersNotes})`;
    }
    report += `\n${'-'.repeat(100)}\n\n`;
    
    report += `● IPAD:\n`;
    report += `  ○ Total: ${handoverData.equipment.ipad}\n`;
    report += `${'-'.repeat(100)}\n\n`;
    
    report += `● EQUIPMENT MISSING/NEED TO ORDER:\n`;
    report += `  ○ ${handoverData.equipment.missingEquipment || 'none'}`;
    
    document.getElementById('handover-summary-text').value = report;
    nextHandoverStep();
}

function copyHandoverSummary() {
    const summaryText = document.getElementById('handover-summary-text').value;
    navigator.clipboard.writeText(summaryText).then(() => {
        alert('Handover summary copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please select and copy manually.');
    });
}

// Initialize event listeners when the tool is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for OOS phones count
    const oosPhonesCountInput = document.getElementById('oos-phones-count');
    if (oosPhonesCountInput) {
        oosPhonesCountInput.addEventListener('input', updateOosPhonesDetails);
    }
});
