'use client';
import * as React from 'react';

import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarSetVisibleMonth } from '../../utils/base-calendar/set-visible-month/useBaseCalendarSetVisibleMonth';
import { useBaseCalendarSetVisibleMonthWrapper } from '../../utils/base-calendar/set-visible-month/useBaseCalendarSetVisibleMonthWrapper';
import { BaseUIComponentProps } from '../../base-utils/types';

const InnerCalendarSetVisibleMonth = React.forwardRef(function InnerCalendarSetVisibleMonth(
  props: InnerCalendarSetVisibleMonthProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...otherProps } = props;
  const { getSetVisibleMonthProps } = useBaseCalendarSetVisibleMonth({ ctx, target });

  const state: CalendarSetVisibleMonth.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getSetVisibleMonthProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarSetVisibleMonth = React.memo(InnerCalendarSetVisibleMonth);

const CalendarSetVisibleMonth = React.forwardRef(function CalendarSetVisibleMonth(
  props: CalendarSetVisibleMonth.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ctx } = useBaseCalendarSetVisibleMonthWrapper({ target: props.target });
  return <MemoizedInnerCalendarSetVisibleMonth {...props} ref={forwardedRef} ctx={ctx} />;
});

export namespace CalendarSetVisibleMonth {
  export interface State {}

  export interface Props
    extends Omit<useBaseCalendarSetVisibleMonth.Parameters, 'ctx'>,
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleMonthProps
  extends useBaseCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleMonth.State> {}

export { CalendarSetVisibleMonth };
