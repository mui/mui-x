'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarSetVisibleYear } from '@mui/x-date-pickers/internals/base/utils/base-calendar/set-visible-year/useBaseCalendarSetVisibleYear';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarSetVisibleYearWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/set-visible-year/useBaseCalendarSetVisibleYearWrapper';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';

const InnerRangeCalendarSetVisibleYear = React.forwardRef(function InnerRangeCalendarSetVisibleYear(
  props: InnerRangeCalendarSetVisibleYearProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...otherProps } = props;
  const { getSetVisibleYearProps } = useBaseCalendarSetVisibleYear({ ctx, target });

  const state: RangeCalendarSetVisibleYear.State = React.useMemo(
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

const MemoizedInnerRangeCalendarSetVisibleYear = React.memo(InnerRangeCalendarSetVisibleYear);

const RangeCalendarSetVisibleYear = React.forwardRef(function RangeCalendarSetVisibleYear(
  props: RangeCalendarSetVisibleYear.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ctx, ref } = useBaseCalendarSetVisibleYearWrapper({ target: props.target, forwardedRef });

  return <MemoizedInnerRangeCalendarSetVisibleYear ref={ref} {...props} ctx={ctx} />;
});

namespace RangeCalendarSetVisibleYear {
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

interface InnerRangeCalendarSetVisibleYearProps
  extends useBaseCalendarSetVisibleYear.Parameters,
    BaseUIComponentProps<'button', RangeCalendarSetVisibleYear.State> {}

export { RangeCalendarSetVisibleYear };
