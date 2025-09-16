// utils.js - Helper functions
import { CONFIG } from './config.js';

export function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: CONFIG.TIMEZONE
    });
}

export function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
        return true;
    }
    return false;
}

export function showError(message) {
    const alertBanner = document.getElementById('alertBanner');
    const alertTitle = document.getElementById('alertTitle');
    const alertText = document.getElementById('alertText');
    
    if (alertTitle) alertTitle.textContent = 'Connection Issue';
    if (alertText) alertText.textContent = message;
    if (alertBanner) {
        alertBanner.classList.add('active', 'error');
    }
}

export function updateLastUpdated() {
    const now = new Date();
    const timeString = formatTime(now);
    updateElement('lastUpdated', timeString);
}
