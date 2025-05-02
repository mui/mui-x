/**
 * Calculates the relative luminance of a color
 * Formula from WCAG 2.2 https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 * @param {string} color - Color in any CSS color format (hex, rgb, rgba, hsl, etc.)
 * @returns {number} - The relative luminance value (0-1)
 */
function getRelativeLuminance(color: string): number {
  if (typeof color !== 'string') {
    return 0.5;
  }

  // Extract RGB values based on the color format
  let r = 0;
  let g = 0;
  let b = 0;

  // Helper function to convert sRGB to linear RGB
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

  // Handle hex format
  if (color.startsWith('#')) {
    const hex = color.slice(1);
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
    } else if (hex.length === 8) {
      // For 8-digit hex (with alpha)
      r = parseInt(hex.slice(0, 2), 16) / 255;
      g = parseInt(hex.slice(2, 4), 16) / 255;
      b = parseInt(hex.slice(4, 6), 16) / 255;
      // Alpha is in positions 6-8, but we don't need it for luminance
    } else {
      return 0.5; // Invalid hex
    }
  }
  // Handle rgb/rgba format
  else if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/i);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10) / 255;
      g = parseInt(rgbMatch[2], 10) / 255;
      b = parseInt(rgbMatch[3], 10) / 255;
    } else {
      return 0.5; // Invalid rgb/rgba
    }
  }
  // Handle hsl/hsla format
  else if (color.startsWith('hsl')) {
    const hslMatch = color.match(
      /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*[\d.]+\s*)?\)/i,
    );
    if (hslMatch) {
      const h = parseInt(hslMatch[1], 10) / 360;
      const s = parseInt(hslMatch[2], 10) / 100;
      const l = parseInt(hslMatch[3], 10) / 100;

      // Convert HSL to RGB
      if (s === 0) {
        // Achromatic (gray)
        r = l;
        g = l;
        b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1 / 2) {
            return q;
          }
          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
    } else {
      return 0.5; // Invalid hsl/hsla
    }
  } else {
    // Return a default value for unsupported formats
    return 0.5;
  }

  // Apply the formula for relative luminance
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
export function getContrastingTextColor(backgroundColor: string): '#FFFFFF' | '#000000' {
  const bgLuminance = getRelativeLuminance(backgroundColor);

  // Calculate contrast ratios for white and black text
  // White has luminance of 1.0, Black has luminance of 0.0
  const whiteContrast = getContrastRatio(bgLuminance, 1.0);
  const blackContrast = getContrastRatio(bgLuminance, 0.0);

  // Return the color with the higher contrast ratio
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}
