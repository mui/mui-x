import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DateRangePickerDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `isHighlighting=true`. */
  rangeIntervalDayHighlight: string;
  /** Styles applied to the root element if `isStartOfHighlighting=true`. */
  rangeIntervalDayHighlightStart: string;
  /** Styles applied to the root element if `isEndOfHighlighting=true`. */
  rangeIntervalDayHighlightEnd: string;
  /** Styles applied to the preview element. */
  rangeIntervalPreview: string;
  /** Styles applied to the root element if `isPreviewing=true`. */
  rangeIntervalDayPreview: string;
  /** Styles applied to the root element if `isStartOfPreviewing=true`. */
  rangeIntervalDayPreviewStart: string;
  /** Styles applied to the root element if `isEndOfPreviewing=true`. */
  rangeIntervalDayPreviewEnd: string;
  /** Styles applied to the root element if `outsideCurrentMonth=true` */
  outsideCurrentMonth: string;
  /** Styles applied to the root element if `day` is the start of the month. */
  startOfMonth: string;
  /** Styles applied to the root element if `day` is the end of the month. */
  endOfMonth: string;
  /** Styles applied to the root element if `day` is the first visible cell of the month. */
  firstVisibleCell: string;
  /** Styles applied to the root element if `day` is the last visible cell of the month. */
  lastVisibleCell: string;
  /** Styles applied to the root element if it is an empty cell used to fill the week. */
  hiddenDayFiller: string;
  /** Styles applied to the day element. */
  day: string;
  /** Styles applied to the day element if `isHighlighting=false`. */
  dayOutsideRangeInterval: string;
  /** Styles applied to the day element if `selected=false` and `isHighlighting=true`. */
  dayInsideRangeInterval: string;
  /** Styles applied to the day element if `selected=false`. */
  notSelectedDate: string;
}

export type DateRangePickerDayClassKey = keyof DateRangePickerDayClasses;

export function getDateRangePickerDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateRangePickerDay', slot);
}

export const dateRangePickerDayClasses: DateRangePickerDayClasses = generateUtilityClasses(
  'MuiDateRangePickerDay',
  [
    'root',
    'rangeIntervalDayHighlight',
    'rangeIntervalDayHighlightStart',
    'rangeIntervalDayHighlightEnd',
    'rangeIntervalPreview',
    'rangeIntervalDayPreview',
    'rangeIntervalDayPreviewStart',
    'rangeIntervalDayPreviewEnd',
    'outsideCurrentMonth',
    'startOfMonth',
    'endOfMonth',
    'firstVisibleCell',
    'lastVisibleCell',
    'hiddenDayFiller',
    'day',
    'dayOutsideRangeInterval',
    'dayInsideRangeInterval',
    'notSelectedDate',
  ],
);
