const AVAILABLE_ZONES = [
  { name: "PST", city: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "MST", city: "Denver", zone: "America/Denver" },
  { name: "CST", city: "Chicago", zone: "America/Chicago" },
  { name: "EST", city: "New York", zone: "America/New_York" },
  { name: "GMT", city: "London", zone: "Europe/London" },
  { name: "CET", city: "Paris", zone: "Europe/Paris" },
  { name: "EET", city: "Cairo", zone: "Africa/Cairo" },
  { name: "IST", city: "New Delhi", zone: "Asia/Kolkata" },
  { name: "CST", city: "Shanghai", zone: "Asia/Shanghai" },
  { name: "JST", city: "Tokyo", zone: "Asia/Tokyo" },
  { name: "AEST", city: "Sydney", zone: "Australia/Sydney" },
  { name: "NZST", city: "Auckland", zone: "Pacific/Auckland" },
  { name: "UTC", city: "Coordinated Universal Time", zone: "UTC" }
];

const DEFAULT_ZONES = ["America/Los_Angeles", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"];
let selectedZones = [...DEFAULT_ZONES];
const grid = document.getElementById("clocksGrid");
const select = document.getElementById("timezoneSelect");

function getZone(zone) { return AVAILABLE_ZONES.find((item) => item.zone === zone); }

function getClockData(zone) {
  const now = new Date();
  const timeParts = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).formatToParts(now);
  const time = timeParts.filter((part) => ["hour", "minute", "second"].includes(part.type)).map((part) => part.value).join(":");
  const ampm = timeParts.find((part) => part.type === "dayPeriod")?.value || "";
  const date = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(now);
  const numericParts = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(now);
  return { time, ampm, date, hour: Number(numericParts.find((p) => p.type === "hour").value) % 12, minute: Number(numericParts.find((p) => p.type === "minute").value), second: Number(numericParts.find((p) => p.type === "second").value) };
}

function hands(data) {
  return `<span class="hand hour-hand" style="transform: translateX(-50%) rotate(${data.hour * 30 + data.minute * .5}deg)"></span><span class="hand minute-hand" style="transform: translateX(-50%) rotate(${data.minute * 6 + data.second * .1}deg)"></span><span class="hand second-hand" style="transform: translateX(-50%) rotate(${data.second * 6}deg)"></span>`;
}

function render() {
  grid.innerHTML = selectedZones.map((zone) => {
    const location = getZone(zone); const data = getClockData(zone);
    return `<article class="clock-card"><div class="card-top"><div><div class="timezone-name">${location.name}</div><div class="city-name">${location.city}</div></div><button class="remove-button" data-remove="${zone}" aria-label="Remove ${location.city}">×</button></div><div class="clock-display"><div><div class="digital-time">${data.time}</div><div class="ampm">${data.ampm}</div></div><div class="analog-clock" aria-label="Analog clock for ${location.city}">${hands(data)}</div></div><div class="date">${data.date}</div></article>`;
  }).join("") || `<div class="empty-state">Choose a location above to add your first clock.</div>`;
  grid.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => { selectedZones = selectedZones.filter((zone) => zone !== button.dataset.remove); render(); }));
}

AVAILABLE_ZONES.forEach((item) => { const option = document.createElement("option"); option.value = item.zone; option.textContent = `${item.city} — ${item.name}`; select.appendChild(option); });
document.getElementById("addClockButton").addEventListener("click", () => { if (select.value && !selectedZones.includes(select.value)) selectedZones.push(select.value); select.value = ""; render(); });
document.getElementById("resetButton").addEventListener("click", () => { selectedZones = [...DEFAULT_ZONES]; render(); });
select.addEventListener("change", () => { if (select.value && !selectedZones.includes(select.value)) { selectedZones.push(select.value); select.value = ""; render(); } });
render();
setInterval(render, 1000);
