import * as React from 'react';
import { useTheme } from '@mui/material';
import { internal_applyStyled } from '@mui/system/createStyled';
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

export function useStyled<P, RP extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: RP,
  props?: P,
) {
  return React.useContext(StyledContext)(styleMeta, rootProps, props);
}


export function styledUnstyled<P, RP extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: RP,
  _props: P,
) {
  const classes = rootProps.classes
  if (!classes) {
    return styleMeta.classes;
  }

  const result = { ...styleMeta.classes, }

  for (let key in result) {
    if (classes[key]) {
      result[key] += ' ' + classes[key]
    }
  }

  return result
}

export function styledMaterial<P, RP extends PropsBase, Keys extends KeysBase>(
  styleMeta: StyleMeta<Keys>,
  rootProps: RP,
  props: P,
) {
  const classes = rootProps.classes

  const theme = useTheme()
  const styledClassName = internal_applyStyled(
    { ...props, ownerState: rootProps, theme },
    styleMeta.meta.name,
    styleMeta.meta.slot,
    (_: any, styles: any) => styles[styleMeta.meta.slot],
  )

  if (!classes && !styledClassName) {
    return styleMeta.classes;
  }

  const result = {
    ...styleMeta.classes,
  };

  (result as any).root = ((result as any).root ?? '') + ' ' + styledClassName

  if (classes) {
    for (let key in result) {
      if (classes[key]) {
        result[key] += ' ' + classes[key]
      }
    }
  }

  return result
}
