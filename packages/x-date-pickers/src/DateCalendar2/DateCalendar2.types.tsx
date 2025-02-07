import { IconButtonProps } from '@mui/material/IconButton';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { SxProps } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { Calendar } from '../internals/base/Calendar';
import { PickerOwnerState, PickerValidDate } from '../models/pickers';
import { DateView } from '../models/views';
import { DateCalendar2HeaderProps } from './DateCalendar2Header';
import { DateCalendar2Classes } from './DateCalendar2.classes';

export interface DateCalendar2Props extends Omit<Calendar.Root.Props, 'children'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateCalendar2Slots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateCalendar2SlotProps;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateCalendar2Classes>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps;
  views?: { [key in DateView]?: boolean };
  view?: DateView;
  onViewChange?: (view: DateView) => void;
  defaultView?: DateView;
  displayWeekNumber?: boolean;
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow?: 3 | 4;
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow?: 3 | 4;
  // TODO: Add reduceAnimations and loading props
}

export interface DateCalendar2Slots {
  /**
   * Button displayed to render a single day in the `day` view.
   * @default PickersDay
   */
  dayButton?: React.ElementType<ButtonBaseProps>;
  /**
   * Button displayed to render a single month in the `month` view.
   * @default MonthCalendarButton
   */
  monthButton?: React.ElementType;
  /**
   * Button displayed to render a single year in the `year` view.
   * @default YearCalendarButton
   */
  yearButton?: React.ElementType;
  /**
   * Custom component for calendar header.
   * @default DateCalendar2Header
   */
  calendarHeader?: React.ElementType<DateCalendar2HeaderProps>;
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
  /**
   * Button allowing to switch to the left view.
   * @default IconButton
   */
  previousIconButton?: React.ElementType;
  /**
   * Button allowing to switch to the right view.
   * @default IconButton
   */
  nextIconButton?: React.ElementType;
  /**
   * Icon displayed in the left view switch button.
   * @default ArrowLeft
   */
  leftArrowIcon?: React.ElementType;
  /**
   * Icon displayed in the right view switch button.
   * @default ArrowRight
   */
  rightArrowIcon?: React.ElementType;
}

export interface DateCalendar2SlotProps {
  day?: SlotComponentPropsFromProps<ButtonBaseProps, {}, DateCalendar2PickerDayOwnerState>;
  monthButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    DateCalendar2MonthButtonOwnerState
  >;
  yearButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    DateCalendar2YearButtonOwnerState
  >;
  calendarHeader?: SlotComponentPropsFromProps<DateCalendar2HeaderProps, {}, PickerOwnerState>;
  switchViewButton?: SlotComponentPropsFromProps<IconButtonProps, {}, PickerOwnerState>;
  switchViewIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
  previousIconButton?: SlotComponentPropsFromProps<
    IconButtonProps,
    {},
    DateCalendar2HidableButtonOwnerState
  >;
  nextIconButton?: SlotComponentPropsFromProps<
    IconButtonProps,
    {},
    DateCalendar2HidableButtonOwnerState
  >;
  leftArrowIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
  rightArrowIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
}

interface DateCalendar2HidableButtonOwnerState extends PickerOwnerState {
  /**
   * If `true`, this button should be hidden.
   */
  isButtonHidden: boolean;
}

export interface DateCalendar2PickerDayOwnerState extends PickerOwnerState {
  isDaySelected: boolean;
  isDayDisabled: boolean;
  day: PickerValidDate;
}

export interface DateCalendar2MonthButtonOwnerState extends PickerOwnerState {
  isMonthSelected: boolean;
  isMonthDisabled: boolean;
}

export interface DateCalendar2YearButtonOwnerState extends PickerOwnerState {
  isMonthSelected: boolean;
  isMonthDisabled: boolean;
}
