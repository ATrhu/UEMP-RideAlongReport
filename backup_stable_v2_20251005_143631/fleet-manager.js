/**
 * UEMP Operations Hub V2 - Fleet Management System
 * Centralized fleet data management for all tools
 */

// ========================================
// Fleet Manager Class
// ========================================

class FleetManager {
    constructor() {
        this.fleetData = this.loadFleetData();
        this.initializeDefaultFleet();
    }

    // Load fleet data from local storage
    loadFleetData() {
        const stored = localStorage.getItem('uempFleetData');
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    }

    // Initialize default fleet structure
    initializeDefaultFleet() {
        if (!this.fleetData) {
            this.fleetData = {
                vehicles: {
                    branded: {
                        prime: this.generateVanRange(0, 17),
                        cdv: this.generateVanRange(32, 40)
                    },
                    fleetShare: {
                        prime: [18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 42, 43],
                        cdv: [44]
                    },
                    merchant: [25, 30, 31, 41],
                    rental: [],
                    oos: []
                },
                equipment: {
                    phones: 64,
                    gasCards: 25,
                    handtrucks: 25,
                    chargers: 25,
                    phoneHolders: 25,
                    cables: 'none',
                    walkieTalkies: 6,
                    boosters: 3,
                    boostersNotes: '',
                    ipad: 2,
                    missingEquipment: ''
                },
                lastUpdated: new Date().toISOString(),
                updatedBy: 'System'
            };
            this.saveFleetData();
            console.log('Initialized new fleet data');
            return;
        }

        // Check and populate if any category is empty
        const needsPopulation =
            this.fleetData.vehicles.branded.prime.length === 0 ||
            this.fleetData.vehicles.branded.cdv.length === 0 ||
            this.fleetData.vehicles.fleetShare.prime.length === 0 ||
            this.fleetData.vehicles.fleetShare.cdv.length === 0 ||
            this.fleetData.vehicles.merchant.length === 0;

        if (needsPopulation) {
            console.log('Fleet data incomplete, repopulating defaults');
            this.fleetData.vehicles.branded.prime = this.generateVanRange(0, 17);
            this.fleetData.vehicles.branded.cdv = this.generateVanRange(32, 40);
            this.fleetData.vehicles.fleetShare.prime = [18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 42, 43];
            this.fleetData.vehicles.fleetShare.cdv = [44];
            this.fleetData.vehicles.merchant = [25, 30, 31, 41];
            this.fleetData.vehicles.rental = [];
            this.fleetData.vehicles.oos = [];
            this.saveFleetData();
        } else {
            console.log('Fleet data already populated');
        }
    }

    // Generate a range of van numbers
    generateVanRange(start, end) {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    }

    // Save fleet data to local storage
    saveFleetData() {
        this.fleetData.lastUpdated = new Date().toISOString();
        localStorage.setItem('uempFleetData', JSON.stringify(this.fleetData));
    }

    // Get all vehicles in a flat array with their type information
    getAllVehicles() {
        const vehicles = [];

        // Branded vehicles
        this.fleetData.vehicles.branded.prime.forEach(num => {
            vehicles.push({
                id: `prime_${num}`,
                number: num,
                type: 'Branded Prime',
                category: 'branded',
                subcategory: 'prime'
            });
        });

        this.fleetData.vehicles.branded.cdv.forEach(num => {
            vehicles.push({
                id: `cdv_${num}`,
                number: num,
                type: 'Branded CDV',
                category: 'branded',
                subcategory: 'cdv'
            });
        });

        // Fleet Share vehicles
        this.fleetData.vehicles.fleetShare.prime.forEach(num => {
            vehicles.push({
                id: `fleet_share_prime_${num}`,
                number: num,
                type: 'Fleet Share Prime',
                category: 'fleetShare',
                subcategory: 'prime'
            });
        });

        this.fleetData.vehicles.fleetShare.cdv.forEach(num => {
            vehicles.push({
                id: `fleet_share_cdv_${num}`,
                number: num,
                type: 'Fleet Share CDV',
                category: 'fleetShare',
                subcategory: 'cdv'
            });
        });

        // Merchant vehicles
        this.fleetData.vehicles.merchant.forEach(num => {
            vehicles.push({
                id: `merchant_${num}`,
                number: num,
                type: 'Merchant',
                category: 'merchant',
                subcategory: 'merchant'
            });
        });

        // Rental vehicles
        this.fleetData.vehicles.rental.forEach(num => {
            vehicles.push({
                id: `rental_${num}`,
                number: num,
                type: 'Rental',
                category: 'rental',
                subcategory: 'rental'
            });
        });

        // OOS vehicles
        this.fleetData.vehicles.oos.forEach(num => {
            vehicles.push({
                id: `oos_${num}`,
                number: num,
                type: 'Out of Service',
                category: 'oos',
                subcategory: 'oos'
            });
        });

        return vehicles;
    }

