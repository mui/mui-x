'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import type { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CompositeList } from '../../base-ui-copy/composite/list/CompositeList';
import { useAutoScrollForTimeGrid } from '../../use-auto-scroll-for-time-grid';

export const CalendarGridTimeScrollableContent = React.forwardRef(
  function CalendarGridScrollableContent(
    componentProps: CalendarGridTimeScrollableContent.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      style,
      // Internal props
      scrollableRef,
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    const ownRef = React.useRef<HTMLDivElement>(null);
    const columnsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    useAutoScrollForTimeGrid(scrollableRef ?? ownRef);

    const element = useRenderElement('div', componentProps, {
      ref: [forwardedRef, ownRef],
      props: [elementProps],
    });

    return <CompositeList elementsRef={columnsRefs}>{element}</CompositeList>;
  },
);

export namespace CalendarGridTimeScrollableContent {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Ref to the element that actually scrolls, where the drag-and-drop auto-scroll is registered. Defaults to this component's rendered element.
     */
    scrollableRef?: React.RefObject<HTMLElement | null>;
  }
}
