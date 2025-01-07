'use client';
import * as React from 'react';
import { useBaseCalendarDaysWeekRow } from '../../utils/base-calendar/days-week-row/useBaseCalendarDaysWeekRow';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { useBaseCalendarDaysWeekRowWrapper } from '../../utils/base-calendar/days-week-row/useBaseCalendarDaysWeekRowWrapper';

const InnerCalendarDaysWeekRow = React.forwardRef(function InnerCalendarDaysWeekRow(
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
