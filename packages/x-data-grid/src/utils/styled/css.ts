import * as React from 'react';
import { useTheme } from '@mui/material';
import { applyStyled } from '@mui/system/createStyled';
import type { CSSObject } from '@mui/system';
import { injectStyles } from './injectStyles';

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

// XXX: Use `styledUnstyled` after prototyping is done.
export const StyledContext = React.createContext(styledMaterial);
// export const StyledContext = React.createContext(styledUnstyled);

export function useStyled<P, Keys extends string | number | symbol>(
  styleMeta: StyleMeta<Keys>,
  params: { rootProps: P }
) {
  return React.useContext(StyledContext)(styleMeta, params);
}


export function styledUnstyled<P, Keys extends string | number | symbol>(
  styleMeta: StyleMeta<Keys>,
  _params: { rootProps: P }
) {
  const result = styleMeta.classes

  // XXX: rootProps.classes handling

  return result
}

export function styledMaterial<P, Keys extends string | number | symbol>(
  styleMeta: StyleMeta<Keys>,
  params: { rootProps: P }
) {
  const theme = useTheme()
  const styledClassName = applyStyled(
    { ...params.rootProps, theme },
    styleMeta.meta.name,
    (_: any, styles: any) => styles[styleMeta.meta.slot],
  )
  const result = {
    ...styleMeta.classes,
  }
  if ((result as any).root) {
    (result as any).root += ' ' + styledClassName
  }

  return result
}
