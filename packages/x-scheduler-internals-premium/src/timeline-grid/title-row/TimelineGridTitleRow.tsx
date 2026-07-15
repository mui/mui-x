'use client';
import * as React from 'react';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { useTimelineGridRowKeyboard } from '../../internals/utils/useTimelineGridRowKeyboard';

export const TimelineGridTitleRow = React.forwardRef(function TimelineGridTitleRow(
  componentProps: TimelineGridTitleRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { rowRef, handleKeyDown, handleFocus } = useTimelineGridRowKeyboard({
    columnType: 'title',
  });

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, rowRef],
    props: [
      elementProps,
      {
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
      },
    ],
  });
});

export namespace TimelineGridTitleRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
