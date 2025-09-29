'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useTimelineRootContext } from '../root/TimelineRootContext';
import { selectors } from '../root/store';

export const TimelineSubGrid = React.forwardRef(function TimelineSubGrid<Item = any>(
  componentProps: TimelineSubGrid.Props<Item>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    children: childrenProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { store } = useTimelineRootContext<Item>();
  const items = useStore(store, selectors.items);

  const children = React.useMemo(() => {
    if (!React.isValidElement(childrenProp) && typeof childrenProp === 'function') {
      return items.map(childrenProp);
    }

    return childrenProp;
  }, [childrenProp, items]);

  const props = React.useMemo(() => ({ role: 'rowgroup', children }), [children]);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
}) as TimelineSubGrid.Component;

export namespace TimelineSubGrid {
  export interface State {}

  export interface Props<Item = any> extends Omit<BaseUIComponentProps<'div', State>, 'children'> {
    children?: React.ReactNode | ((item: Item, index: number, items: Item[]) => React.ReactNode);
  }

  export type Component = <Item = any>(
    props: Props<Item> & React.RefAttributes<HTMLDivElement>,
  ) => React.ReactElement;
}
