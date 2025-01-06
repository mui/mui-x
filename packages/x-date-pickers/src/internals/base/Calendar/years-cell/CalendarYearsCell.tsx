'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarYearsCell } from './useCalendarYearsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarYearsCellCollectionContext } from '../utils/years-cell-collection/CalendarYearsCellCollectionContext';

const InnerCalendarYearsCell = React.forwardRef(function InnerCalendarYearsCell(
  props: InnerCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps, isCurrent } = useCalendarYearsCell({ value, format, ctx });

  const state: CalendarYearsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getYearCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarYearsCell = React.memo(InnerCalendarYearsCell);

const CalendarYearsCell = React.forwardRef(function CalendarsYearCell(
  props: CalendarYearsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const rootContext = useCalendarRootContext();
  const yearsListContext = useCalendarYearsCellCollectionContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(rootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameYear(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    if (rootContext.validationProps.disablePast && utils.isBeforeYear(props.value, now)) {
      return true;
    }
    if (rootContext.validationProps.disableFuture && utils.isAfterYear(props.value, now)) {
      return true;
    }
    if (
      rootContext.validationProps.minDate &&
      utils.isBeforeYear(props.value, rootContext.validationProps.minDate)
    ) {
      return true;
    }
    if (
      rootContext.validationProps.maxDate &&
      utils.isAfterYear(props.value, rootContext.validationProps.maxDate)
    ) {
      return true;
    }

    if (!rootContext.validationProps.shouldDisableYear) {
      return false;
    }

    const yearToValidate = utils.startOfYear(props.value);
    return rootContext.validationProps.shouldDisableYear(yearToValidate);
  }, [rootContext.disabled, rootContext.validationProps, props.value, now, utils]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(rootContext.value)
        ? isSelected
        : utils.isSameYear(rootContext.referenceDate, props.value),
    [utils, rootContext.value, rootContext.referenceDate, isSelected, props.value],
  );

  const ctx = React.useMemo<useCalendarYearsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isTabbable,
      selectYear: yearsListContext.selectYear,
    }),
    [isSelected, isDisabled, isTabbable, yearsListContext.selectYear],
  );

  return <MemoizedInnerCalendarYearsCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarYearsCell {
  export interface State {
    /**
     * Whether the year is selected.
     */
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarYearsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarYearsCellProps
  extends useCalendarYearsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarYearsCell.State>, 'value'> {}

export { CalendarYearsCell };
