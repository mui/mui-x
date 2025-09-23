'use client';
import * as React from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

export const TimeGridScrollableContent = React.forwardRef(function TimeGridScrollableContent(
  componentProps: TimeGridScrollableContent.Props,
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

  React.useEffect(() => {
    // TODO: Try to add the behavior back in the test
    // For now, it causes the following error in JSDOM:
    // "Auto scrolling has been attached to an element that appears not to be scrollable"
    if (!ref.current || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    return autoScrollForElements({
      element: ref.current,
    });
  });

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, ref],
    props: [elementProps],
  });
});

export namespace TimeGridScrollableContent {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
