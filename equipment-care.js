// Equipment Care Management System
// This file manages phone condition tracking and battery pack inventory

class EquipmentCareManager {
    constructor() {
        this.phoneConditions = this.loadPhoneConditions();
        this.batteryPackHistory = this.loadBatteryPackHistory();
        this.initializeDefaultData();
        this.ensurePhoneLabelsExist();
    }

    // Load phone conditions from local storage
    loadPhoneConditions() {
        const stored = localStorage.getItem('uempPhoneConditions');
        if (stored) {
            return JSON.parse(stored);
        }
        return {};
    }

    // Load battery pack history from local storage
    loadBatteryPackHistory() {
        const stored = localStorage.getItem('uempBatteryPackHistory');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    // Initialize default data if none exists
    initializeDefaultData() {
        if (Object.keys(this.phoneConditions).length === 0) {
            // Initialize with correct phone labels: Phone 0-63 and ORS
            const defaultPhones = [];
            
            // Add phones 0-63
            for (let i = 0; i <= 63; i++) {
                defaultPhones.push(`Phone ${i}`);
            }
            
            // Add ORS (last phone)
            defaultPhones.push('ORS');
            
            defaultPhones.forEach(label => {
                this.phoneConditions[label] = [];
            });
        }
    }

    // Save phone conditions to local storage
    savePhoneConditions() {
        localStorage.setItem('uempPhoneConditions', JSON.stringify(this.phoneConditions));
    }

    // Save battery pack history to local storage
    saveBatteryPackHistory() {
        localStorage.setItem('uempBatteryPackHistory', JSON.stringify(this.batteryPackHistory));
    }

    // Add phone condition entry
    addPhoneCondition(phoneLabel, conditionData) {
        if (!this.phoneConditions[phoneLabel]) {
            this.phoneConditions[phoneLabel] = [];
        }

        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            condition: conditionData.condition || 'good',
            description: conditionData.description || '',
            photoData: conditionData.photoData || '',
            photoType: conditionData.photoType || 'camera',
            notes: conditionData.notes || '',
            reportedBy: conditionData.reportedBy || 'Unknown'
        };

        this.phoneConditions[phoneLabel].push(entry);
        this.savePhoneConditions();
        return entry;
    }

    // Get phone condition history
    getPhoneConditionHistory(phoneLabel) {
        return this.phoneConditions[phoneLabel] || [];
    }

    // Get phone label by number (0-63) or 'ORS'
    getPhoneLabelByNumber(number) {
        if (number === 'ORS') {
            return 'ORS';
        }
        
        const num = parseInt(number);
        if (num >= 0 && num <= 63) {
            return `Phone ${num}`;
        }
        
        return null; // Invalid number
    }

    // Get all phone conditions
    getAllPhoneConditions() {
        return this.phoneConditions;
    }

    // Get the correct phone labels for the system
    getPhoneLabels() {
        const labels = [];
        
        // Add phones 0-63
        for (let i = 0; i <= 63; i++) {
            labels.push(`Phone ${i}`);
        }
        
        // Add ORS (last phone)
        labels.push('ORS');
        
        return labels;
    }

    // Ensure all phone labels exist in the system
    ensurePhoneLabelsExist() {
        const correctLabels = this.getPhoneLabels();
        let updated = false;
        
        // Check if we need to migrate from old labels
        const hasOldLabels = Object.keys(this.phoneConditions).some(label => 
            !correctLabels.includes(label)
        );
        
        if (hasOldLabels) {
            // Migrate old data to new labels
            this.migrateOldPhoneLabels();
            updated = true;
        }
        
        // Ensure all correct labels exist
        correctLabels.forEach(label => {
            if (!this.phoneConditions[label]) {
                this.phoneConditions[label] = [];
                updated = true;
            }
        });
        
        if (updated) {
            this.savePhoneConditions();
        }
        
        return updated;
    }

