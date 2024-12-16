import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { ChartsLabelProps } from './ChartsLabel';

export interface ChartsLabelClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChartsLabelClassKey = keyof ChartsLabelClasses;

export function getLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsLabel', slot);
}

export const labelClasses: ChartsLabelClasses = generateUtilityClasses('MuiChartsLabel', ['root']);

export const useUtilityClasses = (props: ChartsLabelProps) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getLabelUtilityClass, props.classes);
};
