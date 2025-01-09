import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../../hooks/useUtils';
import { getFirstEnabledMonth, getLastEnabledMonth } from '../utils/date';
import { useBaseCalendarSetVisibleMonth } from './useBaseCalendarSetVisibleMonth';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';

export function useBaseCalendarSetVisibleMonthWrapper(
  parameters: useBaseCalendarSetVisibleMonthWrapper.Parameters,
) {
  const { target } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const utils = useUtils();

  const targetDate = React.useMemo(() => {
    if (target === 'previous') {
      return utils.addMonths(baseRootContext.visibleDate, -baseRootContext.monthPageSize);
    }

    if (target === 'next') {
      return utils.addMonths(baseRootContext.visibleDate, baseRootContext.monthPageSize);
    }

    return utils.setMonth(baseRootContext.visibleDate, utils.getMonth(target));
  }, [baseRootContext.visibleDate, baseRootContext.monthPageSize, utils, target]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    // TODO: Check if the logic below works correctly when multiple months are rendered at once.
    const isMovingBefore = utils.isBefore(targetDate, baseRootContext.visibleDate);

    // All the months before the visible ones are fully disabled, we skip the navigation.
    if (isMovingBefore) {
      return utils.isAfter(
        getFirstEnabledMonth(utils, baseRootContext.dateValidationProps),
        targetDate,
      );
    }

    // All the months after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(
      getLastEnabledMonth(utils, baseRootContext.dateValidationProps),
      targetDate,
    );
  }, [
    baseRootContext.disabled,
    baseRootContext.dateValidationProps,
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

  const ctx = React.useMemo<useBaseCalendarSetVisibleMonth.Context>(
    () => ({
      setTarget,
      isDisabled,
    }),
    [setTarget, isDisabled],
  );

  return { ctx };
}

export namespace useBaseCalendarSetVisibleMonthWrapper {
  export interface Parameters extends Pick<useBaseCalendarSetVisibleMonth.Parameters, 'target'> {}

  export interface ReturnValue {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarSetVisibleMonth.Context;
  }
}
