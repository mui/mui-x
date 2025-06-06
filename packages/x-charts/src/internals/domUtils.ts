// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts

import * as React from 'react';

function isSsr(): boolean {
  return typeof window === 'undefined';
}

const stringCache = new Map<string, { width: number; height: number }>();

const MAX_CACHE_NUM = 2000;
const SPAN_STYLE = {
  position: 'absolute',
  top: '-20000px',
  left: 0,
  padding: 0,
  margin: 0,
  border: 'none',
  whiteSpace: 'pre',
};
const STYLE_LIST = [
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
];

const MEASUREMENT_DIV_ID = 'mui_measurement_div';

/**
 *
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function autoCompleteStyle(name: string, value: number) {
  if (STYLE_LIST.indexOf(name) >= 0 && value === +value) {
    return `${value}px`;
  }

  return value;
}

/**
 *
 * @param text camelcase css property
 * @returns css property
 */
function camelToMiddleLine(text: string) {
  const strs = text.split('');

  const formatStrs = strs.reduce((result: string[], entry) => {
    if (entry === entry.toUpperCase()) {
      return [...result, '-', entry.toLowerCase()];
    }

    return [...result, entry];
  }, []);

  return formatStrs.join('');
}

/**
 *
 * @param style React style object
 * @returns CSS styling string
 */
export const getStyleString = (style: React.CSSProperties) =>
  Object.keys(style)
    .sort()
    .reduce(
      (result, s) =>
        `${result}${camelToMiddleLine(s)}:${autoCompleteStyle(
          s,
          (style as Record<string, any>)[s],
        )};`,
      '',
    );

let domCleanTimeout: ReturnType<typeof setTimeout> | undefined;

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

  const str = `${text}`;
  const styleString = getStyleString(style);
  const cacheKey = `${str}-${styleString}`;

  const result = stringCache.get(cacheKey);

  if (result) {
    return result;
  }

  warmUpStringCache([text], style);

  return stringCache.get(cacheKey) ?? { width: 0, height: 0 };
};

export function warmUpStringCache(
  texts: Iterable<string | number>,
  style: React.CSSProperties = {},
) {
  if (isSsr()) {
    return;
  }

  const styleString = getStyleString(style);

  try {
    let measurementDiv = document.getElementById(MEASUREMENT_DIV_ID);
    if (measurementDiv === null) {
      measurementDiv = document.createElement('div');
      measurementDiv.setAttribute('id', MEASUREMENT_DIV_ID);
      measurementDiv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(measurementDiv);
    }

    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    const measurementDivStyle: Record<string, any> = { ...SPAN_STYLE, ...style };

    Object.keys(style).map((styleKey) => {
      (measurementDiv!.style as Record<string, any>)[camelToMiddleLine(styleKey)] =
        autoCompleteStyle(styleKey, measurementDivStyle[styleKey]);
      return styleKey;
    });

    const spans = [];
    for (const text of texts) {
      const str = `${text}`;
      const cacheKey = `${str}-${styleString}`;

      if (cache.has(cacheKey)) {
        // If already cached, skip the measurement
        continue;
      }

      const span = document.createElement('span');
      span.textContent = str;
      spans.push(span);
    }

    measurementDiv.replaceChildren(...spans);

    let i = 0;
    for (const text of texts) {
      const str = `${text}`;
      const cacheKey = `${str}-${styleString}`;

      if (stringCache.has(cacheKey)) {
        // The string is already cached. Do not increment the index because a span wasn't created for cached strings
        continue;
      }

      const span = spans[i];
      const rect = span.getBoundingClientRect();

      stringCache.set(cacheKey, { width: rect.width, height: rect.height });

      if (stringCache.size + 1 > MAX_CACHE_NUM) {
        // This is very inefficient, we should be smarter about which entries to purge
        stringCache.clear();
      }
      i += 1;
    }

    if (process.env.NODE_ENV === 'test') {
      // In test environment, we clean the measurement div immediately
      measurementDiv.replaceChildren();
    } else {
      if (domCleanTimeout) {
        clearTimeout(domCleanTimeout);
      }
      domCleanTimeout = setTimeout(() => {
        // Limit node cleaning to once per render cycle
        measurementDiv.replaceChildren();
      }, 0);
    }
  } catch {
    /* Intentionally do nothing */
  }
}
