'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { useRangeCalendarMonthsCell } from './useRangeCalendarMonthsCell';
import { useRangeCalendarMonthsCellWrapper } from './useRangeCalendarMonthsCellWrapper';
import { RangeCalendarMonthsCellDataAttributes } from './RangeCalendarMonthsCellDataAttributes';
// eslint-disable-next-line no-restricted-imports

// TODO: Avoid duplication between day, month, and year cells
const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarMonthsCell.State> = {
  selected(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.selected]: '' } : null;
  },
  selectionStart(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.selectionStart]: '' } : null;
  },
  selectionEnd(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.selectionEnd]: '' } : null;
  },
  insideSelection(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.insideSelection]: '' } : null;
  },
  previewed(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.previewed]: '' } : null;
  },
  previewStart(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.previewStart]: '' } : null;
  },
  previewEnd(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.previewEnd]: '' } : null;
  },
  insidePreview(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.insidePreview]: '' } : null;
  },
  disabled(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.disabled]: '' } : null;
  },
  invalid(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.invalid]: '' } : null;
  },
  current(value) {
    return value ? { [RangeCalendarMonthsCellDataAttributes.current]: '' } : null;
  },
};

const InnerRangeCalendarMonthsCell = React.forwardRef(function InnerRangeCalendarMonthsCell(
  props: InnerRangeCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthsCellProps, isCurrent } = useRangeCalendarMonthsCell({ value, format, ctx });

  const state: RangeCalendarMonthsCell.State = React.useMemo(
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
      isCurrent,
    ],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarMonthsCell = React.memo(InnerRangeCalendarMonthsCell);

const RangeCalendarMonthsCell = React.forwardRef(function RangeCalendarMonthsCell(
  props: RangeCalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarMonthsCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarMonthsCell {...props} ref={ref} ctx={ctx} />;
});

export namespace RangeCalendarMonthsCell {
  export interface State {
    /**
     * Whether the month is within the selected range.
     */
    selected: boolean;
    /**
     * Whether the month is the first month of the selected range.
     */
    selectionStart: boolean;
    /**
     * Whether the month is the last month of the selected range.
     */
    selectionEnd: boolean;
    /**
     * Whether the month is within the selected range and is not its first or last month.
     */
    insideSelection: boolean;
    /**
     * Whether the month is within the preview range and is not its first or last month.
     */
    previewed: boolean;
    /**
     * Whether the month is the first month of the preview range.
     */
    previewStart: boolean;
    /**
     * Whether the month is the last month of the preview range.
     */
    previewEnd: boolean;
    /**
     * Whether the month is within the preview range and is not its first or last month.
     */
    insidePreview: boolean;
    /**
     * Whether the month is disabled.
     */
    disabled: boolean;
    /**
     * Whether the month is invalid.
     */
    invalid: boolean;
    /**
     * Whether the month contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useRangeCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarMonthsCellProps
  extends useRangeCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarMonthsCell.State>, 'value'> {}

export { RangeCalendarMonthsCell };
