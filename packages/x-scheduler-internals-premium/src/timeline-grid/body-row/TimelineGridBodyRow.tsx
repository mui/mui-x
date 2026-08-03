'use client';
import * as React from 'react';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { TimelineGridBodyRowContext } from './TimelineGridBodyRowContext';

/**
 * A unified row container that provides its index to child cells
 * (TitleRow, EventRow) for keyboard navigation.
 * The `index` is passed as a prop (e.g. from the virtualizer's renderRow).
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
    // Internal props
    index,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const contextValue: TimelineGridBodyRowContext = React.useMemo(() => ({ index }), [index]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
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

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The logical row index within the grid.
     * Provided by the virtualizer's `renderRow` callback.
     */
    index: number;
  }
}
