'use client';
import * as React from 'react';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
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

  const { rowRef, listItemRef, index, handleKeyDown, handleFocus } = useTimelineGridRowKeyboard({
    columnType: 'title',
  });

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, listItemRef, rowRef],
    props: [
      elementProps,
      {
        role: 'row',
        // Reserve aria-rowindex=1 for the grid header row.
        'aria-rowindex': index + 2,
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
