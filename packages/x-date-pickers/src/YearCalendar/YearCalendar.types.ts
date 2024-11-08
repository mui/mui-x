import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { YearCalendarClasses } from './yearCalendarClasses';
import { BaseDateValidationProps, YearValidationProps } from '../internals/models/validation';
import { PickerOwnerState, PickerValidDate, TimezoneProps } from '../models';

export interface PickerYearOwnerState extends PickerOwnerState {
  isYearSelected: boolean;
  isYearDisabled: boolean;
}

export interface YearCalendarSlots {
  /**
   * Button displayed to render a single year in the `year` view.
   * @default YearCalendarButton
   */
  yearButton?: React.ElementType;
}

export interface YearCalendarSlotProps {
  yearButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    PickerYearOwnerState
  >;
}

export interface ExportedYearCalendarProps {
  /**
   * Years are displayed in ascending (chronological) order by default.
   * If `desc`, years are displayed in descending order.
   * @default 'asc'
   */
  yearsOrder?: 'asc' | 'desc';
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow?: 3 | 4;
}

export interface YearCalendarProps
  extends ExportedYearCalendarProps,
    YearValidationProps,
    BaseDateValidationProps,
    TimezoneProps {
  autoFocus?: boolean;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<YearCalendarClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: YearCalendarSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: YearCalendarSlotProps;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /** If `true` picker is disabled */
  disabled?: boolean;
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: PickerValidDate | null;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: PickerValidDate | null;
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid year using the validation props, except callbacks such as `shouldDisableYear`.
   */
  referenceDate?: PickerValidDate;
  /**
   * Callback fired when the value changes.
   * @param {PickerValidDate} value The new value.
   */
  onChange?: (value: PickerValidDate) => void;
  /** If `true` picker is readonly */
  readOnly?: boolean;
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  onYearFocus?: (year: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (hasFocus: boolean) => void;
  gridLabelId?: string;
}
