function openTool(toolName) {
    document.getElementById('main-menu').style.display = 'none';
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.classList.remove('active');
    });
    const toolInterface = document.getElementById(`${toolName}-interface`);
    if (toolInterface) {
        toolInterface.classList.add('active');
        if (toolName === 'ride-along') {
            initRideAlongTool();
        } else if (toolName === 'handover') {
            initHandoverTool();
        } else if (toolName === 'vehicle-damage') {
            initVehicleDamageTool();
        }
    }
}

function backToMenu() {
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.classList.remove('active');
    });
    document.getElementById('main-menu').style.display = 'block';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeToggle.className = 'fas fa-moon';
    } else {
        body.classList.add('dark-theme');
        themeToggle.className = 'fas fa-sun';
    }
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('main-menu').style.display = 'block';
    
    // Set dark theme as default
    document.body.classList.add('dark-theme');
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = 'fas fa-sun';
    }
});
