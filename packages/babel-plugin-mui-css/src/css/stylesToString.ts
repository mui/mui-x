import type { CSSObject } from '@mui/system';
import unitLessProperties from './unitLessProperties.ts';

/* eslint-disable prefer-template */

const DASH_CHAR_CODE = '-'.charCodeAt(0);

const SPECIAL_CHAR = /--|#|\.|\s|>|&|:/;
const UPPERCASE_LETTERS = /[A-Z]/g;

const stack = [] as any[];
export function stylesToString(rootSelector: string, rootStyles: CSSObject) {
  stack.length = 0;
  stack.push(rootSelector, rootStyles, '');

  const rules = [] as string[];

  while (stack.length > 0) {
    const parents = stack.pop();
    const styles = stack.pop();
    const nested = stack.pop();
    const selector = transformSelector(nested, parents);

    let output = `${selector} { `;

    for (const key in styles) {
      if (isSpecial(key)) {
        if (isVariable(key)) {
          const cssKey = key;
          const cssValue = styles[key];

          output += cssKey + ':' + cssValue + ';';
        } /* nested selector */ else {
          stack.unshift(key, styles[key], selector);
        }
      } else {
        const cssKey = key.replaceAll(UPPERCASE_LETTERS, uppercaseToDashLowercase);
        const cssValue = transformValue(cssKey, styles[key]);

        output += cssKey + ':' + cssValue + ';';
      }
    }

    output += ' } ';

    rules.push(output);
  }

  return rules;
}

function uppercaseToDashLowercase(char: string) {
  return '-' + char.toLowerCase();
}

function transformSelector(selector: string, parents: string) {
  if (selector.includes('&')) {
    return selector.replaceAll('&', parents);
  }
  return (parents ? parents + ' ' : '') + selector;
}

function transformValue(cssKey: string, value: any) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error(`Invalid CSS: "${cssKey}: ${JSON.stringify(value) ?? 'undefined'}"`);
    }
  }

  if (typeof value !== 'number') {
    return value;
  }
  if (unitLessProperties.has(cssKey)) {
    return String(value);
  }
  return String(value) + 'px';
}

/** If the property is a nested selector or a CSS variable */
function isSpecial(key: string) {
  return SPECIAL_CHAR.test(key);
}

function isVariable(cssKey: string) {
  return cssKey.charCodeAt(0) === DASH_CHAR_CODE && cssKey.charCodeAt(1) === DASH_CHAR_CODE;
}
