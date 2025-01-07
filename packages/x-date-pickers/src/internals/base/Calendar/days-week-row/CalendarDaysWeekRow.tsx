'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useCalendarDaysWeekRow } from './useCalendarDaysWeekRow';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysGridContext } from '../../utils/base-calendar/days-grid/BaseCalendarDaysGridContext';
import { CompositeList } from '../../composite/list/CompositeList';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useBaseCalendarDaysGridBodyContext } from '../../utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';

const InnerCalendarDaysWeekRow = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysWeekRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDaysWeekRowProps, dayCellRefs } = useCalendarDaysWeekRow({
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

  return <CompositeList elementsRef={dayCellRefs}>{renderElement()}</CompositeList>;
});

const MemoizedInnerCalendarDaysWeekRow = React.memo(InnerCalendarDaysWeekRow);

const CalendarDaysWeekRow = React.forwardRef(function CalendarDaysWeekRow(
  props: CalendarDaysWeekRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const baseDaysGridBodyContext = useBaseCalendarDaysGridBodyContext();
  const { ref: listItemRef, index: rowIndex } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to this component.
  const days = React.useMemo(
    () => baseDaysGridContext.daysGrid.find((week) => week[0] === props.value) ?? [],
    [baseDaysGridContext.daysGrid, props.value],
  );

  const ctx = React.useMemo(
    () => ({
      days,
      rowIndex,
      registerWeekRowCells: baseDaysGridBodyContext.registerWeekRowCells,
    }),
    [days, rowIndex, baseDaysGridBodyContext.registerWeekRowCells],
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
