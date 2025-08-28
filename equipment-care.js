// Equipment Care Management System
// This file manages phone condition tracking and battery pack inventory

class EquipmentCareManager {
    constructor() {
        this.phoneConditions = this.loadPhoneConditions();
        this.batteryPackHistory = this.loadBatteryPackHistory();
        this.initializeDefaultData();
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
            // Initialize with default phone labels (you can modify these)
            const defaultPhones = ['ORS1', 'ORS2', 'ORS3', 'BP1', 'BP2', 'BP3', 'BP4', 'BP5'];
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

    // Get all phone conditions
    getAllPhoneConditions() {
        return this.phoneConditions;
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
