import * as React from 'react';
import { type CSSObject } from '@mui/system';

export const STYLE_SLOT_REGISTRY = {} as Record<string, StyleSlot<any, any, any>>;

type JSXElement = React.JSXElementConstructor<any> | keyof React.JSX.IntrinsicElements;

export type StyleSlotMeta<C extends JSXElement> = {
  as: C;
  name: string;
  slot: string;
  overridesResolver?: any;
  id?: string;
};
export type StyleSlot<Props, Classes extends string, C extends JSXElement> = {
  component: (
    props: Props & {
      as?: JSXElement;
      ownerState?: any;
    },
  ) => React.ReactNode;
  meta: StyleSlotMeta<C>;
  classes: Record<Classes, string>;
};

export function slot<C extends JSXElement, K extends string>(
  meta: StyleSlotMeta<C>,
  styles: Record<K, CSSObject>,
): StyleSlot<React.ComponentProps<C>, K, any> {
  // Transpiled through babel
  const classes = styles as unknown as Record<string, string>;

  function Component(props: any) {
    const { as: asProp, ownerState, ...rest } = props;
    return React.createElement(asProp ?? meta.as, rest);
  }

  meta.id = `${meta.name}-${meta.slot}`;

  const slot = (STYLE_SLOT_REGISTRY[meta.slot] = {
    component: Component,
    meta,
    classes,
  });

  return slot;
}
