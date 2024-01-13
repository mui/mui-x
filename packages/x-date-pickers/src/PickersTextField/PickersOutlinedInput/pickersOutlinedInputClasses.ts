import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { PickersInputBaseClasses, pickersInputBaseClasses } from '../PickersInputBase';

export interface PickersOutlinedInputClasses extends PickersInputBaseClasses {
  /** Styles applied to the NotchedOutline element. */
  notchedOutline: string;
}

export type PickersOutlinedInputClassKey = keyof PickersOutlinedInputClasses;

export function getPickersOutlinedInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersOutlinedInput', slot);
}

export const pickersOutlinedInputClasses = {
  ...pickersInputBaseClasses,
  ...generateUtilityClasses('MuiPickersOutlinedInput', ['root', 'notchedOutline', 'input']),
};