    // Migrate old phone labels to new system
    migrateOldPhoneLabels() {
        const correctLabels = this.getPhoneLabels();
        const newPhoneConditions = {};
        
        // Initialize all correct labels
        correctLabels.forEach(label => {
            newPhoneConditions[label] = [];
        });
        
        // Try to map old data to new labels where possible
        Object.entries(this.phoneConditions).forEach(([oldLabel, data]) => {
            if (correctLabels.includes(oldLabel)) {
                // Label is already correct, keep the data
                newPhoneConditions[oldLabel] = data;
            } else if (oldLabel.startsWith('Phone ')) {
                // Extract number and map to correct label
                const number = oldLabel.replace('Phone ', '');
                if (correctLabels.includes(`Phone ${number}`)) {
                    newPhoneConditions[`Phone ${number}`] = data;
                }
            } else if (oldLabel === 'ORS' || oldLabel.startsWith('ORS')) {
                // Map ORS labels to the correct ORS label
                newPhoneConditions['ORS'] = data;
            }
            // Other old labels will be lost, but this ensures system stability
        });
        
        this.phoneConditions = newPhoneConditions;
    }

    // Add battery pack inventory entry
    addBatteryPackEntry(batteryPackNumber, date = null) {
        const entryDate = date || new Date().toISOString().split('T')[0];
        
        const entry = {
            id: Date.now().toString(),
            date: entryDate,
            batteryPackNumber: batteryPackNumber,
            timestamp: new Date().toISOString(),
            recordedBy: 'System'
        };

        this.batteryPackHistory.push(entry);
        this.saveBatteryPackHistory();
        return entry;
    }

    // Get battery pack history for a specific date
    getBatteryPackHistoryForDate(date) {
        return this.batteryPackHistory.filter(entry => entry.date === date);
    }

    // Get battery pack history for a date range
    getBatteryPackHistoryForRange(startDate, endDate) {
        return this.batteryPackHistory.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return entryDate >= start && entryDate <= end;
        });
    }

    // Get all battery pack numbers for a specific date
    getBatteryPackNumbersForDate(date) {
        const entries = this.getBatteryPackHistoryForDate(date);
        return entries.map(entry => entry.batteryPackNumber).sort((a, b) => a - b);
    }

    // Get missing battery packs (compare with expected inventory)
    getMissingBatteryPacks(date, expectedInventory) {
        const actualInventory = this.getBatteryPackNumbersForDate(date);
        const missing = expectedInventory.filter(bp => !actualInventory.includes(bp));
        return missing;
    }

    // Get battery pack statistics
    getBatteryPackStats() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        return {
            today: this.getBatteryPackNumbersForDate(today),
            yesterday: this.getBatteryPackNumbersForDate(yesterdayStr),
            totalEntries: this.batteryPackHistory.length,
            lastUpdated: this.batteryPackHistory.length > 0 ? 
                this.batteryPackHistory[this.batteryPackHistory.length - 1].timestamp : null
        };
    }

    // Remove phone condition entry
    removePhoneCondition(phoneLabel, entryId) {
        if (this.phoneConditions[phoneLabel]) {
            this.phoneConditions[phoneLabel] = this.phoneConditions[phoneLabel].filter(
                entry => entry.id !== entryId
            );
            this.savePhoneConditions();
            return true;
        }
        return false;
    }

    // Remove battery pack entry
    removeBatteryPackEntry(entryId) {
        const index = this.batteryPackHistory.findIndex(entry => entry.id === entryId);
        if (index > -1) {
            this.batteryPackHistory.splice(index, 1);
            this.saveBatteryPackHistory();
            return true;
        }
        return false;
    }

    // Export data for GitHub
    exportEquipmentCareData() {
        return {
            phoneConditions: this.phoneConditions,
            batteryPackHistory: this.batteryPackHistory,
            lastUpdated: new Date().toISOString(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data from GitHub
    importEquipmentCareData(data) {
        if (data.phoneConditions) {
            this.phoneConditions = data.phoneConditions;
        }
        if (data.batteryPackHistory) {
            this.batteryPackHistory = data.batteryPackHistory;
        }
        this.savePhoneConditions();
        this.saveBatteryPackHistory();
        return true;
    }

    // Clear all data (for testing/reset purposes)
    clearAllData() {
        this.phoneConditions = {};
        this.batteryPackHistory = [];
        this.savePhoneConditions();
        this.saveBatteryPackHistory();
    }
}

// Create global instance
window.equipmentCare = new EquipmentCareManager();
