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
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const targetDate = React.useMemo(() => {
    if (props.target === 'previous') {
      return utils.startOfYear(utils.addYears(rootContext.visibleDate, -1));
    }

    if (props.target === 'next') {
      return utils.startOfYear(utils.addYears(rootContext.visibleDate, 1));
    }

    return utils.setYear(rootContext.visibleDate, utils.getYear(props.target));
  }, [rootContext.visibleDate, utils, props.target]);

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    const isMovingBefore = utils.isBefore(targetDate, rootContext.visibleDate);

    // All the years before the visible ones are fully disabled, we skip the navigation.
    if (isMovingBefore) {
      return utils.isAfter(getFirstEnabledYear(utils, rootContext.validationProps), targetDate);
    }

    // All the years after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(getLastEnabledYear(utils, rootContext.validationProps), targetDate);
  }, [
    rootContext.disabled,
    rootContext.validationProps,
    rootContext.visibleDate,
    targetDate,
    utils,
  ]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    rootContext.setVisibleDate(targetDate, false);
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
