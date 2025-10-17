// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts

function isSsr(): boolean {
  return typeof window === 'undefined';
}

const stringCache = new Map<string, { width: number; height: number }>();

export function clearStringMeasurementCache() {
  stringCache.clear();
}

const MAX_CACHE_NUM = 2000;
const STYLE_SET = new Set([
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
export const MEASUREMENT_SPAN_ID = 'mui_measurement_span';

/**
 *
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function autoCompleteStyle(name: string, value: number) {
  if (STYLE_SET.has(name) && value === +value) {
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
    const measurementSpanContainer = getMeasurementContainer();
    const measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    Object.keys(style as Record<string, any>).map((styleKey) => {
      (measurementElem!.style as Record<string, any>)[camelToMiddleLine(styleKey)] =
        autoCompleteStyle(styleKey, (style as Record<string, any>)[styleKey]);
      return styleKey;
    });

    // measurementElem.style.whiteSpace = 'pre';
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

/**
 * Get (or create) a hidden span element to measure text size.
 */
function getMeasurementContainer() {
  let measurementContainer = document.getElementById(
    MEASUREMENT_SPAN_ID,
  ) as unknown as SVGSVGElement;

  if (measurementContainer === null) {
    measurementContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    measurementContainer.setAttribute('aria-hidden', 'true');
    measurementContainer.setAttribute('id', MEASUREMENT_SPAN_ID);

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
