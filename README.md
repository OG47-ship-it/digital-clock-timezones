# Neon World Clock

A responsive, neon-styled world clock with:

- Live digital clocks for multiple time zones
- Analog clock faces alongside every digital display
- A time-zone dropdown for adding locations
- Remove and reset controls
- Automatic updates every second
- Daylight-saving-aware IANA time zone conversion via `Intl.DateTimeFormat`
- Responsive desktop and mobile layouts

## Run locally

Open `index.html` in any modern browser. No build step or server is required.

## Included locations

Los Angeles, Denver, Chicago, New York, London, Paris, Cairo, New Delhi, Shanghai, Tokyo, Sydney, Auckland, and UTC are available. Add more entries to `AVAILABLE_ZONES` in `script.js` using any supported IANA time-zone identifier.
