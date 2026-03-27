import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateRangePickerDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `isDayOutsideMonth=true` and `showDaysOutsideCurrentMonth=true`. */
  dayOutsideMonth: string;
  /** Styles applied to the root element if `isDayOutsideMonth=true` and `showDaysOutsideCurrentMonth=false`. */
  fillerCell: string;
  /** Styles applied to the root element if `disableHighlightToday=false` and `isDayCurrent=true`. */
  today: string;
  /** State class applied to the root element if `isDayDisabled=true`. */
  disabled: string;
  /** State class applied to the root element if `isDaySelected=true`. */
  selected: string;
  /** Styles applied to the root element if `isDayPreviewStart=true`. */
  previewStart: string;
  /** Styles applied to the root element if `isDayPreviewEnd=true`. */
  previewEnd: string;
  /** Styles applied to the root element if `isDayInsidePreview=true`. */
  insidePreviewing: string;
  /** Styles applied to the root element if `isDaySelectionStart=true`. */
  selectionStart: string;
  /** Styles applied to the root element if `isDaySelectionEnd=true`. */
  selectionEnd: string;
  /** Styles applied to the root element if `isDayInsideSelection=true`. */
  insideSelection: string;
  /** Styles applied to the root element if `isDayStartOfWeek=true`. */
  startOfWeek: string;
  /** Styles applied to the root element if `isDayEndOfWeek=true`. */
  endOfWeek: string;
  /** Styles applied to the root element if `isDayStartOfMonth=true`. */
  startOfMonth: string;
  /** Styles applied to the root element if `isDayEndOfMonth=true`. */
  endOfMonth: string;
  /** Styles applied to the root element if `isDayPreviewed=true`. */
  previewed: string;
  /** Styles applied to the root element if `isDayDraggable=true`. */
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
