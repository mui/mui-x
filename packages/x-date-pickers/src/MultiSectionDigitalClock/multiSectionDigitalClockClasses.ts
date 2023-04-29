import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface MultiSectionDigitalClockClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MultiSectionDigitalClockClassKey = keyof MultiSectionDigitalClockClasses;

export function getMultiSectionDigitalClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiMultiSectionDigitalClock', slot);
}

export const multiSectionDigitalClockClasses: MultiSectionDigitalClockClasses =
  generateUtilityClasses('MuiMultiSectionDigitalClock', ['root']);
