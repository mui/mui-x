/**
 * Calculates the relative luminance of a color
 * Formula from WCAG 2.2 https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 * @param {string} color - The hexadecimal color code (with or without #)
 * @returns {number} - The relative luminance value (0-1)
 */
function getRelativeLuminance(color: string): number {
  // Remove # if present
  const hex = color.startsWith('#') ? color.slice(1) : color;

  // Convert to RGB
  let r;
  let g;
  let b;
  if (hex.length === 3) {
    // For 3-digit hex
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else if (hex.length === 6) {
    // For 6-digit hex
    r = parseInt(hex.slice(0, 2), 16) / 255;
    g = parseInt(hex.slice(2, 4), 16) / 255;
    b = parseInt(hex.slice(4, 6), 16) / 255;
  } else {
    // Invalid hex, return default value
    return 0.5;
  }

  // Apply the formula for relative luminance
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

  r = toLinear(r);
  g = toLinear(g);
  b = toLinear(b);

  // Calculate relative luminance using the formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates the contrast ratio between two colors according to WCAG 2.2
 * @param {number} luminance1 - Relative luminance of first color
 * @param {number} luminance2 - Relative luminance of second color
 * @returns {number} - Contrast ratio (1-21)
 */
function getContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines whether to use white or black text for a given background color
 * to ensure proper contrast and readability.
 * Uses WCAG 2.2 guidelines for contrast ratio calculation.
 *
 * @param {string} backgroundColor - The hexadecimal color code (with or without #)
 * @returns {string} - Either 'white' or 'black' depending on which provides better contrast
 */
export function getContrastingTextColor(backgroundColor: string): 'white' | 'black' {
  const bgLuminance = getRelativeLuminance(backgroundColor);

  // Calculate contrast ratios for white and black text
  // White has luminance of 1.0, Black has luminance of 0.0
  const whiteContrast = getContrastRatio(bgLuminance, 1.0);
  const blackContrast = getContrastRatio(bgLuminance, 0.0);

  // Return the color with the higher contrast ratio
  return whiteContrast > blackContrast ? 'white' : 'black';
}
