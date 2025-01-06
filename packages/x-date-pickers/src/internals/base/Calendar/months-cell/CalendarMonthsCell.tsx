'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthsCell } from './useCalendarMonthsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarMonthsCellCollectionContext } from '../utils/months-cell-collection/CalendarMonthsCellCollectionContext';

const InnerCalendarMonthsCell = React.forwardRef(function InnerCalendarMonthsCell(
  props: InnerCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthsCellProps, isCurrent } = useCalendarMonthsCell({ value, format, ctx });

  const state: CalendarMonthsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarMonthsCell = React.memo(InnerCalendarMonthsCell);

const CalendarMonthsCell = React.forwardRef(function CalendarMonthsCell(
  props: CalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const rootContext = useCalendarRootContext();
  const monthsCellCollectionContext = useCalendarMonthsCellCollectionContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(rootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameMonth(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    const firstEnabledMonth = utils.startOfMonth(
      rootContext.validationProps.disablePast &&
        utils.isAfter(now, rootContext.validationProps.minDate)
        ? now
        : rootContext.validationProps.minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      rootContext.validationProps.disableFuture &&
        utils.isBefore(now, rootContext.validationProps.maxDate)
        ? now
        : rootContext.validationProps.maxDate,
    );

    const monthToValidate = utils.startOfMonth(props.value);

    if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
      return true;
    }

    if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
      return true;
    }

    if (!rootContext.validationProps.shouldDisableMonth) {
      return false;
    }

    return rootContext.validationProps.shouldDisableMonth(monthToValidate);
  }, [rootContext.disabled, rootContext.validationProps, props.value, now, utils]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(rootContext.value)
        ? isSelected
        : utils.isSameMonth(rootContext.referenceDate, props.value),
    [utils, rootContext.value, rootContext.referenceDate, isSelected, props.value],
  );

  const ctx = React.useMemo<useCalendarMonthsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isTabbable,
      selectMonth: monthsCellCollectionContext.selectMonth,
    }),
    [isSelected, isDisabled, isTabbable, monthsCellCollectionContext.selectMonth],
  );

  return <MemoizedInnerCalendarMonthsCell {...props} ref={mergedRef} ctx={ctx} />;
});

export namespace CalendarMonthsCell {
  export interface State {
    /**
     * Whether the month is selected.
     */
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarMonthsCellProps
  extends useCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarMonthsCell.State>, 'value'> {}

export { CalendarMonthsCell };
