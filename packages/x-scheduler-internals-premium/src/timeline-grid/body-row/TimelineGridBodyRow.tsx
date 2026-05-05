'use client';
import * as React from 'react';
import {
  useRenderElement,
  BaseUIComponentProps,
  useCompositeListItem,
} from '@mui/x-scheduler-internals/base-ui-copy';
import { TimelineGridBodyRowContext } from './TimelineGridBodyRowContext';

/**
 * A unified row container that registers in the CompositeList
 * and provides its index to child cells (TitleRow, EventRow).
 * This allows each resource row to be a single DOM element.
 */
export const TimelineGridBodyRow = React.forwardRef(function TimelineGridBodyRow(
  componentProps: TimelineGridBodyRow.Props,
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

  const { ref: listItemRef, index } = useCompositeListItem();

  const contextValue: TimelineGridBodyRowContext = React.useMemo(() => ({ index }), [index]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, listItemRef],
    props: [
      elementProps,
      {
        role: 'row',
        // Reserve aria-rowindex=1 for the grid header row.
        'aria-rowindex': index + 2,
      },
    ],
  });

  return (
    <TimelineGridBodyRowContext.Provider value={contextValue}>
      {element}
    </TimelineGridBodyRowContext.Provider>
  );
});

export namespace TimelineGridBodyRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
