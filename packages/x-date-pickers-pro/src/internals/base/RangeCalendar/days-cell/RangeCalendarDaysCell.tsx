'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { RangeCalendarDaysCellDataAttributes } from './RangeCalendarDaysCellDataAttributes';
import { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import { useRangeCalendarDaysCellWrapper } from './useRangeCalendarDaysCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarDaysCell.State> = {
  selected(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.selected]: '' } : null;
  },
  selectionStart(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.selectionStart]: '' } : null;
  },
  selectionEnd(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.selectionEnd]: '' } : null;
  },
  insideSelection(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.insideSelection]: '' } : null;
  },
  previewed(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.previewed]: '' } : null;
  },
  previewStart(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.previewStart]: '' } : null;
  },
  previewEnd(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.previewEnd]: '' } : null;
  },
  insidePreview(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.insidePreview]: '' } : null;
  },
  disabled(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.disabled]: '' } : null;
  },
  invalid(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.invalid]: '' } : null;
  },
  current(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.current]: '' } : null;
  },
  outsideMonth(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerRangeCalendarDaysCell = React.forwardRef(function RangeCalendarDaysGrid(
  props: InnerRangeCalendarDaysCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDaysCellProps, isCurrent } = useRangeCalendarDaysCell({ value, ctx });

  const state: RangeCalendarDaysCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      selectionStart: ctx.isSelectionStart,
      selectionEnd: ctx.isSelectionEnd,
      insideSelection: ctx.isSelected && !ctx.isSelectionStart && !ctx.isSelectionEnd,
      previewed: ctx.isPreviewed,
      previewStart: ctx.isPreviewStart,
      previewEnd: ctx.isPreviewEnd,
      insidePreview: ctx.isPreviewed && !ctx.isPreviewStart && !ctx.isPreviewEnd,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      outsideMonth: ctx.isOutsideCurrentMonth,
      current: isCurrent,
    }),
    [
      ctx.isSelected,
      ctx.isSelectionStart,
      ctx.isSelectionEnd,
      ctx.isPreviewed,
      ctx.isPreviewStart,
      ctx.isPreviewEnd,
      ctx.isDisabled,
      ctx.isInvalid,
      ctx.isOutsideCurrentMonth,
      isCurrent,
    ],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarDaysCell = React.memo(InnerRangeCalendarDaysCell);

const RangeCalendarDaysCell = React.forwardRef(function RangeCalendarDaysCell(
  props: RangeCalendarDaysCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarDaysCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarDaysCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarDaysCell {
  export interface State {
    /**
     * Whether the day is within the selected range.
     */
    selected: boolean;
    /**
     * Whether the day is the first day of the selected range.
     */
    selectionStart: boolean;
    /**
     * Whether the day is the last day of the selected range.
     */
    selectionEnd: boolean;
    /**
     * Whether the day is within the selected range and is not its first or last day.
     */
    insideSelection: boolean;
    /**
     * Whether the day is within the preview range and is not its first or last day.
     */
    previewed: boolean;
    /**
     * Whether the day is the first day of the preview range.
     */
    previewStart: boolean;
    /**
     * Whether the day is the last day of the preview range.
     */
    previewEnd: boolean;
    /**
     * Whether the day is within the preview range and is not its first or last day.
     */
    insidePreview: boolean;
    /**
     * Whether the day is disabled.
     */
    disabled: boolean;
    /**
     * Whether the day is invalid.
     */
    invalid: boolean;
    /**
     * Whether the day contains the current date.
     */
    current: boolean;
    /**
     * Whether the day is outside the month rendered by the day grid wrapping it.
     */
    outsideMonth: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useRangeCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerRangeCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', RangeCalendarDaysCell.State>, 'value'>,
    useRangeCalendarDaysCell.Parameters {}

export { RangeCalendarDaysCell };
