const colorCache = new Map<string, [number, number, number, number]>();

/**
 * Parse color string to RGBA object. Each channel is normalized to [0, 1].
 * This function does not work in SSR.
 */
export function parseColor(color: string) {
  const cached = colorCache.get(color);

  if (cached) {
    return cached;
  }

  let result = parseColorUsingRegex(color);

  if (result == null) {
    result = parseRgbColor(color);
  }

  if (result == null) {
    result = parseColorUsingCanvas(color);
  }

  colorCache.set(color, result);

  return result;
}

// Validates hex color formats (#RGB, #RRGGBB, #RRGGBBAA)
const hexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/;
function parseColorUsingRegex(color: string): [number, number, number, number] | null {
  if (color.startsWith('#')) {
    color = color.slice(1);
  }

  if (!hexRegex.test(color)) {
    return null; // Invalid hex color
  }

  if (color.length === 3) {
    color = color
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;

  const a = color.length === 8 ? parseInt(color.substring(6, 8), 16) / 255 : 1;

  return [r, g, b, a];
}

// Parses rgb() and rgba() formats
const rgbaRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
function parseRgbColor(color: string): [number, number, number, number] | null {
  const match = color.match(rgbaRegex);

  if (!match) {
    return null;
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  if (r > 255 || g > 255 || b > 255) {
    return null;
  }

  return [r / 255, g / 255, b / 255, 1];
}

let canvas: HTMLCanvasElement | OffscreenCanvas;
function parseColorUsingCanvas(color: string): [number, number, number, number] {
  if (!canvas) {
    if ('OffscreenCanvas' in window) {
      canvas = new OffscreenCanvas(1, 1);
    } else {
      canvas = document.createElement('canvas')!;
      canvas.width = 1;
      canvas.height = 1;
    }
  }

  const ctx = canvas.getContext('2d')! as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;

  const result: [number, number, number, number] = [r / 255, g / 255, b / 255, a / 255];

  return result;
}
