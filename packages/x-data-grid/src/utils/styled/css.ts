import * as React from 'react';
import { useTheme } from '@mui/material';
import { applyStyled } from '@mui/system/createStyled';
import type { CSSObject } from '@mui/system';
import { injectStyles } from './engine';

type Meta = {
  name: string;
  slot: string;
};

type StyleMeta<Keys extends string | number | symbol> = {
  meta: Meta,
  styles: { [key in Keys]: CSSObject },
  classes: { [key in Keys]: string },
};

export function css<T extends Record<string, CSSObject>>(meta: Meta, styles: T): StyleMeta<keyof T> {
  const classes = {} as { [key in keyof T]: string }

  const baseClassName = `${meta.name}-${meta.slot}`

  for (let key in styles) {
    // FIXME: classnames like `.Mui-selected`
    const className = key === 'root' ? baseClassName : `${baseClassName}--${key}`

    classes[key] = className

    injectStyles(`.${className}`, styles[key])
  }

  const cx = {
    meta,
    styles,
    classes,
  };

  return cx;
}

type PropsBase = { classes?: Record<string, string> }
type KeysBase = string | number | symbol

// XXX: Use `styledUnstyled` after prototyping is done.
export const StyledContext = React.createContext(styledMaterial);
// export const StyledContext = React.createContext(styledUnstyled);

export function useStyled<Props extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: Props,
) {
  return React.useContext(StyledContext)(styleMeta, rootProps);
}


export function styledUnstyled<Props extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: Props,
) {
  const result = { ...styleMeta.classes, }

  const classes = rootProps.classes
  if (classes) {
    for (let key in result) {
      if (classes[key]) {
        result[key] += ' ' + classes[key]
      }
    }
  }

  return result
}

export function styledMaterial<Props extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: Props,
) {
  const theme = useTheme()
  const styledClassName = applyStyled(
    { ...rootProps, theme },
    styleMeta.meta.name,
    (_: any, styles: any) => styles[styleMeta.meta.slot],
  )

  const result = {
    ...styleMeta.classes,
  }
  if ((result as any).root) {
    (result as any).root += ' ' + styledClassName
  }

  const classes = rootProps.classes
  if (classes) {
    for (let key in result) {
      if (classes[key]) {
        result[key] += ' ' + classes[key]
      }
    }
  }

  return result
}
