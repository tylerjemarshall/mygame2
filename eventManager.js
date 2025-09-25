// class EventManager {
//     constructor() {
//         this.events = {};
//     }

//     on(eventName, callback) {
//         if (!this.events[eventName]) {
//             this.events[eventName] = [];
//         }
//         this.events[eventName].push(callback);
//     }

//     emit(eventName, data) {
//         if (this.events[eventName]) {
//             this.events[eventName].forEach(callback => callback(data));
//         }
//     }

//     off(eventName, callback) {
//         if (this.events[eventName]) {
//             this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
//         }
//     }
// }
class EventManager {
    constructor() {
        this.events = {};
        this.eventNames = new Set();  // New property to track event names
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
            this.eventNames.add(eventName);  // Add eventName to the Set when it's first registered
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
            // If no callbacks are left for an event, remove it from the eventNames set
            if (this.events[eventName].length === 0) {
                this.eventNames.delete(eventName);
            }
        }
    }

    // Method to get the list of all registered event names
    getEventNames() {
        return [...this.eventNames];  // Convert Set to an array for easier access
    }

    // Function to check if any listeners exist for a specific event
    hasListeners(eventName) {
        return this.events[eventName] && this.events[eventName].length > 0;
    }

    // Function to remove all listeners for a specific event
    removeAllListenersForEvent(eventName) {
        if (this.events[eventName]) {
            delete this.events[eventName];
            this.eventNames.delete(eventName);  // Also remove from the eventNames set
        }
    }

    // Function to remove all listeners for all events
    removeAllListeners() {
        this.events = {};  // Clear the events object
        this.eventNames.clear();  // Clear the event names set
    }
}
