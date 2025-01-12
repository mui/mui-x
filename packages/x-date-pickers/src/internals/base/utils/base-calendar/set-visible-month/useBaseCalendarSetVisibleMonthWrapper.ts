import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../../hooks/useUtils';
import { getFirstEnabledMonth, getLastEnabledMonth } from '../utils/date';
import { useBaseCalendarSetVisibleMonth } from './useBaseCalendarSetVisibleMonth';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { useNullableBaseCalendarMonthsGridOrListContext } from '../months-grid/BaseCalendarMonthsGridOrListContext';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';

export function useBaseCalendarSetVisibleMonthWrapper(
  parameters: useBaseCalendarSetVisibleMonthWrapper.Parameters,
): useBaseCalendarSetVisibleMonthWrapper.ReturnValue {
  const { forwardedRef, target } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseMonthsListOrGridContext = useNullableBaseCalendarMonthsGridOrListContext();
  const utils = useUtils();
  const { ref: listItemRef } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

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

  const tabbableMonths = baseMonthsListOrGridContext?.tabbableMonths;
  const isTabbable = React.useMemo(() => {
    // If the button is not inside a month list or grid, then it is always tabbable.
    if (tabbableMonths == null) {
      return true;
    }

    return tabbableMonths.some((month) => utils.isSameMonth(month, targetDate));
  }, [tabbableMonths, targetDate, utils]);

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
      isTabbable,
    }),
    [setTarget, isDisabled, isTabbable],
  );

  return { ref: mergedRef, ctx };
}

export namespace useBaseCalendarSetVisibleMonthWrapper {
  export interface Parameters extends Pick<useBaseCalendarSetVisibleMonth.Parameters, 'target'> {
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
    ctx: useBaseCalendarSetVisibleMonth.Context;
  }
}
