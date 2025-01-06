'use client';
import * as React from 'react';
import { useCalendarYearsGrid } from './useCalendarYearsGrid';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarYearsCellCollectionContext } from '../utils/years-cell-collection/CalendarYearsCellCollectionContext';

const CalendarYearsGrid = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getYearsGridProps, context, yearsCellRefs } = useCalendarYearsGrid({
    children,
    cellsPerRow,
  });
  const state = React.useMemo(() => ({ cellsPerRow }), [cellsPerRow]);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarYearsCellCollectionContext.Provider value={context}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </CalendarYearsCellCollectionContext.Provider>
  );
});

export namespace CalendarYearsGrid {
  export interface State {
    cellsPerRow: number;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarYearsGrid.Parameters {}
}

export { CalendarYearsGrid };
