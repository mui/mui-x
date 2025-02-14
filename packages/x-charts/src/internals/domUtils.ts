// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts

function isSsr(): boolean {
  return typeof window === 'undefined';
}

interface StringCache {
  widthCache: Record<string, any>;
  cacheCount: number;
}

const stringCache: StringCache = {
  widthCache: {},
  cacheCount: 0,
};
const MAX_CACHE_NUM = 2000;
const SPAN_STYLE = {
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

let domCleanTimeout: NodeJS.Timeout | undefined;
/**
 *
 * @param text The string to estimate
 * @param style The style applied
 * @returns width and height of the text
 */
export const getStringSize = (
  text: string | number,
  {
    className = '',
    style = {},
    measuringElement,
  }: { className?: string; style?: React.CSSProperties; measuringElement: SVGElement | null },
) => {
  if (text === undefined || text === null || isSsr() || measuringElement === null) {
    return { width: 0, height: 0 };
  }

  const str = `${text}`;
  const styleString = getStyleString(style);
  const cacheKey = `${str}-${styleString}`;

  if (stringCache.widthCache[cacheKey]) {
    return stringCache.widthCache[cacheKey];
  }

  try {
    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    const measurementStyle: Record<string, any> = { ...SPAN_STYLE, ...style };

    const measurementText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    measurementText.classList.add(...className.split(' '));
    // measurementText.style = measurementStyle;
    Object.keys(measurementStyle).map((styleKey) => {
      (measurementText!.style as Record<string, any>)[camelToMiddleLine(styleKey)] =
        autoCompleteStyle(styleKey, measurementStyle[styleKey]);
      return styleKey;
    });
    measurementText.textContent = str;
    measuringElement.appendChild(measurementText);
    const rect = measurementText.getBBox();
    const result = { width: rect.width, height: rect.height };

    stringCache.widthCache[cacheKey] = result;

    if (stringCache.cacheCount + 1 > MAX_CACHE_NUM) {
      stringCache.cacheCount = 0;
      stringCache.widthCache = {};
    } else {
      stringCache.cacheCount += 1;
    }

    measuringElement.removeChild(measurementText);

    // if (domCleanTimeout) {
    //  clearTimeout(domCleanTimeout);
    // }
    // domCleanTimeout = setTimeout(() => {
    //  // Limit node cleaning to once per render cycle
    //  measurementSpan.textContent = '';
    // }, 0);

    return result;
  } catch {
    return { width: 0, height: 0 };
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function unstable_cleanupDOM() {
  // const measurementSpan = document.getElementById(MEASUREMENT_SPAN_ID);
  // measurementSpan?.remove();
}
