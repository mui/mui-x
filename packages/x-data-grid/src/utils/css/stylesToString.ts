import type { CSSObject } from '@mui/system';
import unitLessProperties from './unitLessProperties';

/* eslint-disable prefer-template */

const DASH_CHAR_CODE = '-'.charCodeAt(0);

const SPECIAL_CHAR = /#|\.|\s|>|&|:/;
const UPPERCASE_LETTERS = /[A-Z]/g;

// TODO: By using native CSS nesting, we could make `stylesToString` more simple & performant.

const stack = [] as any[];
export function stylesToString(rootSelector: string, rootStyles: CSSObject) {
  stack.length = 0;
  stack.push(rootSelector, rootStyles, '');

  const rules = [] as string[];

  while (stack.length > 0) {
    const parents = stack.pop();
    const styles = stack.pop();
    const selector = stack.pop();

    let output = `${transformSelector(selector, parents)} { `;

    for (const key in styles) {
      if (isSubStyles(key)) {
        stack.push(key, styles[key], parents + ' ' + key);
      } else if (isVariable(key)) {
        const cssKey = key;
        const cssValue = styles[key];

        output += cssKey + ':' + cssValue + ';';
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
  return parents + ' ' + selector;
}

function transformValue(cssKey: string, value: any) {
  if (typeof value !== 'number') {
    return value;
  }
  if (unitLessProperties.has(cssKey)) {
    return String(value);
  }
  return String(value) + 'px';
}

function isSubStyles(key: string) {
  return SPECIAL_CHAR.test(key);
}

function isVariable(cssKey: string) {
  return cssKey.charCodeAt(0) === DASH_CHAR_CODE && cssKey.charCodeAt(1) === DASH_CHAR_CODE;
}
