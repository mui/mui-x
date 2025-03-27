import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface EnhancedPickersDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `disableMargin=false`. */
  dayWithMargin: string;
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
  disableMargin: string;
  previewed: string;
}

export type EnhancedPickersDayClassKey = keyof EnhancedPickersDayClasses;

export function getEnhancedPickersDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiEnhancedPickersDay', slot);
}

export const enhancedPickersDayClasses = generateUtilityClasses<EnhancedPickersDayClassKey>(
  'MuiEnhancedPickersDay',
  [
    'root',
    'dayWithMargin',
    'dayOutsideMonth',
    'today',
    'selected',
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
    'disableMargin',
    'startOfMonth',
    'endOfMonth',
    'previewed',
  ],
);
