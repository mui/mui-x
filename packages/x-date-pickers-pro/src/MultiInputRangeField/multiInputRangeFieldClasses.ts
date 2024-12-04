import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface MultiInputRangeFieldClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the separator element. */
  separator: string;
}

export type MultiInputRangeFieldClassKey = keyof MultiInputRangeFieldClasses;

export const multiInputRangeFieldClasses: MultiInputRangeFieldClasses = generateUtilityClasses(
  'MuiMultiInputRangeField',
  ['root', 'separator'],
);

export const getMultiInputRangeFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiMultiInputRangeField', slot);
