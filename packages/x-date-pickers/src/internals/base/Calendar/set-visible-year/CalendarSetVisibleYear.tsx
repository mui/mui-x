'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useCalendarSetVisibleYear } from './useCalendarSetVisibleYear';
import { BaseUIComponentProps } from '../../base-utils/types';
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
  const baseRootContext = useBaseCalendarRootContext();
  const utils = useUtils();

  const targetDate = React.useMemo(() => {
    if (props.target === 'previous') {
      return utils.addYears(baseRootContext.visibleDate, -1);
    }

    if (props.target === 'next') {
      return utils.addYears(baseRootContext.visibleDate, 1);
    }

    return utils.setYear(baseRootContext.visibleDate, utils.getYear(props.target));
  }, [baseRootContext.visibleDate, utils, props.target]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    const isMovingBefore = utils.isBefore(targetDate, baseRootContext.visibleDate);

    // All the years before the visible ones are fully disabled, we skip the navigation.
    if (isMovingBefore) {
      return utils.isAfter(getFirstEnabledYear(utils, baseRootContext.validationProps), targetDate);
    }

    // All the years after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(getLastEnabledYear(utils, baseRootContext.validationProps), targetDate);
  }, [
    baseRootContext.disabled,
    baseRootContext.validationProps,
    baseRootContext.visibleDate,
    targetDate,
    utils,
  ]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    baseRootContext.setVisibleDate(targetDate, false);
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
