import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import {
  PickersInputBaseClasses,
  pickersInputBaseClasses,
  PickersInputBaseClassKey,
} from '../PickersInputBase';

export interface PickersInputClasses extends PickersInputBaseClasses {
  /** Styles applied to the root element unless `disableUnderline={true}`. */
  underline: string;
}

export type PickersInputClassKey = keyof PickersInputClasses;

export function getPickersInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersFilledInput', slot);
}

export const pickersInputClasses = {
  ...pickersInputBaseClasses,
  ...generateUtilityClasses<PickersInputBaseClassKey>('MuiPickersInput', ['root', 'input']),
};
