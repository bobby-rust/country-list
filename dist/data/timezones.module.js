import timezoneData from './timezones.js';

// Export the raw timezone data
export default timezoneData;

// Create a flattened array of all timezones
export const allTimezones = Object.values(timezoneData)
  .flat()
  .filter((tz, index, self) => self.indexOf(tz) === index)
  .sort();

/**
 * Get timezones for a specific country by alpha2 code
 * @param {string} countryCode - The alpha2 country code
 * @returns {string[]|null} - Array of timezone strings for that country or null if not found
 */
export function getTimezonesByCountry(countryCode) {
  if (!countryCode) return null;
  return timezoneData[countryCode.toUpperCase()] || null;
}

/**
 * Get all countries that use a specific timezone
 * @param {string} timezone - The timezone to look for (e.g. "Europe/London")
 * @returns {string[]} - Array of country codes that use this timezone
 */
export function getCountriesForTimezone(timezone) {
  if (!timezone) return [];
  return Object.entries(timezoneData)
    .filter(([, timezones]) => timezones.includes(timezone))
    .map(([countryCode]) => countryCode);
}

/**
 * Get current UTC offset for a timezone
 * @param {string} timezone - Timezone string (e.g. "Europe/London")
 * @returns {string} - UTC offset in format "+HH:MM" or "-HH:MM"
 */
export function getUtcOffset(timezone) {
  if (!timezone) return null;
  try {
    const date = new Date();
    const options = { timeZone: timezone, timeZoneName: 'short' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date
    );
    const matches = formattedDate.match(/GMT([+-]\d{1,2}(?::\d{2})?)/);
    return matches ? matches[1] : null;
  } catch {
    // Handle cases where Intl API might not support the timezone
    // Silently return null without logging errors
    return null;
  }
}

// Collect all data for export
export const timezones = {
  all: allTimezones,
  byCountry: timezoneData,
  getTimezonesByCountry,
  getCountriesForTimezone,
  getUtcOffset,
};
