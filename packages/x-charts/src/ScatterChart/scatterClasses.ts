import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ScatterClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ScatterClassKey = keyof ScatterClasses;

export function getScatterUtilityClass(slot: string) {
  return generateUtilityClass('MuiScatterChart', slot);
}

export const scatterClasses: ScatterClasses = generateUtilityClasses('MuiScatterChart', ['root']);

export const useUtilityClasses = (classes?: Partial<ScatterClasses>) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getScatterUtilityClass, classes);
};
