class Clock {
    constructor(options = {}) {
        this.use24Hour = options.use24Hour || false;
        this.timeZone = options.timeZone || 'UTC';
        this.updateTime();
        this.alarmTime = null;
        this.alarmInterval = null;
        this.isAlarmActive = false;
        this.alarmAudio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'); // Store audio object
    }

    updateTime() {
        const now = new Date().toLocaleString('en-US', { timeZone: this.timeZone });
        const dateObj = new Date(now);
        this.hours = dateObj.getHours();
        this.minutes = dateObj.getMinutes();
        this.seconds = dateObj.getSeconds();
        this.meridium = this.hours >= 12 ? 'PM' : 'AM';
    }

    getFormattedTime() {
        return `${this.padZero(this.hours)}:${this.padZero(this.minutes)}:${this.padZero(this.seconds)}`;
    }

    get12HourTime() {
        let hours = this.hours % 12;
        hours = hours ? hours : 12; 
        return `${this.padZero(hours)}:${this.padZero(this.minutes)}:${this.padZero(this.seconds)}`;
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    displayTime() {
        this.updateTime();
        const timeString = this.use24Hour ? this.getFormattedTime() : this.get12HourTime();
        const [hours, minutes, seconds] = timeString.split(':');

        document.getElementById('hour').textContent = hours;
        document.getElementById('min').textContent = minutes;
        document.getElementById('sec').textContent = seconds;
        
        const meridiumElement = document.getElementById('meridium');
        if (this.use24Hour) {
            meridiumElement.textContent = '';
            meridiumElement.style.display = 'none';
        } else {
            meridiumElement.textContent = this.meridium;
            meridiumElement.style.display = 'inline';
        }

        this.checkAlarm();
    }

    startClock() {
        this.displayTime();
        setInterval(() => this.displayTime(), 1000);
    }

    setTimeZone(timeZone) {
        this.timeZone = timeZone;
    }

    toggleHourFormat() {
        this.use24Hour = !this.use24Hour;
        this.displayTime();
        this.updateToggleButtonText();
    }

    updateToggleButtonText() {
        const toggleButton = document.getElementById('toggle-format');
        toggleButton.textContent = this.use24Hour ? 'Switch to 12-Hour' : 'Switch to 24-Hour';
    }

    setAlarm(time) {
        const [hours, minutes] = time.split(':');
        this.alarmTime = { hours: parseInt(hours), minutes: parseInt(minutes) };
        document.getElementById('alarm-display').textContent = `Alarm set for ${time}`;
        document.getElementById('stop-alarm').classList.remove('hidden');
        document.getElementById('snooze-alarm').classList.remove('hidden');
    }

    checkAlarm() {
        if (this.alarmTime && 
            this.hours === this.alarmTime.hours && 
            this.minutes === this.alarmTime.minutes && 
            this.seconds === 0) {
            this.triggerAlarm();
        }
    }

    triggerAlarm() {
        if (!this.isAlarmActive) {
            this.isAlarmActive = true;
            document.querySelector('.clock').classList.add('alarm-active');
            this.alarmInterval = setInterval(() => {
                this.alarmAudio.currentTime = 0; // Reset audio to start
                this.alarmAudio.play(); // Play audio
            }, 1000);
        }
    }

    stopAlarm() {
        this.isAlarmActive = false;
        clearInterval(this.alarmInterval);
        document.querySelector('.clock').classList.remove('alarm-active');
        this.alarmAudio.pause(); // Pause audio
        this.alarmAudio.currentTime = 0; // Reset audio to start
        this.alarmTime = null;
        document.getElementById('alarm-display').textContent = '';
        document.getElementById('stop-alarm').classList.add('hidden');
        document.getElementById('snooze-alarm').classList.add('hidden');
    }

    snoozeAlarm() {
        this.stopAlarm();
        setTimeout(() => {
            this.setAlarm(`${this.padZero((this.hours + 1) % 24)}:${this.padZero(this.minutes)}`);
        }, 2000); 
    }
}

const myClock = new Clock();
myClock.startClock();

document.getElementById('set-alarm').addEventListener('click', () => {
    const alarmTime = document.getElementById('alarm-time').value;
    if (alarmTime) {
        myClock.setAlarm(alarmTime);
    }
});

document.getElementById('stop-alarm').addEventListener('click', () => {
    myClock.stopAlarm();
});

document.getElementById('snooze-alarm').addEventListener('click', () => {
    myClock.snoozeAlarm();
});

document.getElementById('toggle-format').addEventListener('click', () => {
    myClock.toggleHourFormat();
});

myClock.updateToggleButtonText();
