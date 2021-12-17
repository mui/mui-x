import * as React from 'react'
import {DayProps} from "../Day";
import {PickerOnChangeFn} from "../../CalendarPicker/useViews";
import {SlideDirection, SlideTransitionProps} from "../PickerViewSlideTransition";

export interface ExportedDayPickerProps<TDate>
    extends Pick<
        DayProps<TDate>,
        'disableHighlightToday' | 'showDaysOutsideCurrentMonth' | 'allowSameDateSelection'
        > {
  autoFocus?: boolean;
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading?: boolean;
  /**
   * Calendar onChange.
   */
  onChange: PickerOnChangeFn<TDate>;
  /**
   * Custom renderer for day. Check the [PickersDay](https://mui.com/api/pickers-day/) component.
   */
  renderDay?: (
      day: TDate,
      selectedDates: Array<TDate | null>,
      pickersDayProps: DayProps<TDate>,
  ) => JSX.Element;
  /**
   * Component displaying when passed `loading` true.
   * @default () => "..."
   */
  renderLoading?: () => React.ReactNode;
}

export interface DayPickerProps<TDate> extends ExportedDayPickerProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  currentMonth: TDate;
  date: TDate | [TDate | null, TDate | null] | null;
  disabled?: boolean;
  focusedDay: TDate | null;
  isDateDisabled: (day: TDate) => boolean;
  isMonthSwitchingAnimating: boolean;
  onFocusedDayChange: (newFocusedDay: TDate) => void;
  onMonthSwitchingAnimationEnd: () => void;
  readOnly?: boolean;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  TransitionProps?: Partial<SlideTransitionProps>;
}