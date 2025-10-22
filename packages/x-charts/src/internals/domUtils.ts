// DOM utils adapted from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts
import * as React from 'react';

const isSsr = typeof window === 'undefined';

const stringCache = new Map<string, { width: number; height: number }>();

let canvasSupportsLetterSpacing: boolean | null = null;
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;
let measurementContainer: SVGSVGElement | null = null;

export function clearStringMeasurementCache() {
  stringCache.clear();
  // Reset letterSpacing support detection to force re-check
  canvasSupportsLetterSpacing = null;
}

const MAX_CACHE_NUM = 2000;
const PIXEL_STYLES = new Set([
  'minWidth',
  'maxWidth',
  'width',
  'minHeight',
  'maxHeight',
  'height',
  'top',
  'left',
  'fontSize',
  'padding',
  'margin',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'letterSpacing',
]);

/**
 * Convert number value to pixel value for a custom set of CSS properties
 */
function convertPixelValue(name: string, value: number | string) {
  if (PIXEL_STYLES.has(name)) {
    return addPixelToValueIfNeeded(value);
  }

  return value;
}

function addPixelToValueIfNeeded(value: string | number) {
  if (typeof value === 'number') {
    return value + 'px'; // eslint-disable-line
  }
  return value;
}

/**
 * Converts camelcase to dash-case
 * @param text camelcase css property
 */
const AZ = /([A-Z])/g;
function camelCaseToDashCase(text: string) {
  return String(text).replace(AZ, (match) => `-${match.toLowerCase()}`);
}

/**
 * Converts a style object into a string to be used as a cache key
 * @param style React style object
 * @returns CSS styling string
 */
export function getStyleString(style: React.CSSProperties) {
  let result = '';

  for (const key in style) {
    if (Object.hasOwn(style, key)) {
      const k = key as keyof React.CSSProperties;
      const value = style[k];

      if (value === undefined) {
        continue;
      }

      result += `${camelCaseToDashCase(k)}:${convertPixelValue(k, value)};`;
    }
  }
  return result;
}

/**
 *
 * @param text The string to estimate
 * @param style The style applied
 * @returns width and height of the text
 */
export function measureText(text: string | number, style: React.CSSProperties = {}) {
  if (text === undefined || text === null || isSsr) {
    return { width: 0, height: 0 };
  }

  const str = String(text);
  const styleString = getStyleString(style);
  const cacheKey = `${str}-${styleString}`;

  const size = stringCache.get(cacheKey);
  if (size) {
    return size;
  }

  try {
    // Check if we should use canvas-based measurement
    const useCanvas = checkLetterSpacingSupport();

    let result: { width: number; height: number };

    if (useCanvas) {
      result = measureTextWithCanvas(str, style);
    } else {
      // Fall back to SVG-based measurement
      const measurementSpanContainer = getMeasurementContainer();
      const measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
      // https://en.wikipedia.org/wiki/Content_Security_Policy
      for (const styleKey of Object.keys(style as Record<string, any>)) {
        (measurementElem!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] =
          convertPixelValue(styleKey, (style as Record<string, any>)[styleKey]);
      }

      measurementElem.textContent = str;

      measurementSpanContainer.replaceChildren(measurementElem);

      const rect = measurementElem.getBoundingClientRect();
      result = { width: rect.width, height: rect.height };

      if (process.env.NODE_ENV === 'test') {
        // In test environment, we clean the measurement span immediately
        measurementSpanContainer.replaceChildren();
      }
    }

    stringCache.set(cacheKey, result);

    if (stringCache.size + 1 > MAX_CACHE_NUM) {
      stringCache.clear();
    }

    return result;
  } catch {
    return { width: 0, height: 0 };
  }
}

