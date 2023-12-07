import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersSectionsListClasses {
  /** Styles applied to the content of a section. */
  sectionContent: string;
}

export type PickersSectionsListClassKey = keyof PickersSectionsListClasses;

export function getPickersSectionsListUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersSectionsList', slot);
}

export const pickersSectionsListClasses = generateUtilityClasses<PickersSectionsListClassKey>(
  'MuiPickersSectionsList',
  ['sectionContent'],
);
