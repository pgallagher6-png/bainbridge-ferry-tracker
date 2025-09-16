// config.js - All your settings in one place
export const CONFIG = {
    API_URL: 'https://bainbridge-ferry-api.pgallagher6.workers.dev',
    UPDATE_INTERVAL: 30000,
    COUNTDOWN_INTERVAL: 1000,
    TIMEZONE: 'America/Los_Angeles',
    
    CAMERAS: {
        'bainbridge-seattle': {
            url: 'https://wsdot.com/Travel/Real-time/Map/?featuretype=camera&featureid=9040',
            label: 'Bainbridge Terminal - Holding Lot'
        },
        'seattle-bainbridge': {
            url: 'https://wsdot.com/Travel/Real-time/Map/?featuretype=camera&featureid=9035',
            label: 'Seattle - Colman Dock'
        }
    },
    
    FALLBACK_SCHEDULES: {
        'bainbridge-seattle': [
            '5:30 AM', '6:20 AM', '7:10 AM', '8:00 AM', '8:50 AM',
            '9:40 AM', '10:30 AM', '11:20 AM', '12:10 PM', '1:00 PM',
            '1:50 PM', '2:40 PM', '3:30 PM', '4:20 PM', '5:10 PM',
            '6:00 PM', '6:50 PM', '7:40 PM', '8:30 PM', '9:20 PM',
            '10:10 PM', '11:00 PM', '11:50 PM'
        ],
        'seattle-bainbridge': [
            '6:10 AM', '7:00 AM', '7:50 AM', '8:40 AM', '9:30 AM',
            '10:20 AM', '11:10 AM', '12:00 PM', '12:50 PM', '1:40 PM',
            '2:30 PM', '3:20 PM', '4:10 PM', '5:00 PM', '5:50 PM',
            '6:40 PM', '7:30 PM', '8:20 PM', '9:10 PM', '10:00 PM',
            '10:50 PM', '11:40 PM'
        ]
    }
};
