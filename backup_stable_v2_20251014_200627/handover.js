/**
 * UEMP Operations Hub V2 - Handover Report Tool
 * Handles fleet and equipment handover reporting
 */

// ========================================
// Handover State Management
// ========================================

class HandoverState {
    constructor() {
        this.currentStep = 0;
        this.data = {
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
            notes: '',
            notSelectedReasons: {}
        };
        this.steps = ['handover-date-screen', 'handover-fleet-screen', 'handover-equipment-screen', 'handover-review-screen', 'handover-report-screen'];
    }

    setDates(startDate, endDate) {
        this.data.startDate = startDate;
        this.data.endDate = endDate;
    }

    setFleetData(fleetData) {
        this.data.fleet = { ...fleetData };
    }

    setEquipmentData(equipmentData) {
        this.data.equipment = { ...equipmentData };
    }

    setNotes(notes) {
        this.data.notes = notes;
    }

    setNotSelectedReasons(reasons) {
        this.data.notSelectedReasons = { ...reasons };
    }

    reset() {
        this.currentStep = 0;
        this.data = {
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
            notes: '',
            notSelectedReasons: {}
        };
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            return true;
        }
        return false;
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            return true;
        }
        return false;
    }

    getCurrentStepId() {
        return this.steps[this.currentStep];
    }
}

// Initialize handover state
const handoverState = new HandoverState();

// ========================================
// UI Management
// ========================================

function initHandoverTool() {
    console.log('Initializing Handover Tool');
    handoverState.reset();
    showHandoverScreen(0);
    initializeFleetGrids();
    setDefaultDates();
    updateOosPhonesDetails();
}

function showHandoverScreen(stepIndex) {
    handoverState.currentStep = stepIndex;
    const currentScreenId = handoverState.getCurrentStepId();

    // Hide all screens
    document.querySelectorAll('#handover-interface .interface-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show current screen
    const currentScreen = document.getElementById(currentScreenId);
    if (currentScreen) {
        currentScreen.classList.add('active');
    }

    // Update navigation
    updateHandoverNavigation();

    // Load data for current step
    if (stepIndex === 1) {
        refreshFleetData();
    } else if (stepIndex === 2) {
        // Equipment screen - no data loading needed, form is ready
    } else if (stepIndex === 3) {
        showHandoverPreview();
    }
}

function updateHandoverNavigation() {
    const prevBtn = document.getElementById('handover-prev-btn');
    const nextBtn = document.getElementById('handover-next-btn');

    if (prevBtn) {
        prevBtn.disabled = handoverState.currentStep === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = handoverState.currentStep === handoverState.steps.length - 1;
    }
}

// ========================================
// Event Handlers
// ========================================

function startHandover(event) {
    event.preventDefault();

    const startDate = document.getElementById('handover-start-date').value;
    const endDate = document.getElementById('handover-end-date').value;

    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showNotification('End date must be after start date', 'error');
        return;
    }

    handoverState.setDates(startDate, endDate);
    showHandoverScreen(1);
}

function nextHandoverScreen() {
    let valid = true;

    switch(handoverState.currentStep) {
        case 0:
            handoverState.setDates(
                document.getElementById('handover-start-date').value,
                document.getElementById('handover-end-date').value
            );
            break;
        case 1:
            collectFleetData();
            break;
        case 2:
            collectEquipmentData();
            break;
    }

    if (valid && handoverState.nextStep()) {
        showHandoverScreen(handoverState.currentStep);
    }
}

function prevHandoverScreen() {
    if (handoverState.prevStep()) {
        showHandoverScreen(handoverState.currentStep);
    }
}

function collectFleetData() {
    handoverState.setNotes(document.getElementById('handover-notes').value);
    // Fleet data is already collected in real-time via toggleVanSelection
}

