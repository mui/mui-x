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
  hiddenDay: string;
  /** Styles applied to the root element if `disableHighlightToday=false` and `today=true`. */
  today: string;
  /** State class applied to the root element if `selected=true`. */
  selected: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  startOfPreviewing: string;
  endOfPreviewing: string;
  previewing: string;
  startOfSelectedRange: string;
  endOfSelectedRange: string;
  withinSelectedRange: string;
  dragSelected: string;
  firstDayOfWeek: string;
  lastDayOfWeek: string;
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
    'hiddenDay',
    'startOfPreviewing',
    'endOfPreviewing',
    'previewing',
    'startOfSelectedRange',
    'endOfSelectedRange',
    'withinSelectedRange',
    'dragSelected',
    'firstDayOfWeek',
    'lastDayOfWeek',
  ],
);
