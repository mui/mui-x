import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersDayClasses {
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
}

export type PickersDayClassKey = keyof PickersDayClasses;

export function getPickersDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersDay', slot);
}

export const pickersDayClasses = generateUtilityClasses<PickersDayClassKey>('MuiPickersDay', [
  'root',
  'dayOutsideMonth',
  'today',
  'selected',
  'disabled',
  'fillerCell',
]);
