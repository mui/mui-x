'use client';
import * as React from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CompositeList } from '../../base-ui-copy/composite/list/CompositeList';

export const CalendarGridTimeScrollableContent = React.forwardRef(
  function CalendarGridScrollableContent(
    componentProps: CalendarGridTimeScrollableContent.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    const ref = React.useRef<HTMLDivElement>(null);
    const columnsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
      // TODO: Try to add the behavior back in the test
      // For now, it causes the following error in JSDOM:
      // "Auto scrolling has been attached to an element that appears not to be scrollable"
      if (!ref.current || process.env.IS_TEST_ENV) {
        return undefined;
      }

      return autoScrollForElements({
        element: ref.current,
      });
    });

    const element = useRenderElement('div', componentProps, {
      ref: [forwardedRef, ref],
      props: [elementProps],
    });

    return <CompositeList elementsRef={columnsRefs}>{element}</CompositeList>;
  },
);

export namespace CalendarGridTimeScrollableContent {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
