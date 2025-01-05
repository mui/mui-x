'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarSetVisibleYear } from './useCalendarSetVisibleYear';
import { BaseUIComponentProps } from '../../utils/types';

const InnerCalendarSetVisibleYear = React.forwardRef(function InnerCalendarSetVisibleYear(
  props: InnerCalendarSetVisibleYearProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...otherProps } = props;
  const { getSetVisibleYearProps } = useCalendarSetVisibleYear({ ctx, target });

  const state: CalendarSetVisibleYear.State = React.useMemo(() => ({}), []);

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
  const calendarRootContext = useCalendarRootContext();
  const utils = useUtils();
  const now = useNow(calendarRootContext.timezone);

  const targetDate = React.useMemo(() => {
    if (props.target === 'previous') {
      return utils.startOfMonth(utils.addYears(calendarRootContext.visibleDate, -1));
    }

    return utils.startOfMonth(utils.addYears(calendarRootContext.visibleDate, 1));
  }, [calendarRootContext.visibleDate, utils, props.target]);

  const isDisabled = React.useMemo(() => {
    if (calendarRootContext.disabled) {
      return true;
    }

    if (props.target === 'previous') {
      const firstEnabledYear = utils.startOfYear(
        calendarRootContext.validationProps.disablePast &&
          utils.isAfter(now, calendarRootContext.validationProps.minDate)
          ? now
          : calendarRootContext.validationProps.minDate,
      );

      return utils.isAfter(firstEnabledYear, targetDate);
    }

    const lastEnabledYear = utils.startOfYear(
      calendarRootContext.validationProps.disableFuture &&
        utils.isBefore(now, calendarRootContext.validationProps.maxDate)
        ? now
        : calendarRootContext.validationProps.maxDate,
    );

    return utils.isBefore(lastEnabledYear, targetDate);
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

  const ctx = React.useMemo<useCalendarSetVisibleYear.Context>(
    () => ({
      setTarget,
      isDisabled,
    }),
    [setTarget, isDisabled],
  );

  return <MemoizedInnerCalendarSetVisibleYear {...props} ref={forwardedRef} ctx={ctx} />;
});

export namespace CalendarSetVisibleYear {
  export interface State {}

  export interface Props
    extends Omit<useCalendarSetVisibleYear.Parameters, 'ctx'>,
      BaseUIComponentProps<'button', State> {}
}

interface InnerCalendarSetVisibleYearProps
  extends useCalendarSetVisibleYear.Parameters,
    BaseUIComponentProps<'button', CalendarSetVisibleYear.State> {}

export { CalendarSetVisibleYear };
