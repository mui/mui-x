import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickerDay2Classes {
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

export type PickerDay2ClassKey = keyof PickerDay2Classes;

export function getPickerDay2UtilityClass(slot: string) {
  return generateUtilityClass('MuiPickerDay2', slot);
}

export const pickerDay2Classes = generateUtilityClasses<PickerDay2ClassKey>('MuiPickerDay2', [
  'root',
  'dayOutsideMonth',
  'today',
  'selected',
  'disabled',
  'fillerCell',
]);
