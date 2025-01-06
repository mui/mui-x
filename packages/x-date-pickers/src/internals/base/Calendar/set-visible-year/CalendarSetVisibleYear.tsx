'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarSetVisibleYear } from './useCalendarSetVisibleYear';
import { BaseUIComponentProps } from '../../utils/types';
import { getFirstEnabledYear, getLastEnabledYear } from '../utils/date';

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

    // TODO: Check if the logic below works correctly when multiple months are rendered at once.
    // All the months before the visible ones are fully disabled, we skip the navigation.
    if (props.target === 'previous') {
      return utils.isAfter(
        getFirstEnabledYear(utils, calendarRootContext.validationProps),
        targetDate,
      );
    }

    // All the months after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(
      getLastEnabledYear(utils, calendarRootContext.validationProps),
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
