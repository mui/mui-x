import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsRotationAxisClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChartsRotationAxisClassKey = keyof ChartsRotationAxisClasses;

export function getChartsRotationAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRotationAxis', slot);
}

export const chartsRotationAxisClasses: ChartsRotationAxisClasses = generateUtilityClasses('MuiChartsRotationAxis', [
  'root',
]);

export const useUtilityClasses = (classes?: Partial<ChartsRotationAxisClasses>) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getChartsRotationAxisUtilityClass, classes);
};
