import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { SxProps, Theme } from '@mui/material/styles';
import {
  ExportedPickersArrowSwitcherProps,
  PickersArrowSwitcherSlots,
  PickersArrowSwitcherSlotProps,
} from '../internals/components/PickersArrowSwitcher';
import { MonthValidationOptions } from '../internals/hooks/date-helpers-hooks';
import { PickerValidDate, DateView } from '../models';
import { SlideDirection } from '../DateCalendar/PickersSlideTransition';
import { PickersCalendarHeaderClasses } from './pickersCalendarHeaderClasses';

export interface PickersCalendarHeaderSlots extends PickersArrowSwitcherSlots {
  /**
   * Button displayed to switch between different calendar views.
   * @default IconButton
   */
  switchViewButton?: React.ElementType;
  /**
   * Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`.
   * @default ArrowDropDown
   */
  switchViewIcon?: React.ElementType;
}

// We keep the interface to allow module augmentation
export interface PickersCalendarHeaderSlotPropsOverrides {}

export type PickersCalendarHeaderOwnerState = PickersCalendarHeaderProps;

export interface PickersCalendarHeaderSlotProps extends PickersArrowSwitcherSlotProps {
  switchViewButton?: SlotComponentProps<
    typeof IconButton,
    PickersCalendarHeaderSlotPropsOverrides,
    PickersCalendarHeaderOwnerState
  >;

  switchViewIcon?: SlotComponentProps<
    typeof SvgIcon,
    PickersCalendarHeaderSlotPropsOverrides,
    PickersCalendarHeaderOwnerState
  >;
}

export interface PickersCalendarHeaderProps
  extends ExportedPickersArrowSwitcherProps,
    MonthValidationOptions {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PickersCalendarHeaderSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersCalendarHeaderSlotProps;
  currentMonth: PickerValidDate;
  disabled?: boolean;
  views: readonly DateView[];
  onMonthChange: (date: PickerValidDate, slideDirection: SlideDirection) => void;
  view: DateView;
  reduceAnimations: boolean;
  onViewChange?: (view: DateView) => void;
  /**
   * Id of the calendar text element.
   * It is used to establish an `aria-labelledby` relationship with the calendar `grid` element.
   */
  labelId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersCalendarHeaderClasses>;
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export type ExportedPickersCalendarHeaderProps = Pick<
  PickersCalendarHeaderProps,
  'classes' | 'slots' | 'slotProps'
>;
