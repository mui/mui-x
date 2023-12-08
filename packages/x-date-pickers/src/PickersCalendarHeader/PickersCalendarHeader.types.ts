import { SlotComponentProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { SxProps, Theme } from '@mui/material/styles';
import {
  ExportedPickersArrowSwitcherProps,
  PickersArrowSwitcherSlots,
  PickersArrowSwitcherSlotProps,
} from '../internals/components/PickersArrowSwitcher';
import { MonthValidationOptions } from '../internals/hooks/date-helpers-hooks';
import { DateView } from '../models/views';
import { SlideDirection } from '../DateCalendar/PickersSlideTransition';
import { PickersCalendarHeaderClasses } from './pickersCalendarHeaderClasses';

export interface PickersCalendarHeaderSlots extends PickersArrowSwitcherSlots {
  /**
   * Button displayed to switch between different calendar views.
   * @default IconButton
   */
  switchViewButton?: React.ElementType;
  /**
   * Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is 'year'.
   * @default ArrowDropDown
   */
  switchViewIcon?: React.ElementType;
}

// We keep the interface to allow module augmentation
export interface PickersCalendarHeaderSlotPropsOverrides {}

export type PickersCalendarHeaderOwnerState<TDate> = PickersCalendarHeaderProps<TDate>;

export interface PickersCalendarHeaderSlotProps<TDate> extends PickersArrowSwitcherSlotProps {
  switchViewButton?: SlotComponentProps<
    typeof IconButton,
    PickersCalendarHeaderSlotPropsOverrides,
    PickersCalendarHeaderOwnerState<TDate>
  >;

  switchViewIcon?: SlotComponentProps<
    typeof SvgIcon,
    PickersCalendarHeaderSlotPropsOverrides,
    undefined
  >;
}

export interface PickersCalendarHeaderProps<TDate>
  extends ExportedPickersArrowSwitcherProps,
    MonthValidationOptions<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PickersCalendarHeaderSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersCalendarHeaderSlotProps<TDate>;
  currentMonth: TDate;
  disabled?: boolean;
  views: readonly DateView[];
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  view: DateView;
  reduceAnimations: boolean;
  onViewChange?: (view: DateView) => void;
  labelId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersCalendarHeaderClasses>;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export type ExportedPickersCalendarHeaderProps<TDate> = Pick<
  PickersCalendarHeaderProps<TDate>,
  'classes' | 'slots' | 'slotProps'
>;
