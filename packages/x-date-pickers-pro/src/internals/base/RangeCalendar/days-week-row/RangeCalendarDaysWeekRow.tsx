'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysWeekRow } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-week-row/useBaseCalendarDaysWeekRow';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysWeekRowWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-week-row/useBaseCalendarDaysWeekRowWrapper';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';

const InnerCalendarDaysWeekRow = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysWeekRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDaysWeekRowProps, dayCellRefs } = useBaseCalendarDaysWeekRow({
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
  const { ref, ctx } = useBaseCalendarDaysWeekRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerCalendarDaysWeekRow {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarDaysWeekRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useBaseCalendarDaysWeekRow.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysWeekRowProps
  extends Omit<BaseUIComponentProps<'div', CalendarDaysWeekRow.State>, 'children'>,
    useBaseCalendarDaysWeekRow.Parameters {}

export { CalendarDaysWeekRow };
