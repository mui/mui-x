'use client';
import * as React from 'react';
import { useCalendarDaysWeekRow } from './useCalendarDaysWeekRow';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';

const InnerCalendarDaysWeekRow = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysWeekRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDaysWeekRowProps } = useCalendarDaysWeekRow({ value, ctx, children });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysWeekRowProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarDaysWeekRow = React.memo(InnerCalendarDaysWeekRow);

const CalendarDaysWeekRow = React.forwardRef(function CalendarDaysWeekRow(
  props: CalendarDaysWeekRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const calendarDaysGridContext = useCalendarDaysGridContext();

  // TODO: Improve how we pass the week to this component.
  const { rowIndex, days } = React.useMemo(() => {
    const index = calendarDaysGridContext.daysGrid.findIndex((week) => week[0] === props.value);

    return { rowIndex: index, days: calendarDaysGridContext.daysGrid[index] };
  }, [calendarDaysGridContext.daysGrid, props.value]);

  const ctx = React.useMemo(() => ({ days, rowIndex }), [days, rowIndex]);

  return <MemoizedInnerCalendarDaysWeekRow {...props} ref={forwardedRef} ctx={ctx} />;
});

export namespace CalendarDaysWeekRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useCalendarDaysWeekRow.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysWeekRowProps
  extends Omit<BaseUIComponentProps<'div', CalendarDaysWeekRow.State>, 'children'>,
    useCalendarDaysWeekRow.Parameters {}

export { CalendarDaysWeekRow };
