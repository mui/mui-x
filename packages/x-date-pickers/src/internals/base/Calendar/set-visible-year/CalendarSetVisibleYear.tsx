'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarSetVisibleYear } from '../../utils/base-calendar/set-visible-year/useBaseCalendarSetVisibleYear';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useBaseCalendarSetVisibleYearWrapper } from '../../utils/base-calendar/set-visible-year/useBaseCalendarSetVisibleYearWrapper';

const InnerCalendarSetVisibleYear = React.forwardRef(function InnerCalendarSetVisibleYear(
  props: InnerCalendarSetVisibleYearProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...otherProps } = props;
  const { getSetVisibleYearProps } = useBaseCalendarSetVisibleYear({ ctx, target });

  const state: CalendarSetVisibleYear.State = React.useMemo(
    () => ({
      direction: ctx.direction,
    }),
    [ctx.direction],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getSetVisibleYearProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarSetVisibleYear = React.memo(InnerCalendarSetVisibleYear);

const CalendarSetVisibleYear = React.forwardRef(function CalendarSetVisibleYear(
  props: CalendarSetVisibleYear.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ctx, ref } = useBaseCalendarSetVisibleYearWrapper({ forwardedRef, target: props.target });

  return <MemoizedInnerCalendarSetVisibleYear ref={ref} {...props} ctx={ctx} />;
});

namespace CalendarSetVisibleYear {
  export interface State {
    /**
     * The direction of the target year relative to the current visible year.
     * - "before" if the target year is before the current visible year.
     * - "after" if the target year is after the current visible year.
     */
    direction: 'before' | 'after';
  }

  export interface Props
    extends Omit<useBaseCalendarSetVisibleYear.Parameters, 'ctx'>,
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleYearProps
  extends useBaseCalendarSetVisibleYear.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleYear.State> {}

export { CalendarSetVisibleYear };