export function measureTextBatch(
  texts: Iterable<string | number>,
  style: React.CSSProperties = {},
) {
  if (isSsr) {
    return new Map<string | number, { width: number; height: number }>(
      Array.from(texts).map((text) => [text, { width: 0, height: 0 }]),
    );
  }

  const sizeMap = new Map<string | number, { width: number; height: number }>();
  const textToMeasure: Array<string | number> = [];
  const styleString = getStyleString(style);

  for (const text of texts) {
    const cacheKey = `${text}-${styleString}`;
    const size = stringCache.get(cacheKey);

    if (size) {
      sizeMap.set(text, size);
    } else {
      textToMeasure.push(text);
    }
  }

  if (textToMeasure.length === 0) {
    return sizeMap;
  }

  // Check if we should use canvas-based measurement
  const useCanvas = checkLetterSpacingSupport();

  if (useCanvas) {
    // Use canvas for batch measurement
    for (const text of textToMeasure) {
      const result = measureTextWithCanvas(String(text), style);
      const cacheKey = `${text}-${styleString}`;

      stringCache.set(cacheKey, result);
      sizeMap.set(text, result);
    }
  } else {
    // Fall back to SVG-based batch measurement
    const measurementContainer = getMeasurementContainer();
    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    const measurementSpanStyle: Record<string, any> = { ...style };

    for (const styleKey of Object.keys(measurementSpanStyle)) {
      (measurementContainer!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] =
        convertPixelValue(styleKey, measurementSpanStyle[styleKey]);
    }

    const measurementElems: SVGTextElement[] = [];
    for (const string of textToMeasure) {
      const measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      measurementElem.textContent = `${string}`;
      measurementElems.push(measurementElem);
    }

    measurementContainer.replaceChildren(...measurementElems);

    for (let i = 0; i < textToMeasure.length; i += 1) {
      const text = textToMeasure[i];
      const measurementSpan = measurementContainer.children[i] as HTMLSpanElement;
      const rect = measurementSpan.getBoundingClientRect();
      const result = { width: rect.width, height: rect.height };
      const cacheKey = `${text}-${styleString}`;

      stringCache.set(cacheKey, result);
      sizeMap.set(text, result);
    }

    if (process.env.NODE_ENV === 'test') {
      // In test environment, we clean the measurement span immediately
      measurementContainer.replaceChildren();
    }
  }

  if (stringCache.size + 1 > MAX_CACHE_NUM) {
    stringCache.clear();
  }

  return sizeMap;
}

function measureTextWithCanvas(text: string, style: React.CSSProperties) {
  const ctx = getCanvasContext();

  // Build font string from style
  const fontSize = style.fontSize ? addPixelToValueIfNeeded(style.fontSize) : '16px';
  const fontFamily = style.fontFamily || 'sans-serif';
  const fontWeight = style.fontWeight || 'normal';
  const fontStyle = style.fontStyle || 'normal';

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
  (ctx as any).letterSpacing = style.letterSpacing
    ? addPixelToValueIfNeeded(style.letterSpacing)
    : '0px';

  const metrics = ctx.measureText(text);

  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  };
}

function getMeasurementContainer() {
  if (measurementContainer === null) {
    measurementContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    measurementContainer.setAttribute('aria-hidden', 'true');

    measurementContainer.style.position = 'absolute';
    measurementContainer.style.top = '-20000px';
    measurementContainer.style.left = '0';
    measurementContainer.style.padding = '0';
    measurementContainer.style.margin = '0';
    measurementContainer.style.border = 'none';
    measurementContainer.style.pointerEvents = 'none';
    measurementContainer.style.visibility = 'hidden';
    measurementContainer.style.contain = 'strict';

    document.body.appendChild(measurementContainer);
  }

  return measurementContainer;
}

function getCanvasContext() {
  if (measurementContext === null) {
    measurementCanvas = document.createElement('canvas');
    measurementContext = measurementCanvas.getContext('2d');

    if (measurementContext === null) {
      throw new Error('Canvas context not available');
    }
  }
  return measurementContext;
}

function checkLetterSpacingSupport(): boolean {
  if (canvasSupportsLetterSpacing !== null) {
    return canvasSupportsLetterSpacing;
  }

  try {
    const ctx = getCanvasContext();
    if (!ctx) {
      canvasSupportsLetterSpacing = false;
      return false;
    }

    // Test if letterSpacing property is supported
    const testText = 'test';
    const testStyle = { fontSize: 16, letterSpacing: '5px' };

    // Apply styles
    ctx.font = `${testStyle.fontSize}px sans-serif`;
    const widthWithoutLetterSpacing = ctx.measureText(testText).width;

    // Try to apply letterSpacing
    (ctx as any).letterSpacing = testStyle.letterSpacing;
    const widthWithLetterSpacing = ctx.measureText(testText).width;

    // If letterSpacing is supported, the widths should be different
    // We expect approximately 15px difference (3 letter spacings * 5px)
    const hasSupport = widthWithLetterSpacing > widthWithoutLetterSpacing;

    canvasSupportsLetterSpacing = hasSupport;
    return hasSupport;
  } catch (error) {
    // Silently catch errors (e.g., canvas not supported in jsdom)
    canvasSupportsLetterSpacing = false;
    return false;
  }
}
