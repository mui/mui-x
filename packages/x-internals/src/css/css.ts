import type { CSSObject } from '@mui/system';
import { stylesToString } from './stylesToString';
import { CSSMeta } from './base';

const STYLE_ID = 'mui-x-data-grid';

let element = undefined as HTMLStyleElement | undefined;

/*
 * This logic should only be in use in development. For production, the `css()` calls should
 * be compiled away by the babel plugin.
 */

export function css<T extends Record<string, CSSObject>>(prefix: string, styles: T): CSSMeta<T> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The `css()` utility should not be called in a production bundle. Please report this error.',
    );
  } else {
    return cssDevMode(prefix, styles);
  }
}

/* These are used to track insertion order so it stays stable across HMR updates. */
const indexById = {} as Record<string, number>;
const blobs = [] as string[];

function cssDevMode<T extends Record<string, CSSObject>>(prefix: string, styles: T): CSSMeta<T> {
  let output = '';

  const result = {} as any;
  for (const key in styles) {
    if (Object.hasOwn(styles, key)) {
      const className = generateClassName(prefix, key);
      result[key] = className;

      output += generateCSS(`.${className}`, styles[key]);
    }
  }

  const id = prefix;
  const index = indexById[id] ?? blobs.length;
  indexById[id] = index;
  blobs[index] = output;

  injectCSS();

  return result;
}

export function generateClassName(prefix: string, className: string) {
  if (className === 'root') {
    return prefix;
  }
  return `${prefix}--${className}`;
}

function generateCSS(selector: string, styles: Record<string, any>) {
  if (typeof document === 'undefined') {
    return '';
  }
  return stylesToString(selector, styles).join('\n');
}

function injectCSS() {
  if (typeof document === 'undefined') {
    return;
  }

  const style = setup();
  style.innerHTML = blobs.join('\n');
}

function setup() {
  if (!element) {
    element = (document.getElementById(STYLE_ID) ??
      document.createElement('style')) as HTMLStyleElement;
    element.id = STYLE_ID;
    element.innerHTML = '';
    document.head.prepend(element);
  }

  return element;
}
