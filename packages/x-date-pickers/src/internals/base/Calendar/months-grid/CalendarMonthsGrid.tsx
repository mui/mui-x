'use client';
import * as React from 'react';
import { useCalendarMonthsGrid } from './useCalendarMonthsGrid';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarMonthCellCollectionContext } from '../utils/month-cell-collection/CalendarMonthCellCollectionContext';

const CalendarMonthsGrid = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getMonthGridProps, context, calendarMonthsCellRefs } = useCalendarMonthsGrid({
    children,
    cellsPerRow,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarMonthCellCollectionContext.Provider value={context}>
      <CompositeList elementsRef={calendarMonthsCellRefs}>{renderElement()}</CompositeList>
    </CalendarMonthCellCollectionContext.Provider>
  );
});

export namespace CalendarMonthsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthsGrid.Parameters {}
}

export { CalendarMonthsGrid };
