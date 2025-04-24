'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { useCalendarSetVisibleMonth } from './useCalendarSetVisibleMonth';
import { useCalendarSetVisibleMonthWrapper } from './useCalendarSetVisibleMonthWrapper';
import { BaseUIComponentProps } from '../../base-utils/types';

const InnerCalendarSetVisibleMonth = React.forwardRef(function InnerCalendarSetVisibleMonth(
  componentProps: InnerCalendarSetVisibleMonthProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...elementProps } = componentProps;
  const { getSetVisibleMonthProps } = useCalendarSetVisibleMonth({ ctx, target });

  const state: CalendarSetVisibleMonth.State = React.useMemo(
    () => ({
      direction: ctx.direction,
    }),
    [ctx.direction],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [getSetVisibleMonthProps, elementProps],
  });

  return renderElement();
});

const MemoizedInnerCalendarSetVisibleMonth = React.memo(InnerCalendarSetVisibleMonth);

const CalendarSetVisibleMonth = React.forwardRef(function CalendarSetVisibleMonth(
  props: CalendarSetVisibleMonth.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useCalendarSetVisibleMonthWrapper({
    forwardedRef,
    target: props.target,
  });
  return <MemoizedInnerCalendarSetVisibleMonth ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarSetVisibleMonth {
  export interface State {
    /**
     * The direction of the target month relative to the current visible month.
     * - "before" if the target month is before the current visible month.
     * - "after" if the target month is after the current visible month.
     */
    direction: 'before' | 'after';
  }

  export interface Props
    extends Omit<useCalendarSetVisibleMonth.Parameters, 'ctx'>,
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleMonthProps
  extends useCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleMonth.State> {}

export { CalendarSetVisibleMonth };
