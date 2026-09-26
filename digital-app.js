const TIMEZONES = [
  { name: "UTC", zone: "UTC" },
  { name: "GMT - London", zone: "Europe/London" },
  { name: "CET - Paris", zone: "Europe/Paris" },
  { name: "EET - Cairo", zone: "Africa/Cairo" },
  { name: "IST - New Delhi", zone: "Asia/Kolkata" },
  { name: "CST - Shanghai", zone: "Asia/Shanghai" },
  { name: "JST - Tokyo", zone: "Asia/Tokyo" },
  { name: "AEST - Sydney", zone: "Australia/Sydney" },
  { name: "NZST - Auckland", zone: "Pacific/Auckland" },
  { name: "PST - Los Angeles", zone: "America/Los_Angeles" },
  { name: "MST - Denver", zone: "America/Denver" },
  { name: "CST - Chicago", zone: "America/Chicago" },
  { name: "EST - New York", zone: "America/New_York" }
];

const timeDisplay = document.getElementById('timeDisplay');
const periodDisplay = document.getElementById('periodDisplay');
const dateDisplay = document.getElementById('dateDisplay');
const formatSelect = document.getElementById('formatSelect');
const timezoneSelect = document.getElementById('timezoneSelect');
const showMilliseconds = document.getElementById('showMilliseconds');
const showDate = document.getElementById('showDate');
const timestamp = document.getElementById('timestamp');
const utcOffset = document.getElementById('utcOffset');
const elapsedToday = document.getElementById('elapsedToday');

// Populate timezone select
TIMEZONES.forEach(tz => {
  const option = document.createElement('option');
  option.value = tz.zone;
  option.textContent = tz.name;
  timezoneSelect.appendChild(option);
});

function updateDisplay() {
  const now = new Date();
  const timezone = timezoneSelect.value;
  const format = formatSelect.value;
  const showMs = showMilliseconds.checked;
  const showD = showDate.checked;

  // Get time parts for the selected timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: format === '12'
  });

  const parts = formatter.formatToParts(now);
  let hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  const second = parts.find(p => p.type === 'second').value;
  const period = parts.find(p => p.type === 'dayPeriod')?.value || '';

  // Build time string
  let timeStr = `${hour}:${minute}:${second}`;
  if (showMs) {
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    timeStr += `.${ms}`;
  }

  timeDisplay.textContent = timeStr;
  periodDisplay.textContent = period;
  periodDisplay.style.display = format === '12' ? 'block' : 'none';

  // Update date
  if (showD) {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateDisplay.textContent = dateFormatter.format(now);
    dateDisplay.style.display = 'block';
  } else {
    dateDisplay.style.display = 'none';
  }

  // Update timestamp
  timestamp.textContent = Math.floor(now.getTime() / 1000);

  // Calculate and display UTC offset
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const offsetMs = tzDate - utcDate;
  const offsetHours = Math.floor(Math.abs(offsetMs) / 3600000);
  const offsetMinutes = Math.floor((Math.abs(offsetMs) % 3600000) / 60000);
  const sign = offsetMs >= 0 ? '+' : '-';
  utcOffset.textContent = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

  // Calculate elapsed time today
  const startOfDay = new Date(now.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }));
  const dayStart = new Date(startOfDay);
  dayStart.setHours(0, 0, 0, 0);
  const elapsedMs = now - dayStart;
  const hours = Math.floor(elapsedMs / 3600000);
  const minutes = Math.floor((elapsedMs % 3600000) / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);
  elapsedToday.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Event listeners
formatSelect.addEventListener('change', updateDisplay);
timezoneSelect.addEventListener('change', updateDisplay);
showMilliseconds.addEventListener('change', updateDisplay);
showDate.addEventListener('change', updateDisplay);

// Initial update and then every 100ms for smooth milliseconds display
updateDisplay();
setInterval(updateDisplay, 100);