function collectEquipmentData() {
    const equipmentData = {
        phones: parseInt(document.getElementById('phones-count').value) || 0,
        gasCards: parseInt(document.getElementById('gas-cards-count').value) || 0,
        handtrucks: parseInt(document.getElementById('handtrucks-count').value) || 0,
        chargers: parseInt(document.getElementById('chargers-count').value) || 0,
        phoneHolders: parseInt(document.getElementById('phone-holders-count').value) || 0,
        cables: document.getElementById('cables-description').value || 'none',
        walkieTalkies: parseInt(document.getElementById('walkie-talkies-count').value) || 0,
        boosters: parseInt(document.getElementById('boosters-count').value) || 0,
        boostersNotes: document.getElementById('boosters-notes').value || '',
        ipad: parseInt(document.getElementById('ipads-count').value) || 0,
        oosPhones: [],
        missingEquipment: document.getElementById('missing-equipment').value || ''
    };

    // Collect OOS phone details
    const oosCount = parseInt(document.getElementById('oos-phones-count').value) || 0;
    for (let i = 1; i <= oosCount; i++) {
        const label = document.getElementById(`oos-phone-label-${i}`).value;
        const reason = document.getElementById(`oos-phone-reason-${i}`).value;
        if (label && reason) {
            equipmentData.oosPhones.push({label, reason});
        }
    }

    handoverState.setEquipmentData(equipmentData);
}

// ========================================
// Fleet Management
// ========================================

function setDefaultDates() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    document.getElementById('handover-start-date').value = yesterday.toISOString().split('T')[0];
    document.getElementById('handover-end-date').value = today.toISOString().split('T')[0];
}

function initializeFleetGrids() {
    // Initialize Prime vans (0-17)
    initializeVanGrid('handover-prime-vans', 'prime', Array.from({length: 18}, (_, i) => i));

    // Initialize CDV vans (32-40)
    initializeVanGrid('handover-cdv-vans', 'cdv', Array.from({length: 9}, (_, i) => i + 32));

    // Initialize Merchant vans
    initializeVanGrid('handover-merchant-vans', 'merchant', [25, 30, 31, 41]);

    // Initialize Fleet Share Prime vans
    initializeVanGrid('handover-fleet-share-prime', 'fleetSharePrime', [18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 42, 43]);

    // Initialize Fleet Share CDV vans
    initializeVanGrid('handover-fleet-share-cdv', 'fleetShareCdv', [44]);

    // Initialize Rental vans (empty)
    initializeVanGrid('handover-rental-vans', 'rental', []);

    // Initialize OOS vans
    initializeVanGrid('handover-oos-vans', 'oos', [4, 5, 12, 14, 15, 16, 17, 27], true);
}

function initializeVanGrid(gridId, category, vanNumbers, isOos = false) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';

    if (vanNumbers.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary);">No vans in this category</p>';
        return;
    }

    vanNumbers.forEach(vanNumber => {
        const button = document.createElement('button');
        button.className = `van-button ${isOos ? 'oos' : ''}`;
        button.textContent = vanNumber;
        button.onclick = () => toggleVanSelection(category, vanNumber, button);
        grid.appendChild(button);

        // Initialize in state
        if (!handoverState.data.fleet[category].includes(vanNumber)) {
            handoverState.data.fleet[category].push(vanNumber);
        }
    });
}

