import type * as React from 'react';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import type { MonthCalendarClasses } from './monthCalendarClasses';
import type { BaseDateValidationProps, MonthValidationProps } from '../internals/models/validation';
import type { PickerOwnerState, PickerValidDate, TimezoneProps } from '../models';
import type { FormProps } from '../internals/models/formProps';

export interface MonthButtonOwnerState extends PickerOwnerState {
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
    MonthButtonOwnerState
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
  extends
    ExportedMonthCalendarProps,
    MonthValidationProps,
    BaseDateValidationProps,
    TimezoneProps,
    FormProps {
  /**
   * If `true`, the component is focused when it mounts.
   */
  autoFocus?: boolean;
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  /**
   * The month currently displayed in the calendar.
   * The months shown belong to its year.
   */
  currentMonth?: PickerValidDate;
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
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  /**
   * Callback fired when a month receives focus.
   * @param {number} month The focused month.
   */
  onMonthFocus?: (month: number) => void;
  /**
   * If `true`, the component has keyboard focus.
   * Use with `onFocusedViewChange` to control the focus.
   */
  hasFocus?: boolean;
  /**
   * Callback fired when the component gains or loses keyboard focus.
   * @param {boolean} hasFocus `true` if the component has focus.
   */
  onFocusedViewChange?: (hasFocus: boolean) => void;
  /**
   * The id of the element that labels the month grid.
   * It is used as the `aria-labelledby` of the grid.
   */
  gridLabelId?: string;
}
