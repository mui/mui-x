'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarSetVisibleMonth } from './useCalendarSetVisibleMonth';
import { BaseUIComponentProps } from '../../utils/types';

const InnerCalendarSetVisibleMonth = React.forwardRef(function InnerCalendarSetVisibleMonth(
  props: InnerCalendarSetVisibleMonthProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...otherProps } = props;
  const { getSetVisibleMonthProps } = useCalendarSetVisibleMonth({ ctx, target });

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
  const calendarRootContext = useCalendarRootContext();
  const utils = useUtils();
  const now = useNow(calendarRootContext.timezone);

  const targetDate = React.useMemo(() => {
    if (props.target === 'previous') {
      return utils.startOfMonth(
        utils.addMonths(calendarRootContext.visibleDate, -calendarRootContext.monthPageSize),
      );
    }

    return utils.startOfMonth(
      utils.addMonths(calendarRootContext.visibleDate, calendarRootContext.monthPageSize),
    );
  }, [calendarRootContext.visibleDate, calendarRootContext.monthPageSize, utils, props.target]);

  const isDisabled = React.useMemo(() => {
    if (calendarRootContext.disabled) {
      return true;
    }

    if (props.target === 'previous') {
      const firstEnabledMonth = utils.startOfMonth(
        calendarRootContext.validationProps.disablePast &&
          utils.isAfter(now, calendarRootContext.validationProps.minDate)
          ? now
          : calendarRootContext.validationProps.minDate,
      );

      return utils.isAfter(firstEnabledMonth, targetDate);
    }

    const lastEnabledMonth = utils.startOfMonth(
      calendarRootContext.validationProps.disableFuture &&
        utils.isBefore(now, calendarRootContext.validationProps.maxDate)
        ? now
        : calendarRootContext.validationProps.maxDate,
    );

    return utils.isBefore(lastEnabledMonth, targetDate);
  }, [
    calendarRootContext.disabled,
    calendarRootContext.validationProps,
    props.target,
    targetDate,
    utils,
    now,
  ]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    calendarRootContext.setVisibleDate(targetDate);
  });

  const ctx = React.useMemo<useCalendarSetVisibleMonth.Context>(
    () => ({
      setTarget,
      isDisabled,
    }),
    [setTarget, isDisabled],
  );

  return <MemoizedInnerCalendarSetVisibleMonth {...props} ref={forwardedRef} ctx={ctx} />;
});

export namespace CalendarSetVisibleMonth {
  export interface State {}

  export interface Props
    extends Omit<useCalendarSetVisibleMonth.Parameters, 'ctx'>,
      BaseUIComponentProps<'div', State> {}
}

interface InnerCalendarSetVisibleMonthProps
  extends useCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'div', CalendarSetVisibleMonth.State> {}

export { CalendarSetVisibleMonth };