function toggleVanSelection(category, vanNumber, button) {
    if (category === 'oos') {
        if (button.classList.contains('oos')) {
            button.classList.remove('oos');
            const index = handoverState.data.fleet.oos.indexOf(vanNumber);
            if (index > -1) {
                handoverState.data.fleet.oos.splice(index, 1);
            }
        } else {
            button.classList.add('oos');
            if (!handoverState.data.fleet.oos.includes(vanNumber)) {
                handoverState.data.fleet.oos.push(vanNumber);
            }
        }
    } else {
        button.classList.toggle('selected');
        const fleetArray = handoverState.data.fleet[category];
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

function selectAllVans(category) {
    let gridId;
    switch(category) {
        case 'prime': gridId = 'handover-prime-vans'; break;
        case 'cdv': gridId = 'handover-cdv-vans'; break;
        case 'merchant': gridId = 'handover-merchant-vans'; break;
        case 'fleetSharePrime': gridId = 'handover-fleet-share-prime'; break;
        case 'fleetShareCdv': gridId = 'handover-fleet-share-cdv'; break;
        case 'oos': gridId = 'handover-oos-vans'; break;
        default: return;
    }

    const grid = document.getElementById(gridId);
    const buttons = grid.querySelectorAll('.van-button');

    buttons.forEach(btn => {
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

// ========================================
// Equipment Management
// ========================================

function updateOosPhonesDetails() {
    const count = parseInt(document.getElementById('oos-phones-count').value) || 0;
    const container = document.getElementById('oos-phones-details');

    if (!container) return;

    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <div class="oos-phone-item">
                <input type="text" id="oos-phone-label-${i}" placeholder="Label for OOS phone #${i}">
                <input type="text" id="oos-phone-reason-${i}" placeholder="Reason for OOS phone #${i}">
            </div>
        `;
    }
}

// ========================================
// Preview and Report Generation
// ========================================

function showHandoverPreview() {
    const preview = document.getElementById('handover-preview');
    if (!preview) return;

    const startDate = new Date(handoverState.data.startDate);
    const endDate = new Date(handoverState.data.endDate);

    const previewHTML = `
        <div class="preview-section">
            <h4>Handover Period</h4>
            <p><strong>Start:</strong> ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p><strong>End:</strong> ${endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        <div class="preview-section">
            <h4>Fleet Summary</h4>
            <p><strong>Prime Vans:</strong> ${handoverState.data.fleet.prime.length > 0 ? handoverState.data.fleet.prime.sort((a,b)=>a-b).join(', ') : 'None selected'}</p>
            <p><strong>CDV Vans:</strong> ${handoverState.data.fleet.cdv.length > 0 ? handoverState.data.fleet.cdv.sort((a,b)=>a-b).join(', ') : 'None selected'}</p>
            <p><strong>Merchant Vans:</strong> ${handoverState.data.fleet.merchant.length > 0 ? handoverState.data.fleet.merchant.sort((a,b)=>a-b).join(', ') : 'None selected'}</p>
            <p><strong>Fleet Share:</strong> ${handoverState.data.fleet.fleetSharePrime.length + handoverState.data.fleet.fleetShareCdv.length} vans</p>
            <p><strong>OOS Vans:</strong> ${handoverState.data.fleet.oos.length > 0 ? handoverState.data.fleet.oos.sort((a,b)=>a-b).join(', ') : 'None'}</p>
        </div>

        <div class="preview-section">
            <h4>Equipment Summary</h4>
            <p><strong>Phones:</strong> ${handoverState.data.equipment.phones || 0} (OOS: ${handoverState.data.equipment.oosPhones?.length || 0})</p>
            <p><strong>Gas Cards:</strong> ${handoverState.data.equipment.gasCards || 0}</p>
            <p><strong>Handtrucks:</strong> ${handoverState.data.equipment.handtrucks || 0}</p>
            <p><strong>Chargers:</strong> ${handoverState.data.equipment.chargers || 0}</p>
        </div>
    `;

    preview.innerHTML = previewHTML;
}

function generateHandoverReport() {
    const startDate = new Date(handoverState.data.startDate + 'T12:00:00');
    const endDate = new Date(handoverState.data.endDate + 'T12:00:00');

    // Sort all fleet arrays
    Object.keys(handoverState.data.fleet).forEach(key => {
        handoverState.data.fleet[key].sort((a, b) => a - b);
    });

    let report = `📱🚨HANDOVER🚨📱\n\n`;
    report += `DATE: ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}\n\n`;

    // Fleet section
    report += `● AMAZON BRANDED VANS:\n`;
    report += `  ○ Prime(${handoverState.data.fleet.prime.length > 0 ? handoverState.data.fleet.prime.join(', ') : 'none'})\n`;
    report += `  ○ CDV(${handoverState.data.fleet.cdv.length > 0 ? handoverState.data.fleet.cdv.join(', ') : 'none'})\n`;
    report += `● MERCHANT VANS:\n`;
    report += `  ○ ${handoverState.data.fleet.merchant.length > 0 ? handoverState.data.fleet.merchant.join(', ') : 'none'}\n`;
    report += `● FLEET SHARE VANS:\n`;
    report += `  ○ Prime (${handoverState.data.fleet.fleetSharePrime.length > 0 ? handoverState.data.fleet.fleetSharePrime.join(', ') : 'none'})\n`;
    report += `  ○ CDV (${handoverState.data.fleet.fleetShareCdv.length > 0 ? handoverState.data.fleet.fleetShareCdv.join(', ') : 'none'})\n`;
    report += `● RENTAL VANS:\n`;
    report += `  ○ ${handoverState.data.fleet.rental.length > 0 ? handoverState.data.fleet.rental.join(', ') : 'none'}\n`;
    report += `● OOS VANS:\n`;
    report += `  ○ ${handoverState.data.fleet.oos.length > 0 ? handoverState.data.fleet.oos.join(',') : 'none'}\n`;

    // Notes section
    if (handoverState.data.notes) {
        report += `● OTHER:\n  ○ ${handoverState.data.notes}\n`;
    }

    report += `${'-'.repeat(100)}\n\n`;

    // Equipment section
    report += `● PHONES:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.phones} (Includes ORS)\n`;
    if (handoverState.data.equipment.oosPhones && handoverState.data.equipment.oosPhones.length > 0) {
        report += `  ○ OOS: ${handoverState.data.equipment.oosPhones.length}\n`;
        handoverState.data.equipment.oosPhones.forEach(p => {
            report += `    ○ Phone ${p.label}: ${p.reason}\n`;
        });
    } else {
        report += `  ○ OOS: none\n`;
    }

    report += `${'-'.repeat(100)}\n\n`;

    // Continue with other equipment...
    report += `● GAS CARDS:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.gasCards}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● HANDTRUCKS:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.handtrucks}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● PORTABLE CHARGERS:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.chargers}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● EXTRA EQUIPMENT IN CAGE:\n`;
    report += `  ○ Phone holders: ${handoverState.data.equipment.phoneHolders}\n`;
    report += `  ○ Cables: ${handoverState.data.equipment.cables}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● WALKIE TALKIES:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.walkieTalkies}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● BOOSTERS:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.boosters}`;
    if (handoverState.data.equipment.boostersNotes) {
        report += ` (${handoverState.data.equipment.boostersNotes})`;
    }
    report += `\n${'-'.repeat(100)}\n\n`;

    report += `● IPAD:\n`;
    report += `  ○ Total: ${handoverState.data.equipment.ipad}\n`;
    report += `${'-'.repeat(100)}\n\n`;

    report += `● EQUIPMENT MISSING/NEED TO ORDER:\n`;
    report += `  ○ ${handoverState.data.equipment.missingEquipment || 'none'}`;

    document.getElementById('handover-report-text').value = report;

    // Sync with FleetManager
    if (window.fleetManager) {
        window.fleetManager.syncWithHandoverData(handoverState.data);
    }

    showHandoverScreen(4); // Show final report screen
}

function copyHandoverReport() {
    const reportText = document.getElementById('handover-report-text');
    if (reportText && reportText.value) {
        copyToClipboard(reportText.value);
    }
}

function startNewHandover() {
    if (confirm('Start a new handover? Current data will be lost.')) {
        handoverState.reset();
        showHandoverScreen(0);
    }
}

function refreshFleetData() {
    // Fleet data is managed in real-time, no refresh needed
    console.log('Fleet data refreshed');
}

// ========================================
// Utility Functions
// ========================================

function showNotification(message, type = 'info') {
    // Fallback notification system for handover
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

function copyToClipboard(text) {
    // Use modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Report Successfully Copied to Clipboard', 'success');
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Report Successfully Copied to Clipboard', 'success');
        } else {
            showNotification('❌ Failed to copy report to clipboard', 'error');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('❌ Failed to copy report to clipboard', 'error');
    }

    document.body.removeChild(textArea);
}

// ========================================
// Initialization
// ========================================

console.log('Handover Tool loaded and ready');
