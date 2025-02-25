'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarSetVisibleMonth } from '@mui/x-date-pickers/internals/base/utils/base-calendar/set-visible-month/useBaseCalendarSetVisibleMonth';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarSetVisibleMonthWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/set-visible-month/useBaseCalendarSetVisibleMonthWrapper';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';

const InnerRangeCalendarSetVisibleMonth = React.forwardRef(
  function InnerRangeCalendarSetVisibleMonth(
    props: InnerRangeCalendarSetVisibleMonthProps,
    forwardedRef: React.ForwardedRef<HTMLButtonElement>,
  ) {
    const { className, render, ctx, target, ...otherProps } = props;
    const { getSetVisibleMonthProps } = useBaseCalendarSetVisibleMonth({ ctx, target });

    const state: RangeCalendarSetVisibleMonth.State = React.useMemo(
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
  },
);

const MemoizedInnerRangeCalendarSetVisibleMonth = React.memo(InnerRangeCalendarSetVisibleMonth);

const RangeCalendarSetVisibleMonth = React.forwardRef(function RangeCalendarSetVisibleMonth(
  props: RangeCalendarSetVisibleMonth.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarSetVisibleMonthWrapper({
    forwardedRef,
    target: props.target,
  });
  return <MemoizedInnerRangeCalendarSetVisibleMonth ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarSetVisibleMonth {
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

interface InnerRangeCalendarSetVisibleMonthProps
  extends useBaseCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'button', RangeCalendarSetVisibleMonth.State> {}

export { RangeCalendarSetVisibleMonth };
