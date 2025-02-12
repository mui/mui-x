import { IconButtonProps } from '@mui/material/IconButton';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { SxProps } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { Calendar } from '../internals/base/Calendar';
import { PickerOwnerState } from '../models/pickers';
import { DateView } from '../models/views';
import type { DateCalendar2HeaderProps } from './DateCalendar2Header';
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
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber?: boolean;
  /**
   * Years are displayed in ascending (chronological) order by default.
   * If `desc`, years are displayed in descending order.
   * @default 'asc'
   */
  yearsOrder?: 'asc' | 'desc';
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
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  // BREAKING CHANGE: in Date Calendar, loading was only used for the day view.
  /**
   * If `true`, calls `renderLoading` instead of rendering the view.
   * Can be used to preload information and show it in the cells.
   * @default false
   */
  loading?: boolean;
  // renderLoading (convert to a slot)
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
   * Button allowing to switch to navigate to the previous or the next page of the current view.
   * @default IconButton
   */
  navigationButton?: React.ElementType;
  /**
   * Icon displayed in the left navigation button.
   * @default ArrowLeft
   */
  leftNavigationIcon?: React.ElementType;
  /**
   * Icon displayed in the right navigation button.
   * @default ArrowRight
   */
  rightNavigationIcon?: React.ElementType;
  /**
   * Panel displayed when the calendar is in the loading state.
   */
  loadingPanel?: React.ElementType;
}

export interface DateCalendar2SlotProps {
  day?: SlotComponentPropsFromProps<ButtonBaseProps, {}, PickerOwnerState>;
  monthButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    PickerOwnerState
  >;
  yearButton?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLButtonElement> & { sx: SxProps },
    {},
    PickerOwnerState
  >;
  calendarHeader?: SlotComponentPropsFromProps<DateCalendar2HeaderProps, {}, PickerOwnerState>;
  switchViewButton?: SlotComponentPropsFromProps<IconButtonProps, {}, PickerOwnerState>;
  switchViewIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
  navigationButton?: SlotComponentPropsFromProps<
    IconButtonProps,
    {},
    PickerOwnerState & { target: 'previous' | 'next' }
  >;
  leftNavigationIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
  rightNavigationIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, PickerOwnerState>;
  loadingPanel?: SlotComponentPropsFromProps<
    React.HTMLAttributes<HTMLDivElement>,
    {},
    PickerOwnerState
  >;
}

export interface DateCalendar2PrivateContextValue {
  classes: DateCalendar2Classes;
  slots?: DateCalendar2Slots | undefined;
  slotProps?: DateCalendar2SlotProps | undefined;
  labelId: string;
  reduceAnimations: boolean;
  loading: boolean;
}

export interface DateCalendar2ContextValue {
  view: DateView;
  setView: (view: DateView) => void;
  views: { [key in DateView]?: boolean };
}