    // Get fleet summary
    getFleetSummary() {
        return {
            branded: {
                prime: this.fleetData.vehicles.branded.prime.length,
                cdv: this.fleetData.vehicles.branded.cdv.length
            },
            fleetShare: {
                prime: this.fleetData.vehicles.fleetShare.prime.length,
                cdv: this.fleetData.vehicles.fleetShare.cdv.length
            },
            merchant: this.fleetData.vehicles.merchant.length,
            rental: this.fleetData.vehicles.rental.length,
            oos: this.fleetData.vehicles.oos.length
        };
    }

    // Get equipment counts
    getEquipment() {
        return this.fleetData.equipment;
    }

    // Update equipment counts
    updateEquipment(equipmentData) {
        this.fleetData.equipment = { ...this.fleetData.equipment, ...equipmentData };
        this.saveFleetData();
    }

    // Sync fleet data with handover data
    syncWithHandoverData(handoverData) {
        console.log('FleetManager: Syncing with handover data:', handoverData);

        if (handoverData && handoverData.fleet) {
            // Update branded vehicles
            this.fleetData.vehicles.branded.prime = handoverData.fleet.prime || [];
            this.fleetData.vehicles.branded.cdv = handoverData.fleet.cdv || [];

            // Update fleet share vehicles
            this.fleetData.vehicles.fleetShare.prime = handoverData.fleet.fleetSharePrime || [];
            this.fleetData.vehicles.fleetShare.cdv = handoverData.fleet.fleetShareCdv || [];

            // Update merchant vehicles
            this.fleetData.vehicles.merchant = handoverData.fleet.merchant || [];

            // Update rental vehicles
            this.fleetData.vehicles.rental = handoverData.fleet.rental || [];

            // Update OOS vehicles
            this.fleetData.vehicles.oos = handoverData.fleet.oos || [];

            // Update equipment
            if (handoverData.equipment) {
                this.fleetData.equipment = { ...this.fleetData.equipment, ...handoverData.equipment };
            }

            this.fleetData.lastUpdated = new Date().toISOString();
            this.fleetData.updatedBy = 'Handover Sync';
            this.saveFleetData();

            console.log('FleetManager: After sync, fleet data:', this.fleetData.vehicles);
            return true;
        }
        return false;
    }

    // Export fleet data
    exportFleetData() {
        return {
            fleet: this.fleetData.vehicles,
            equipment: this.fleetData.equipment,
            lastUpdated: this.fleetData.lastUpdated,
            updatedBy: this.fleetData.updatedBy
        };
    }

    // Import fleet data
    importFleetData(data) {
        if (data.fleet && data.equipment) {
            this.fleetData.vehicles = data.fleet;
            this.fleetData.equipment = data.equipment;
            this.fleetData.lastUpdated = data.lastUpdated || new Date().toISOString();
            this.fleetData.updatedBy = data.updatedBy || 'Import';
            this.saveFleetData();
            return true;
        }
        return false;
    }
}

// Create global instance
window.fleetManager = new FleetManager();

console.log('Fleet Manager loaded and ready');
