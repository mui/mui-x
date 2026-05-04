'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { CompositeList } from '../../base-ui-copy/composite/list/CompositeList';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CalendarGridDayRowContext } from './CalendarGridDayRowContext';
import { TemporalSupportedObject } from '../../models';

export const CalendarGridDayRow = React.forwardRef(function CalendarGridDayRow(
  componentProps: CalendarGridDayRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    start,
    end,
    rowIndex = 0,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const cellsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const contextValue: CalendarGridDayRowContext = React.useMemo(
    () => ({
      start,
      end,
      rowIndex,
    }),
    [start, end, rowIndex],
  );

  const elementAriaRowIndex = (elementProps as { 'aria-rowindex'?: number })['aria-rowindex'];
  const ariaRowIndex = typeof elementAriaRowIndex === 'number' ? elementAriaRowIndex : rowIndex + 2;

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role: 'row', 'aria-rowindex': ariaRowIndex }],
  });

  return (
    <CompositeList elementsRef={cellsRefs}>
      <CalendarGridDayRowContext.Provider value={contextValue}>
        {element}
      </CalendarGridDayRowContext.Provider>
    </CompositeList>
  );
});

export namespace CalendarGridDayRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The data and time at which the row starts.
     */
    start: TemporalSupportedObject;
    /**
     * The data and time at which the row ends.
     */
    end: TemporalSupportedObject;
    /**
     * The index of this row within its row type.
     * Used to uniquely identify the row for keyboard navigation when there are
     * multiple rows of the same type (e.g., multiple weeks in the month view).
     * @default 0
     */
    rowIndex?: number;
  }
}
