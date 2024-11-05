import type { CSSObject } from '@mui/system';
import { stylesToString } from './stylesToString';

let element = undefined as HTMLStyleElement | undefined

export function injectStyles(selector: string, styles: CSSObject) {
  if (typeof document === 'undefined') { return }
  const style = setup()
  if (process.env.NODE_ENV === 'development') {
    style.innerHTML += stylesToString(selector, styles).join('\n') + '\n';
  } else {
    const rules = stylesToString(selector, styles);
    for (let i = 0; i < rules.length; i += 1) {
      style.sheet!.insertRule(rules[i]);
    }
  }
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
