'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useUtils } from '../../../hooks/useUtils';
import { getFirstEnabledMonth, getLastEnabledMonth } from '../utils/date';
import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useNullableBaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';
import { useCompositeListItem } from '../../base-utils/composite/list/useCompositeListItem';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';
import { PickerValidDate } from '../../../../models';

const InnerCalendarSetVisibleMonth = React.forwardRef(function InnerCalendarSetVisibleMonth(
  componentProps: InnerCalendarSetVisibleMonthProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ctx, target, ...elementProps } = componentProps;

  const props = React.useMemo(
    () => ({
      type: 'button' as const,
      disabled: ctx.isDisabled,
      onClick: ctx.setTarget,
      tabIndex: ctx.isTabbable ? 0 : -1,
    }),
    [ctx.isDisabled, ctx.isTabbable, ctx.setTarget],
  );

  const state: CalendarSetVisibleMonth.State = React.useMemo(
    () => ({
      direction: ctx.direction,
    }),
    [ctx.direction],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, elementProps],
  });

  return renderElement();
});

const MemoizedInnerCalendarSetVisibleMonth = React.memo(InnerCalendarSetVisibleMonth);

const CalendarSetVisibleMonth = React.forwardRef(function CalendarSetVisibleMonth(
  props: CalendarSetVisibleMonth.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const baseRootContext = useBaseCalendarRootContext();
  const baseMonthListOrGridContext = useNullableBaseCalendarMonthCollectionContext();
  const utils = useUtils();
  const { ref: listItemRef } = useCompositeListItem();
  const ref = useForkRef(forwardedRef, listItemRef);

  const targetDate = React.useMemo(() => {
    if (props.target === 'previous') {
      return utils.addMonths(
        baseRootVisibleDateContext.visibleDate,
        -baseRootContext.monthPageSize,
      );
    }

    if (props.target === 'next') {
      return utils.addMonths(baseRootVisibleDateContext.visibleDate, baseRootContext.monthPageSize);
    }

    return utils.setYear(
      utils.setMonth(baseRootVisibleDateContext.visibleDate, utils.getMonth(props.target)),
      utils.getYear(props.target),
    );
  }, [baseRootVisibleDateContext.visibleDate, baseRootContext.monthPageSize, utils, props.target]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    // TODO: Check if the logic below works correctly when multiple months are rendered at once.
    const isMovingBefore = utils.isBefore(targetDate, baseRootVisibleDateContext.visibleDate);

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
    baseRootVisibleDateContext.visibleDate,
    targetDate,
    utils,
  ]);

  const canCellBeTabbed = baseMonthListOrGridContext?.canCellBeTabbed;
  const isTabbable = React.useMemo(() => {
    // If the button is not inside a month list or grid, then it is always tabbable.
    if (canCellBeTabbed == null) {
      return true;
    }

    return canCellBeTabbed(targetDate);
  }, [canCellBeTabbed, targetDate]);

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

  const ctx = React.useMemo<InnerCalendarSetVisibleMonthContext>(
    () => ({
      setTarget,
      isDisabled,
      isTabbable,
      direction,
    }),
    [setTarget, isDisabled, isTabbable, direction],
  );

  return <MemoizedInnerCalendarSetVisibleMonth ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarSetVisibleMonth {
  export interface State {
    /**
     * The direction of the target month relative to the current visible month.
     * - "before" if the target month is before the current visible month.
     * - "after" if the target month is after the current visible month.
     */
    direction: 'before' | 'after';
  }

  export interface Props extends BaseUIComponentProps<'button', State> {
    /**
     * The month to navigate to.
     */
    target: 'previous' | 'next' | PickerValidDate;
  }
}

interface InnerCalendarSetVisibleMonthProps extends CalendarSetVisibleMonth.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerCalendarSetVisibleMonthContext;
}

interface InnerCalendarSetVisibleMonthContext {
  setTarget: () => void;
  isDisabled: boolean;
  isTabbable: boolean;
  direction: 'before' | 'after';
}

export { CalendarSetVisibleMonth };
