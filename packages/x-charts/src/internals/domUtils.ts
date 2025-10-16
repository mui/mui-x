// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts

function isSsr(): boolean {
  return typeof window === 'undefined';
}

let measurementContainer: SVGSVGElement | null = null;
let measurementElement: SVGTextElement | null = null;
let measurementLastStyle: string | null = null;

const stringCache = new Map<string, { width: number; height: number }>();

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
export const MEASUREMENT_SPAN_ID = 'mui_measurement_span';

/**
 *
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function convertPixelValue(name: string, value: number) {
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
function camelCaseToDashCase(text: string) {
  return text.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}

/**
 *
 * @param style React style object
 * @returns CSS styling string
 */
export const getStyleString = (style: React.CSSProperties) => {
  let result = '';
  for (const key in style) {
    if (Object.hasOwn(style, key)) {
      const value = style[key as keyof React.CSSProperties] as string;
      result += `${result}${camelCaseToDashCase(value)}:${convertPixelValue(
        value,
        (style as Record<string, any>)[value],
      )};`;
    }
  }
  return result;
};

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

  const string = String(text);
  const styleString = getStyleString(style);
  const cacheKey = `${string}-${styleString}`;

  const size = stringCache.get(cacheKey);
  if (size) {
    return size;
  }

  try {
    if (measurementElement === null || styleString !== measurementLastStyle) {
      measurementLastStyle = styleString;
      measurementElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      // Need to use CSS Object Model (CSSOM) to be able to comply with CSP
      Object.keys(style as Record<string, any>).forEach((styleKey) => {
        (element!.style as Record<string, any>)[camelCaseToDashCase(styleKey)] = convertPixelValue(
          styleKey,
          (style as Record<string, any>)[styleKey],
        );
        return styleKey;
      });
    }

    const container = getMeasurementContainer();
    const element = measurementElement;

    element.textContent = string;

    container.replaceChildren(element);

    const rect = element.getBoundingClientRect();
    const result = { width: rect.width, height: rect.height };

    stringCache.set(cacheKey, result);

    if (stringCache.size + 1 > MAX_CACHE_NUM) {
      stringCache.clear();
    }

    if (process.env.NODE_ENV === 'test') {
      // In test environment, we clean the measurement span immediately
      container.replaceChildren();
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
  if (measurementContainer === null) {
    measurementContainer = document.getElementById(MEASUREMENT_SPAN_ID) as unknown as SVGSVGElement;
  }

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
