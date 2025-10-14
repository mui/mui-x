// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts

function isSsr(): boolean {
  return typeof window === 'undefined';
}

const stringCache = new Map<string, { width: number; height: number }>();

const MAX_CACHE_NUM = 2000;
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
export const MEASUREMENT_SPAN_ID = 'mui_measurement_span';

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

  const size = stringCache.get(cacheKey);
  if (size) {
    return size;
  }

  try {
    const measurementSpanContainer = getMeasurementSpanContainer();
    const measurementSpan = document.createElement('span');

    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    Object.keys(style as Record<string, any>).map((styleKey) => {
      (measurementSpan!.style as Record<string, any>)[camelToMiddleLine(styleKey)] =
        autoCompleteStyle(styleKey, (style as Record<string, any>)[styleKey]);
      return styleKey;
    });

    measurementSpan.style.position = 'absolute';
    measurementSpan.style.whiteSpace = 'pre';
    measurementSpan.textContent = str;

    measurementSpanContainer.replaceChildren(measurementSpan);

    const rect = measurementSpan.getBoundingClientRect();
    const result = { width: rect.width, height: rect.height };

    stringCache.set(cacheKey, result);

    if (stringCache.size + 1 > MAX_CACHE_NUM) {
      stringCache.clear();
    }

    return result;
  } catch {
    return { width: 0, height: 0 };
  }
};

/**
 * Get (or create) a hidden span element to measure text size.
 */
function getMeasurementSpanContainer() {
  let measurementSpanContainer = document.getElementById(MEASUREMENT_SPAN_ID);

  if (measurementSpanContainer === null) {
    // Create a hidden wrapper that wraps the measurement span container.
    const wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');

    wrapper.style.position = 'absolute';
    wrapper.style.top = '-20000px';
    wrapper.style.left = '0';
    wrapper.style.padding = '0';
    wrapper.style.margin = '0';
    wrapper.style.border = 'none';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.visibility = 'hidden';
    wrapper.style.contain = 'strict';

    document.body.appendChild(wrapper);

    measurementSpanContainer = document.createElement('span');
    // Use relative positioning so its children can use absolute positioning and not be visible
    measurementSpanContainer.style.position = 'relative';
    measurementSpanContainer.setAttribute('id', MEASUREMENT_SPAN_ID);
    wrapper.appendChild(measurementSpanContainer);
  }

  return measurementSpanContainer;
}
