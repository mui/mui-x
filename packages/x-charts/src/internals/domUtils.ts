// DOM utils adapted from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts
import * as React from 'react';

const isSsr = typeof window === 'undefined';
const stringCache = new Map<string, { width: number; height: number }>();

let canvasSupportsLetterSpacing: boolean | null = null;
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;

const shouldUseCanvas = checkLetterSpacingSupport();

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

export function measureText(text: string | number, style: React.CSSProperties = {}) {
  if (isSsr) {
    return { width: 0, height: 0 };
  }

  const string = String(text);
  const styleString = hashCSS(style);
  const cacheKey = `${string}-${styleString}`;

  const size = stringCache.get(cacheKey);
  if (size) {
    return size;
  }

  let result: { width: number; height: number } | null = null;

  if (shouldUseCanvas) {
    try {
      canvasPrepare(style);
      result = canvasMeasureText(string);
    } catch (error) {
      console.warn(
        'MUI X Charts: Canvas measurement failed, falling back to SVG measurement.',
        error,
      );
    }
  }

  if (!result) {
    // Fall back to SVG-based measurement
    const container = svgPrepareContainer();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgPrepareNode(element, style);
    element.textContent = String(text);

    container.replaceChildren(element);

    const rect = element.getBoundingClientRect();

    result = { width: rect.width, height: rect.height };

    if (process.env.NODE_ENV === 'test') {
      // In test environment, we clean the measurement span immediately
      container.replaceChildren();
    }
  }

  stringCache.set(cacheKey, result);

  if (stringCache.size + 1 > MAX_CACHE_NUM) {
    stringCache.clear();
  }

  return result;
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
  const styleString = hashCSS(style);

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

  let shouldUseSVG = !shouldUseCanvas;

  if (shouldUseCanvas) {
    try {
      canvasPrepare(style);

      for (const text of textToMeasure) {
        const result = canvasMeasureText(String(text));
        const cacheKey = `${text}-${styleString}`;

        stringCache.set(cacheKey, result);
        sizeMap.set(text, result);
      }
    } catch (error) {
      console.warn(
        'MUI X Charts: Canvas batch measurement failed, falling back to SVG measurement.',
        error,
      );
      shouldUseSVG = true;
    }
  }

  if (shouldUseSVG) {
    const measurementContainer = svgPrepareContainer();

    svgPrepareNode(measurementContainer, style);

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

let measurementContainer: SVGSVGElement | null = null;
function svgPrepareContainer() {
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

function svgPrepareNode(element: SVGElement, style: React.CSSProperties) {
  // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
  // https://en.wikipedia.org/wiki/Content_Security_Policy
  for (const styleKey of Object.keys(style as Record<string, any>)) {
    (element!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] = convertPixelValue(
      styleKey,
      (style as Record<string, any>)[styleKey],
    );
  }
}

function canvasPrepare(style: React.CSSProperties) {
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

  switch (style.textAlign) {
    case 'left':
    case 'right':
    case 'center':
    case 'start':
    case 'end':
      ctx.textAlign = style.textAlign;
      break;
    default:
      ctx.textAlign = 'start';
  }

  switch (style.alignmentBaseline) {
    case 'hanging':
    case 'middle':
    case 'alphabetic':
    case 'ideographic':
      ctx.textBaseline = style.alignmentBaseline;
      break;
    case 'text-before-edge':
      ctx.textBaseline = 'top';
      break;
    case 'text-after-edge':
      ctx.textBaseline = 'bottom';
      break;
    default:
      ctx.textBaseline = 'alphabetic';
  }

  ctx.direction = (style.direction as any) ?? 'ltr';
  ctx.fontKerning = (style.fontKerning as any) ?? 'auto';
  ctx.fontStretch = (style.fontStretch as any) ?? 'normal';
  ctx.fontVariantCaps = (style.fontVariantCaps as any) ?? 'normal';
}

function canvasMeasureText(text: string) {
  const ctx = getCanvasContext();
  const metrics = ctx.measureText(text);

  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  };
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
 */
const AZ = /([A-Z])/g;
function camelCaseToDashCase(text: string) {
  return String(text).replace(AZ, (match) => `-${match.toLowerCase()}`);
}

/**
 * Converts a style object into a string to be used as a cache key
 */
function hashCSS(style: React.CSSProperties) {
  let result = '';

  for (const key in style) {
    if (Object.hasOwn(style, key)) {
      const k = key as keyof React.CSSProperties;
      const value = style[k];

      if (value === undefined) {
        continue;
      }

      result += `${k}:${value};`;
    }
  }
  return result;
}
