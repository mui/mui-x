'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarSetVisibleMonth } from './useCalendarSetVisibleMonth';
import { BaseUIComponentProps } from '../../utils/types';
import { getFirstEnabledMonth, getLastEnabledMonth } from '../utils/date';

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

    // All the months before the visible ones are fully disabled, we skip the navigation.
    if (props.target === 'previous') {
      return utils.isAfter(
        getFirstEnabledMonth(utils, calendarRootContext.validationProps),
        targetDate,
      );
    }

    // All the months after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(
      getLastEnabledMonth(utils, calendarRootContext.validationProps),
      targetDate,
    );
  }, [
    calendarRootContext.disabled,
    calendarRootContext.validationProps,
    props.target,
    targetDate,
    utils,
  ]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    calendarRootContext.setVisibleDate(targetDate, false);
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
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleMonthProps
  extends useCalendarSetVisibleMonth.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleMonth.State> {}

export { CalendarSetVisibleMonth };
