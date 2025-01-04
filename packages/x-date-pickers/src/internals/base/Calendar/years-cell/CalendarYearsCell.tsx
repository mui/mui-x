'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarYearsCell } from './useCalendarYearsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarYearsListContext } from '../years-list/CalendarYearsListContext';

const InnerCalendarYearsCell = React.forwardRef(function InnerCalendarYearsCell(
  props: InnerCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps, isCurrent } = useCalendarYearsCell({ value, format, ctx });

  const state: CalendarYearsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getYearCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarYearsCell = React.memo(InnerCalendarYearsCell);

const CalendarYearsCell = React.forwardRef(function CalendarsYearCell(
  props: CalendarYearsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const calendarYearsListContext = useCalendarYearsListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameYear(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const ctx = React.useMemo<useCalendarYearsCell.Context>(
    () => ({
      isSelected,
      selectYear: calendarYearsListContext.selectYear,
    }),
    [isSelected, calendarYearsListContext.selectYear],
  );

  return <MemoizedInnerCalendarYearsCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarYearsCell {
  export interface State {
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarYearsCell.Parameters, 'ctx'>,
      BaseUIComponentProps<'div', State> {}
}

interface InnerCalendarYearsCellProps
  extends useCalendarYearsCell.Parameters,
    BaseUIComponentProps<'div', CalendarYearsCell.State> {}

export { CalendarYearsCell };
