import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarSetVisibleYear } from './useBaseCalendarSetVisibleYear';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { getFirstEnabledYear, getLastEnabledYear } from '../utils/date';
import { useNullableBaseCalendarYearsGridOrListContext } from '../years-grid/BaseCalendarYearsGridOrListContext';

export function useBaseCalendarSetVisibleYearWrapper(
  parameters: useBaseCalendarSetVisibleYearWrapper.Parameters,
) {
  const { target } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseYearsListOrGridContext = useNullableBaseCalendarYearsGridOrListContext();
  const utils = useUtils();

  const targetDate = React.useMemo(() => {
    if (target === 'previous') {
      return utils.addYears(baseRootContext.visibleDate, -1);
    }

    if (target === 'next') {
      return utils.addYears(baseRootContext.visibleDate, 1);
    }

    return utils.setYear(baseRootContext.visibleDate, utils.getYear(target));
  }, [baseRootContext.visibleDate, utils, target]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    const isMovingBefore = utils.isBefore(targetDate, baseRootContext.visibleDate);

    // All the years before the visible ones are fully disabled, we skip the navigation.
    if (isMovingBefore) {
      return utils.isAfter(
        getFirstEnabledYear(utils, baseRootContext.dateValidationProps),
        targetDate,
      );
    }

    // All the years after the visible ones are fully disabled, we skip the navigation.
    return utils.isBefore(
      getLastEnabledYear(utils, baseRootContext.dateValidationProps),
      targetDate,
    );
  }, [
    baseRootContext.disabled,
    baseRootContext.dateValidationProps,
    baseRootContext.visibleDate,
    targetDate,
    utils,
  ]);

  const tabbableYears = baseYearsListOrGridContext?.tabbableYears;
  const isTabbable = React.useMemo(() => {
    if (tabbableYears == null) {
      return false;
    }

    return tabbableYears.some((year) => utils.isSameYear(year, targetDate));
  }, [tabbableYears, targetDate, utils]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    baseRootContext.setVisibleDate(targetDate, false);
  });

  const ctx = React.useMemo<useBaseCalendarSetVisibleYear.Context>(
    () => ({
      setTarget,
      isDisabled,
      isTabbable,
    }),
    [setTarget, isDisabled, isTabbable],
  );

  return { ctx };
}

export namespace useBaseCalendarSetVisibleYearWrapper {
  export interface Parameters extends Pick<useBaseCalendarSetVisibleYear.Parameters, 'target'> {}

  export interface ReturnValue {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarSetVisibleYear.Context;
  }
}
