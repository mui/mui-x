import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarSetVisibleYear } from './useBaseCalendarSetVisibleYear';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { getFirstEnabledYear, getLastEnabledYear } from '../utils/date';
import { useNullableBaseCalendarYearCollectionContext } from '../utils/BaseCalendarYearCollectionContext';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';

export function useBaseCalendarSetVisibleYearWrapper(
  parameters: useBaseCalendarSetVisibleYearWrapper.Parameters,
): useBaseCalendarSetVisibleYearWrapper.ReturnValue {
  const { forwardedRef, target } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const baseYearListOrGridContext = useNullableBaseCalendarYearCollectionContext();
  const utils = useUtils();
  const { ref: listItemRef } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const targetDate = React.useMemo(() => {
    if (target === 'previous') {
      return utils.addYears(baseRootVisibleDateContext.visibleDate, -1);
    }

    if (target === 'next') {
      return utils.addYears(baseRootVisibleDateContext.visibleDate, 1);
    }

    return utils.setYear(baseRootVisibleDateContext.visibleDate, utils.getYear(target));
  }, [baseRootVisibleDateContext.visibleDate, utils, target]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    const isMovingBefore = utils.isBefore(targetDate, baseRootVisibleDateContext.visibleDate);

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
    baseRootVisibleDateContext.visibleDate,
    targetDate,
    utils,
  ]);

  const tabbableYears = baseYearListOrGridContext?.tabbableYears;
  const isTabbable = React.useMemo(() => {
    // If the button is not inside a year list or grid, then it is always tabbable.
    if (tabbableYears == null) {
      return true;
    }

    return tabbableYears.some((year) => utils.isSameYear(year, targetDate));
  }, [tabbableYears, targetDate, utils]);

  const setTarget = useEventCallback(() => {
    if (isDisabled) {
      return;
    }
    baseRootContext.setVisibleDate(targetDate, false);
  });

  const direction = React.useMemo(
    () => (utils.isBefore(targetDate, baseRootVisibleDateContext.visibleDate) ? 'before' : 'after'),
    [targetDate, baseRootVisibleDateContext.visibleDate, utils],
  );

  const ctx = React.useMemo<useBaseCalendarSetVisibleYear.Context>(
    () => ({
      setTarget,
      isDisabled,
      isTabbable,
      direction,
    }),
    [setTarget, isDisabled, isTabbable, direction],
  );

  return { ref: mergedRef, ctx };
}

export namespace useBaseCalendarSetVisibleYearWrapper {
  export interface Parameters extends Pick<useBaseCalendarSetVisibleYear.Parameters, 'target'> {
    /**
     * The ref forwarded by the parent component.
     */
    forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  }

  export interface ReturnValue {
    /**
     * The ref to forward to the component.
     */
    ref: React.RefCallback<HTMLButtonElement> | null;
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarSetVisibleYear.Context;
  }
}
