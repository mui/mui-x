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

  const state: CalendarSetVisibleMonth.State = React.useMemo(
    () => ({
      direction: ctx.direction,
    }),
    [ctx.direction],
  );

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
  const { ref, ctx } = useBaseCalendarSetVisibleMonthWrapper({
    forwardedRef,
    target: props.target,
  });
  return <MemoizedInnerCalendarSetVisibleMonth ref={ref} {...props} ctx={ctx} />;
});

namespace CalendarSetVisibleMonth {
  export interface State {
    /**
     * The direction of the target month relative to the current visible month.
     * - "before" if the target month is before the current visible month.
     * - "after" if the target month is after the current visible month.
     */
    direction: 'before' | 'after';
  }

  export interface Props
    extends Omit<useBaseCalendarSetVisibleMonth.Parameters, 'ctx'>,
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleMonthProps
  extends useBaseCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleMonth.State> {}

export { CalendarSetVisibleMonth };
