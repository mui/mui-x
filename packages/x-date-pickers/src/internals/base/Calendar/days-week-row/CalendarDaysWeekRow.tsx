'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useCalendarDaysWeekRow } from './useCalendarDaysWeekRow';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { CompositeList } from '../../composite/list/CompositeList';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarDaysGridBodyContext } from '../days-grid-body/CalendarDaysGridBodyContext';

const InnerCalendarDaysWeekRow = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysWeekRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDaysWeekRowProps, calendarDayCellRefs } = useCalendarDaysWeekRow({
    value,
    ctx,
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysWeekRowProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return <CompositeList elementsRef={calendarDayCellRefs}>{renderElement()}</CompositeList>;
});

const MemoizedInnerCalendarDaysWeekRow = React.memo(InnerCalendarDaysWeekRow);

const CalendarDaysWeekRow = React.forwardRef(function CalendarDaysWeekRow(
  props: CalendarDaysWeekRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const calendarDaysGridContext = useCalendarDaysGridContext();
  const calendarDaysGridBodyContext = useCalendarDaysGridBodyContext();
  const { ref: listItemRef, index: rowIndex } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to this component.
  const days = React.useMemo(
    () => calendarDaysGridContext.daysGrid.find((week) => week[0] === props.value) ?? [],
    [calendarDaysGridContext.daysGrid, props.value],
  );

  const ctx = React.useMemo(
    () => ({
      days,
      rowIndex,
      registerWeekRowCells: calendarDaysGridBodyContext.registerWeekRowCells,
    }),
    [days, rowIndex, calendarDaysGridBodyContext.registerWeekRowCells],
  );

  return <MemoizedInnerCalendarDaysWeekRow {...props} ref={mergedRef} ctx={ctx} />;
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
