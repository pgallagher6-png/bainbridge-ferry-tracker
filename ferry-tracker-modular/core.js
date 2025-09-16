// core.js - Main ferry tracking logic
import { CONFIG } from './config.js';
import { formatTime, updateElement, showError, updateLastUpdated } from './utils.js';

export class FerryTracker {
    constructor() {
        this.currentDirection = 'bainbridge-seattle';
        this.nextDepartureTime = null;
        this.updateInterval = null;
        this.countdownInterval = null;
    }

    async init() {
        console.log('Initializing ferry tracker...');
        await this.loadFerryData();
        
        // Start intervals
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
        this.updateInterval = setInterval(() => this.loadFerryData(), CONFIG.UPDATE_INTERVAL);
    }

    async loadFerryData() {
        try {
            console.log('Loading ferry data from:', CONFIG.API_URL);
            const today = new Date().toISOString().split('T')[0];
            
            const response = await fetch(`${CONFIG.API_URL}/schedule/${today}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const schedule = await response.json();
            console.log('Schedule data:', schedule);
            
            this.displaySchedule(schedule);
            updateLastUpdated();
            
            // Show content
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('ferryContent').style.display = 'block';
            
        } catch (error) {
            console.error('Error loading ferry data:', error);
            showError('Unable to load real-time data. Using backup schedule.');
            this.loadFallbackSchedule();
        }
    }

    displaySchedule(data) {
        if (!data || !data.schedules) {
            this.loadFallbackSchedule();
            return;
        }

        const direction = this.currentDirection === 'bainbridge-seattle' ? 'toSeattle' : 'toBainbridge';
        const sailings = data.schedules[direction] || [];
        
        // Filter upcoming sailings
        const now = new Date();
        const upcoming = sailings
            .filter(sailing => new Date(sailing.depart) > now)
            .slice(0, 5);

        if (upcoming.length === 0) {
            updateElement('nextDeparture', 'No more today');
            updateElement('countdown', 'Service resumes tomorrow');
            updateElement('vesselName', 'See schedule');
            return;
        }

        // Display next departure
        const next = upcoming[0];
        this.nextDepartureTime = new Date(next.depart);
        
        updateElement('nextDeparture', formatTime(this.nextDepartureTime));
        updateElement('vesselName', next.vesselName ? `M/V ${next.vesselName}` : 'Vessel TBD');
        
        // Display schedule list
        const scheduleList = document.getElementById('scheduleList');
        if (scheduleList) {
            scheduleList.innerHTML = '';
            upcoming.forEach((sailing, index) => {
                const time = new Date(sailing.depart);
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `
                    <div>
                        <div class="schedule-time">${formatTime(time)}</div>
                        <div class="schedule-vessel">${sailing.vesselName || 'TBD'}</div>
                    </div>
                    <div class="schedule-vessel">${index === 0 ? 'NEXT' : ''}</div>
                `;
                scheduleList.appendChild(item);
            });
        }
        
        // Update terminal status
        this.updateTerminalStatus();
    }

    updateCountdown() {
        if (!this.nextDepartureTime) return;
        
        const now = new Date();
        const diff = this.nextDepartureTime - now;
        
        if (diff <= 0) {
            updateElement('countdown', 'Departing now');
            setTimeout(() => this.loadFerryData(), 5000);
            return;
        }
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            updateElement('countdown', `In ${hours}h ${mins}m`);
        } else if (minutes > 0) {
            updateElement('countdown', `In ${minutes}m ${seconds}s`);
        } else {
            updateElement('countdown', `In ${seconds}s`);
        }
    }

    updateTerminalStatus() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        const isWeekday = day >= 1 && day <= 5;
        
        let spaceEstimate = "Good";
        let waitEstimate = "20 min";
        
        if (this.currentDirection === 'bainbridge-seattle') {
            if (isWeekday && hour >= 6 && hour <= 9) {
                spaceEstimate = "Limited";
                waitEstimate = "45-60 min";
            }
        } else {
            if (isWeekday && hour >= 15 && hour <= 19) {
                spaceEstimate = "Limited";
                waitEstimate = "30-60 min";
            }
        }
        
        updateElement('spaceAvailable', spaceEstimate);
        updateElement('waitTime', waitEstimate);
        updateElement('ferryStatus', 'On Schedule');
        updateElement('onTimeStatus', 'On Time');
    }

    setDirection(direction, button) {
        // Clear intervals
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        
        // Update direction
        this.currentDirection = direction;
        
        // Update UI
        document.querySelectorAll('.direction-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Reload data
        this.loadFerryData();
        
        // Restart intervals
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
        this.updateInterval = setInterval(() => this.loadFerryData(), CONFIG.UPDATE_INTERVAL);
    }

    loadFallbackSchedule() {
        const schedule = CONFIG.FALLBACK_SCHEDULES[this.currentDirection];
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        for (const timeStr of schedule) {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            
            const departureMinutes = hour * 60 + parseInt(minutes);
            
            if (departureMinutes > currentMinutes) {
                updateElement('nextDeparture', timeStr);
                const minutesUntil = departureMinutes - currentMinutes;
                updateElement('countdown', `In ${minutesUntil} minutes`);
                break;
            }
        }
        
        updateElement('ferryStatus', 'Schedule Mode');
        updateElement('vesselName', 'See schedule');
        updateElement('spaceAvailable', 'Normal');
        updateElement('waitTime', '~15 min');
        
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('ferryContent').style.display = 'block';
    }
}
