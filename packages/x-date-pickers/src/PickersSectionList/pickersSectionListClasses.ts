import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersSectionListClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container of a section. */
  section: string;
  /** Styles applied to the content of a section. */
  sectionContent: string;
}

export type PickersSectionListClassKey = keyof PickersSectionListClasses;

export function getPickersSectionListUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersSectionList', slot);
}

export const pickersSectionListClasses = generateUtilityClasses<PickersSectionListClassKey>(
  'MuiPickersSectionList',
  ['root', 'section', 'sectionContent'],
);
