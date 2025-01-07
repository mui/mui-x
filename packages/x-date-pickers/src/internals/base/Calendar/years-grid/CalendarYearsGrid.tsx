'use client';
import * as React from 'react';
import { useCalendarYearsGrid } from './useCalendarYearsGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarYearsGrid = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getYearsGridProps, yearsCellRefs } = useCalendarYearsGrid({
    children,
    cellsPerRow,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>;
});

export namespace CalendarYearsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarYearsGrid.Parameters {}
}

export { CalendarYearsGrid };
