import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface EnhancedPickersDayClasses {
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

export type EnhancedPickersDayClassKey = keyof EnhancedPickersDayClasses;

export function getEnhancedPickersDayUtilityClass(slot: string) {
  return generateUtilityClass('MuiEnhancedPickersDay', slot);
}

export const enhancedPickersDayClasses = generateUtilityClasses<EnhancedPickersDayClassKey>(
  'MuiEnhancedPickersDay',
  ['root', 'dayOutsideMonth', 'today', 'selected', 'disabled', 'fillerCell'],
);
