/**
 * UEMP Operations Hub V2 - Vehicle Damage History System
 * Manages damage history for all vehicles in the fleet
 */

// ========================================
// Vehicle Damage History Class
// ========================================

class VehicleDamageHistory {
    constructor() {
        this.damageHistory = this.loadDamageHistory();
    }

    // Load damage history from local storage
    loadDamageHistory() {
        const stored = localStorage.getItem('uempDamageHistory');
        if (stored) {
            return JSON.parse(stored);
        }
        return {};
    }

    // Save damage history to local storage
    saveDamageHistory() {
        localStorage.setItem('uempDamageHistory', JSON.stringify(this.damageHistory));
    }

    // Add a new damage entry
    addDamageEntry(vehicleId, damageData) {
        if (!this.damageHistory[vehicleId]) {
            this.damageHistory[vehicleId] = [];
        }

        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            driver: damageData.driver || 'Unknown',
            description: damageData.description || '',
            photoData: damageData.photoData || '',
            photoType: damageData.photoType || 'camera',
            severity: damageData.severity || 'minor',
            location: damageData.location || '',
            notes: damageData.notes || ''
        };

        this.damageHistory[vehicleId].push(entry);
        this.saveDamageHistory();
        return entry;
    }

    // Get damage history for a specific vehicle
    getVehicleDamageHistory(vehicleId) {
        return this.damageHistory[vehicleId] || [];
    }

    // Get all damage history
    getAllDamageHistory() {
        return this.damageHistory;
    }

    // Remove a damage entry
    removeDamageEntry(vehicleId, entryId) {
        if (this.damageHistory[vehicleId]) {
            this.damageHistory[vehicleId] = this.damageHistory[vehicleId].filter(
                entry => entry.id !== entryId
            );
            this.saveDamageHistory();
            return true;
        }
        return false;
    }

    // Update a damage entry
    updateDamageEntry(vehicleId, entryId, updates) {
        if (this.damageHistory[vehicleId]) {
            const entry = this.damageHistory[vehicleId].find(e => e.id === entryId);
            if (entry) {
                Object.assign(entry, updates);
                entry.lastModified = new Date().toISOString();
                this.saveDamageHistory();
                return true;
            }
        }
        return false;
    }

    // Get damage statistics for a vehicle
    getVehicleDamageStats(vehicleId) {
        const history = this.getVehicleDamageHistory(vehicleId);
        return {
            totalEntries: history.length,
            lastDamage: history.length > 0 ? history[history.length - 1].date : null,
            severityBreakdown: history.reduce((acc, entry) => {
                acc[entry.severity] = (acc[entry.severity] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Get all vehicles with damage
    getVehiclesWithDamage() {
        return Object.keys(this.damageHistory).filter(vehicleId =>
            this.damageHistory[vehicleId].length > 0
        );
    }

    // Export damage history
    exportDamageHistory() {
        return {
            damageHistory: this.damageHistory,
            lastUpdated: new Date().toISOString(),
            exportDate: new Date().toISOString()
        };
    }

    // Import damage history
    importDamageHistory(data) {
        if (data.damageHistory) {
            this.damageHistory = data.damageHistory;
            this.saveDamageHistory();
            return true;
        }
        return false;
    }

    // Clear all damage history
    clearAllHistory() {
        this.damageHistory = {};
        this.saveDamageHistory();
    }
}

// Create global instance
window.damageHistory = new VehicleDamageHistory();

console.log('Vehicle Damage History loaded and ready');
