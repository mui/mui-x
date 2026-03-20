import { PickerValidDate } from '../../models';

export interface PickerDayOwnerState {
  day: PickerValidDate;
  isDaySelected: boolean;
  isDayDisabled: boolean;
  isDayCurrent: boolean;
  isDayOutsideMonth: boolean;
  isDayStartOfWeek: boolean;
  isDayEndOfWeek: boolean;
  disableMargin: boolean;
  disableHighlightToday: boolean;
  showDaysOutsideCurrentMonth: boolean;
}
