import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { MonthCalendarClasses } from './monthCalendarClasses';
import { BaseDateValidationProps, MonthValidationProps } from '../internals/models/validation';
import { PickerOwnerState, PickerValidDate, TimezoneProps } from '../models';

export interface PickerMonthOwnerState extends PickerOwnerState {
  isMonthSelected: boolean;
  isMonthDisabled: boolean;
}

export interface MonthCalendarSlots {
  /**
   * Button displayed to render a single month in the `month` view.
   * @default MonthCalendarButton
   */
  monthButton?: React.ElementType;
}

export interface MonthCalendarSlotProps {
  monthButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    PickerMonthOwnerState
  >;
}

export interface ExportedMonthCalendarProps {
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow?: 3 | 4;
}
export interface MonthCalendarProps
  extends ExportedMonthCalendarProps,
    MonthValidationProps,
    BaseDateValidationProps,
    TimezoneProps {
  autoFocus?: boolean;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MonthCalendarClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MonthCalendarSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MonthCalendarSlotProps;
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
   * @default The closest valid month using the validation props, except callbacks such as `shouldDisableMonth`.
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
  onMonthFocus?: (month: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (hasFocus: boolean) => void;
  gridLabelId?: string;
}
