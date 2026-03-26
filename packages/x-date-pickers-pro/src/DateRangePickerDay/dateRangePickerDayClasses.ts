import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateRangePickerDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=true`. */
  dayOutsideMonth: string;
  /** Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=false`. */
  fillerCell: string;
  /** Styles applied to the root element if `disableHighlightToday=false` and `today=true`. */
  today: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** State class applied to the root element if `selected=true`. */
  selected: string;
  previewStart: string;
  previewEnd: string;
  insidePreviewing: string;
  selectionStart: string;
  selectionEnd: string;
  insideSelection: string;
  startOfWeek: string;
  endOfWeek: string;
  startOfMonth: string;
  endOfMonth: string;
  previewed: string;
  draggable: string;
}

export type DateRangePickerDayClassKey = keyof DateRangePickerDayClasses;

export function getDateRangePickerDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateRangePickerDay', slot);
}

export const dateRangePickerDayClasses = generateUtilityClasses<DateRangePickerDayClassKey>(
  'MuiDateRangePickerDay',
  [
    'root',
    'dayOutsideMonth',
    'today',
    'disabled',
    'fillerCell',
    'previewStart',
    'previewEnd',
    'insidePreviewing',
    'selectionStart',
    'selectionEnd',
    'insideSelection',
    'startOfWeek',
    'endOfWeek',
    'startOfMonth',
    'endOfMonth',
    'previewed',
    'selected',
    'draggable',
  ],
);
