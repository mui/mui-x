'use client';
import * as React from 'react';
import { useCalendarMonthsGrid } from './useCalendarMonthsGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarMonthsGrid = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, canChangeYear, ...otherProps } = props;
  const { getMonthsGridProps, monthsCellRefs } = useCalendarMonthsGrid({
    children,
    cellsPerRow,
    canChangeYear,
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

  return <CompositeList elementsRef={monthsCellRefs}>{renderElement()}</CompositeList>;
});

export namespace CalendarMonthsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthsGrid.Parameters {}
}

export { CalendarMonthsGrid };
