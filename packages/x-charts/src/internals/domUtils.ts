// DOM utils adapted from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts
import * as React from 'react';

function isSsr(): boolean {
  return typeof window === 'undefined';
}

const stringCache = new Map<string, { width: number; height: number }>();

export function clearStringMeasurementCache() {
  stringCache.clear();
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
]);

/**
 *
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function convertPixelValue(name: string, value: number | string) {
  if (PIXEL_STYLES.has(name) && value === +value) {
    return `${value}px`;
  }

  return value;
}

/**
 *
 * @param text camelcase css property
 * @returns css property
 */
const AZ = /([A-Z])/g;
function camelCaseToDashCase(text: string) {
  return String(text).replace(AZ, (match) => `-${match.toLowerCase()}`);
}

/**
 *
 * @param style React style object
 * @returns CSS styling string
 */
function getStyleString(style: React.CSSProperties) {
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
export const getStringSize = (text: string | number, style: React.CSSProperties = {}) => {
  if (text === undefined || text === null || isSsr()) {
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
    const measurementSpanContainer = getMeasurementContainer();
    const measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    Object.keys(style as Record<string, any>).map((styleKey) => {
      (measurementElem!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] =
        convertPixelValue(styleKey, (style as Record<string, any>)[styleKey]);
      return styleKey;
    });

    measurementElem.textContent = str;

    measurementSpanContainer.replaceChildren(measurementElem);

    const rect = measurementElem.getBoundingClientRect();
    const result = { width: rect.width, height: rect.height };

    stringCache.set(cacheKey, result);

    if (stringCache.size + 1 > MAX_CACHE_NUM) {
      stringCache.clear();
    }

    if (process.env.NODE_ENV === 'test') {
      // In test environment, we clean the measurement span immediately
      measurementSpanContainer.replaceChildren();
    }

    return result;
  } catch {
    return { width: 0, height: 0 };
  }
};

export function batchMeasureStrings(
  texts: Iterable<string | number>,
  style: React.CSSProperties = {},
) {
  if (isSsr()) {
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

  const measurementContainer = getMeasurementContainer();
  // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
  // https://en.wikipedia.org/wiki/Content_Security_Policy
  const measurementSpanStyle: Record<string, any> = { ...style };

  Object.keys(measurementSpanStyle).map((styleKey) => {
    (measurementContainer!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] =
      convertPixelValue(styleKey, measurementSpanStyle[styleKey]);
    return styleKey;
  });

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

  if (stringCache.size + 1 > MAX_CACHE_NUM) {
    stringCache.clear();
  }

  if (process.env.NODE_ENV === 'test') {
    // In test environment, we clean the measurement span immediately
    measurementContainer.replaceChildren();
  }

  return sizeMap;
}

let measurementContainer: SVGSVGElement | null = null;

/**
 * Get (or create) a hidden span element to measure text size.
 */
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
