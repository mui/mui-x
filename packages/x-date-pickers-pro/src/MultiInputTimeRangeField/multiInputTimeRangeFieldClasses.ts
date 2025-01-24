import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { MultiInputRangeFieldClasses } from '../internals/utils/createMultiInputRangeField';

export interface MultiInputTimeRangeFieldClasses extends MultiInputRangeFieldClasses {}

export type MultiInputTimeRangeFieldClassKey = keyof MultiInputRangeFieldClasses;

export const multiInputTimeRangeFieldClasses: MultiInputRangeFieldClasses = generateUtilityClasses(
  'MuiMultiInputTimeRangeField',
  ['root', 'separator'],
);

export const getMultiInputTimeRangeFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiMultiInputTimeRangeField', slot);
