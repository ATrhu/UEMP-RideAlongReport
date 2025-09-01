/**
 * UEMP Operations Hub V2 - Main Application Logic
 * Handles navigation, user management, and core functionality
 */

// ========================================
// Global State Management
// ========================================

class AppState {
    constructor() {
        this.currentUser = null;
        this.currentScreen = 'login';
        this.currentTool = null;
    }

    setUser(name) {
        this.currentUser = name;
        localStorage.setItem('uemp_user', name);
    }

    getUser() {
        return this.currentUser || localStorage.getItem('uemp_user');
    }

    setScreen(screenName) {
        this.currentScreen = screenName;
        this.updateUI();
    }

    setTool(toolName) {
        this.currentTool = toolName;
    }

    updateUI() {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show current screen
        const currentScreenEl = document.getElementById(`${this.currentScreen}-screen`);
        if (currentScreenEl) {
            currentScreenEl.classList.add('active');
        }

        // Update user greeting if applicable
        this.updateUserGreeting();
    }

    updateUserGreeting() {
        const greetingEl = document.getElementById('user-greeting');
        if (greetingEl && this.currentUser) {
            greetingEl.textContent = `Welcome, ${this.currentUser}!`;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('uemp_user');
        this.setScreen('login');
    }
}

// Initialize global app state
const app = new AppState();

// ========================================
// Screen Navigation
// ========================================

function handleLogin(event) {
    event.preventDefault();

    const managerNameInput = document.getElementById('manager-name');
    const managerName = managerNameInput.value.trim();

    if (!managerName) {
        showNotification('Please enter your name', 'error');
        return;
    }

    app.setUser(managerName);
    app.setScreen('dashboard');
    showNotification(`Welcome to UEMP Operations Hub, ${managerName}!`, 'success');
}

function openTool(toolName) {
    // Set the screen to tool-interfaces first
    app.currentScreen = 'tool-interfaces';

    // Hide all main screens and show tool-interfaces container
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id === 'tool-interfaces') {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });

    // Hide all tool interfaces
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.classList.remove('active');
    });

    // Show selected tool interface
    const toolInterface = document.getElementById(`${toolName}-interface`);
    if (toolInterface) {
        toolInterface.classList.add('active');
    }

    // Set the current tool
    app.setTool(toolName);

    // Use setTimeout to ensure DOM updates are complete before initializing tools
    setTimeout(() => {
        // Initialize tool if it has specific setup
        if (typeof window[`init${toolName.replace('-', '')}Tool`] === 'function') {
            window[`init${toolName.replace('-', '')}Tool`]();
        }

        // Additional initialization for specific tools
        switch(toolName) {
            case 'handover':
                if (typeof window.initHandoverTool === 'function') {
                    window.initHandoverTool();
                }
                break;
            case 'vehicle-damage':
                if (typeof window.initVehicleDamageTool === 'function') {
                    window.initVehicleDamageTool();
                }
                break;
            case 'equipment-care':
                if (typeof window.initEquipmentCareTool === 'function') {
                    window.initEquipmentCareTool();
                }
                break;
        }
    }, 10);
}

function backToDashboard() {
    // Hide all tool interfaces
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.classList.remove('active');
    });

    // Clear current tool
    app.setTool(null);

    // Go back to dashboard
    app.setScreen('dashboard');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        app.logout();
        showNotification('Logged out successfully', 'info');
    }
}

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ========================================
// Utility Functions
// ========================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// ========================================
// Initialization
// ========================================

function initializeApp() {
    // Check for existing user session
    const existingUser = app.getUser();
    if (existingUser) {
        app.setUser(existingUser);
        app.setScreen('dashboard');
    } else {
        app.setScreen('login');
    }

    // Set up keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    console.log('UEMP Operations Hub V2 initialized');
}

function handleKeyboardShortcuts(event) {
    // Escape key to go back
    if (event.key === 'Escape') {
        if (app.currentScreen === 'tool-interfaces') {
            backToDashboard();
        }
    }

    // Ctrl/Cmd + L to logout
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        logout();
    }
}

// ========================================
// Error Handling
// ========================================

window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('An unexpected error occurred.', 'error');
});

// ========================================
// Performance Monitoring
// ========================================

// Monitor page load performance
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    }
});

// ========================================
// Tool Interface Management
// ========================================

// Initialize all tool interfaces to be hidden by default
function initializeToolInterfaces() {
    const toolInterfaces = document.querySelectorAll('.tool-interface');
    toolInterfaces.forEach(interface => {
        interface.classList.remove('active');
    });
}

// ========================================
// Start Application
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeToolInterfaces();
    initializeApp();
});
