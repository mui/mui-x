import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface TimeRangePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container element. */
  container: string;
  /** Styles applied to the separator element. */
  separator: string;
  /** Styles applied to the time container element. */
  timeContainer: string;
}

export type TimeRangePickerToolbarClassKey = keyof TimeRangePickerToolbarClasses;

export function getTimeRangePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiTimeRangePickerToolbar', slot);
}

export const timeRangePickerToolbarClasses: TimeRangePickerToolbarClasses = generateUtilityClasses(
  'MuiTimeRangePickerToolbar',
  ['root', 'container', 'separator', 'timeContainer'],
);
