import type { CSSObject } from '@mui/system';
import unitLessProperties from './unitLessProperties';

const SPECIAL_CHAR = /#|\.|\s|>|&/
const UPPERCASE_LETTERS = /[A-Z]/g

let element = undefined as HTMLStyleElement | undefined

export function injectStyles(selector: string, styles: CSSObject) {
  if (typeof document === 'undefined') { return }
  const style = setup()
  if (process.env.NODE_ENV === 'development') {
    style.innerHTML += stylesToString(selector, styles) + '\n';
  } else {
    style.sheet?.insertRule(stylesToString(selector, styles));
  }
}

function stylesToString(selector: string, styles: CSSObject, parents: string[] = []) {
  let output = `${transformSelector(selector, parents)} { `

  for (let key in styles) {
    const isSubStyles = SPECIAL_CHAR.test(key)

    if (isSubStyles) {
      output += stylesToString(key, styles[key] as any, parents.concat(selector))
    } else {
      const cssKey = key.replaceAll(UPPERCASE_LETTERS, uppercaseToDashLowercase)
      const cssValue = transformValue(cssKey, styles[key])

      output += cssKey + ':' + cssValue + ';'
    }
  }

  output += ' } '

  return output
}

function uppercaseToDashLowercase(char: string) {
  return '-' + char.toLowerCase()
}

function transformSelector(selector: string, parents: string[]) {
  if (selector.includes('&')) {
    return selector.replaceAll('&', parents.join(' '))
  }
  return parents.join(' ') + ' ' + selector
}

function transformValue(cssKey: string, value: any) {
  if (typeof value !== 'number') {
    return value
  }

  if (unitLessProperties.has(cssKey)) {
    return String(value)
  }

  return String(value) + 'px'
}

function setup() {
  if (!element) {
    element = (document.getElementById('mui-x-styles') ?? document.createElement('style')) as HTMLStyleElement;
    element.id = 'mui-x-styles';
    element.innerHTML = '';
    document.head.prepend(element);
  }

  return element
}
