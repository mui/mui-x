import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickerDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=true`. */
  dayOutsideMonth: string;
  /** Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=false`. */
  fillerCell: string;
  /** Styles applied to the root element if `disableHighlightToday=false` and `today=true`. */
  today: string;
  /** State class applied to the root element if `selected=true`. */
  selected: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** Styles applied to the root element if `isDayFirstVisibleCell=true`. */
  firstVisibleCell: string;
  /** Styles applied to the root element if `isDayLastVisibleCell=true`. */
  lastVisibleCell: string;
}

export type PickerDayClassKey = keyof PickerDayClasses;

export function getPickerDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickerDay', slot);
}

export const pickerDayClasses = generateUtilityClasses<PickerDayClassKey>('MuiPickerDay', [
  'root',
  'dayOutsideMonth',
  'today',
  'selected',
  'disabled',
  'fillerCell',
  'firstVisibleCell',
  'lastVisibleCell',
]);
