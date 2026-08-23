/**
 * Converts a text string into a clean, URL-safe slug.
 *
 * @param {string} text - The input text to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(text) {
  return (
    String(text || "video")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "video"
  );
}

/**
 * Converts a time duration string (e.g. "2:57" or "1:02:30") to ISO 8601 duration format (e.g. "PT2M57S").
 *
 * @param {string} durationStr - Duration string formatted as MM:SS or HH:MM:SS.
 * @returns {string|undefined} ISO 8601 duration string.
 */
export function parseIsoDuration(durationStr) {
  if (!durationStr || typeof durationStr !== "string") return undefined;
  const parts = durationStr.split(":").map(Number);
  if (parts.some(isNaN)) return undefined;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `PT${minutes}M${seconds}S`;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return `PT${hours}H${minutes}M${seconds}S`;
  }
  return undefined;
}

/**
 * Escapes special regex characters in user input to prevent regex injection.
 *
 * @param {string} str - Raw query string.
 * @returns {string} Escaped string safe for new RegExp().
 */
export function escapeRegex(str) {
  return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
