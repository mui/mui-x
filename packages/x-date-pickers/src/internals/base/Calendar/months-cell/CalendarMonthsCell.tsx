'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthsCell } from './useCalendarMonthsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarMonthsListContext } from '../months-list/CalendarMonthsListContext';

const InnerCalendarMonthsCell = React.forwardRef(function InnerCalendarMonthsCell(
  props: InnerCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthCellProps, isCurrent } = useCalendarMonthsCell({ value, format, ctx });

  const state: CalendarMonthsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarMonthsCell = React.memo(InnerCalendarMonthsCell);

const CalendarMonthsCell = React.forwardRef(function CalendarMonthsCell(
  props: CalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsListContext = useCalendarMonthsListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameMonth(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const ctx = React.useMemo<useCalendarMonthsCell.Context>(
    () => ({
      isSelected,
      selectMonth: calendarMonthsListContext.selectMonth,
    }),
    [isSelected, calendarMonthsListContext.selectMonth],
  );

  return <MemoizedInnerCalendarMonthsCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarMonthsCell {
  export interface State {
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarMonthsCell.Parameters, 'ctx'>,
      BaseUIComponentProps<'div', State> {}
}

interface InnerCalendarMonthsCellProps
  extends useCalendarMonthsCell.Parameters,
    BaseUIComponentProps<'div', CalendarMonthsCell.State> {}

export { CalendarMonthsCell };
