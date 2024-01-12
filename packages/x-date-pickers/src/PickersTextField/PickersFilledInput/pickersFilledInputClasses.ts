import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { PickersInputBaseClasses, pickersInputBaseClasses } from '../PickersInputBase';

export interface PickersFilledInputClasses extends PickersInputBaseClasses {
  /** Styles applied to the root element unless `disableUnderline={true}`. */
  underline?: string;
}

export type PickersFilledInputClassKey = keyof PickersFilledInputClasses;

export function getPickersFilledInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersFilledInput', slot);
}

export const pickersFilledInputClasses = {
  ...pickersInputBaseClasses,
  ...generateUtilityClasses('MuiPickersFilledInput', ['root', 'underline', 'input']),
};
