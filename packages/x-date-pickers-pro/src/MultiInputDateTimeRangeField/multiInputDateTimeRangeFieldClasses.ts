import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { MultiInputRangeFieldClasses } from '../internals/utils/createMultiInputRangeField';

export interface MultiInputDateTimeRangeFieldClasses extends MultiInputRangeFieldClasses {}

export type MultiInputDateTimeRangeFieldClassKey = keyof MultiInputRangeFieldClasses;

export const multiInputDateTimeRangeFieldClasses: MultiInputRangeFieldClasses =
  generateUtilityClasses('MuiMultiInputDateTimeRangeField', ['root', 'separator']);

export const getMultiInputDateTimeRangeFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiMultiInputDateTimeRangeField', slot);
