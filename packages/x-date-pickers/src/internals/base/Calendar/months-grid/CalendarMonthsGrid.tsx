'use client';
import * as React from 'react';
import { useCalendarMonthsGrid } from './useCalendarMonthsGrid';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarMonthsCellCollectionContext } from '../utils/months-cell-collection/CalendarMonthsCellCollectionContext';

const CalendarMonthsGrid = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getMonthsGridProps, context, monthsCellRefs } = useCalendarMonthsGrid({
    children,
    cellsPerRow,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarMonthsCellCollectionContext.Provider value={context}>
      <CompositeList elementsRef={monthsCellRefs}>{renderElement()}</CompositeList>
    </CalendarMonthsCellCollectionContext.Provider>
  );
});

export namespace CalendarMonthsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthsGrid.Parameters {}
}

export { CalendarMonthsGrid };
