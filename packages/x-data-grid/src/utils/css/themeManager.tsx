import * as React from 'react';
import { useTheme, type Theme } from '@mui/material/styles';
import { stylesToString } from './stylesToString';
import { transformMaterialUITheme } from './transformVariables';

const STYLE_ID = 'mui-x-data-grid';
const CLASSNAME_PREFIX = 'MuiDataGridVariables';

let element = undefined as HTMLStyleElement | undefined;

let nextClassNameId = 1;
const classNameByTheme = new WeakMap<object, string>();

export function useCSSVariablesClass() {
  return getClassNameForTheme(useTheme());
}

export function GridPortalWrapper({ children }: { children: React.ReactNode }) {
  const className = useCSSVariablesClass();
  return <div className={className}>{children}</div>;
}

function getClassNameForTheme(theme: Theme) {
  let className = classNameByTheme.get(theme);
  if (className) {
    return className;
  }

  className = `${CLASSNAME_PREFIX}-${nextClassNameId}`;
  nextClassNameId += 1;

  classNameByTheme.set(theme, className);

  injectStyles(`.${className}`, transformMaterialUITheme(theme));

  return className;
}

function injectStyles(selector: string, variables: Record<string, any>) {
  if (typeof document === 'undefined') {
    return;
  }
  const style = setup();
  if (process.env.NODE_ENV === 'development') {
    style.innerHTML += `${stylesToString(selector, variables).join('\n')}\n`;
  } else {
    const rules = stylesToString(selector, variables);
    for (let i = 0; i < rules.length; i += 1) {
      style.sheet!.insertRule(rules[i]);
    }
  }
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
