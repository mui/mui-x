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
  rangeIntervalOutsideCurrentMonth: string;
  /** Styles applied to the root element if `day` is the start of the month. */
  rangeIntervalStartOfMonth: string;
  /** Styles applied to the root element if `day` is the end of the month. */
  rangeIntervalEndOfMonth: string;
  /** Styles applied to the root element if `day` is the first visible cell of the month. */
  rangeIntervalFirstVisibleCell: string;
  /** Styles applied to the root element if `day` is the last visible cell of the month. */
  rangeIntervalLastVisibleCell: string;
  /** Styles applied to the root element if it is an empty cell used to fill the week. */
  rangeIntervalHiddenDayFiller: string;
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
    'rangeIntervalOutsideCurrentMonth',
    'rangeIntervalStartOfMonth',
    'rangeIntervalEndOfMonth',
    'rangeIntervalFirstVisibleCell',
    'rangeIntervalLastVisibleCell',
    'rangeIntervalHiddenDayFiller',
    'day',
    'dayOutsideRangeInterval',
    'dayInsideRangeInterval',
    'notSelectedDate',
  ],
);
