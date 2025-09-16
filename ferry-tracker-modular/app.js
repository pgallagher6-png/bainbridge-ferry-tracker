// app.js - Application entry point
import { FerryTracker } from './core.js';
import { CONFIG } from './config.js';

// Global instances
window.ferryTracker = null;
window.cameraVisible = false;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

async function initialize() {
    console.log('Starting Ferry Tracker Application...');
    
    // Create and initialize tracker
    window.ferryTracker = new FerryTracker();
    await window.ferryTracker.init();
    
    // Setup global functions for HTML onclick handlers
    setupGlobalFunctions();
}

function setupGlobalFunctions() {
    // Direction toggle
    window.setDirection = function(direction, button) {
        window.ferryTracker.setDirection(direction, button);
    };
    
    // Camera toggle
    window.toggleCamera = function() {
        window.cameraVisible = !window.cameraVisible;
        const cameraView = document.getElementById('cameraView');
        const buttonText = document.getElementById('cameraButtonText');
        const cameraFrame = document.getElementById('cameraFrame');
        
        if (window.cameraVisible) {
            cameraView.style.display = 'block';
            buttonText.textContent = 'Hide Camera';
            const cameraConfig = CONFIG.CAMERAS[window.ferryTracker.currentDirection];
            cameraFrame.src = cameraConfig.url;
            document.getElementById('cameraLocation').textContent = cameraConfig.label;
        } else {
            cameraView.style.display = 'none';
            buttonText.textContent = 'View Parking Camera';
            cameraFrame.src = '';
        }
    };
    
    // Share ferry
    window.shareFerry = function(button) {
        const nextDepartureEl = document.getElementById('nextDeparture');
        const vesselEl = document.getElementById('vesselName');
        const countdownEl = document.getElementById('countdown');
        
        if (!nextDepartureEl) return;
        
        const departureTime = nextDepartureEl.textContent;
        const vessel = vesselEl.textContent.replace('M/V ', '');
        const countdown = countdownEl.textContent;
        
        const route = window.ferryTracker.currentDirection === 'bainbridge-seattle' 
            ? 'Bainbridge to Seattle' 
            : 'Seattle to Bainbridge';
        
        const shareText = `Taking the ${departureTime} ferry (${route}) on the ${vessel}. ${countdown}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Ferry Update',
                text: shareText,
                url: window.location.href
            });
        } else {
            alert(shareText);
        }
    };
}

console.log('Ferry Tracker app loaded');
