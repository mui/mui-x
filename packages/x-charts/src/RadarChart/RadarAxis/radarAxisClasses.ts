import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the line element. */
  line: string;
  /** Styles applied to every label element. */
  label: string;
}

export type RadarAxisClassKey = keyof RadarAxisClasses;

export function getRadarAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxis', slot);
}

const slotNames = [
  'root',
  'line',
  'label',
] as (keyof RadarAxisClasses)[];

export const chartsAxisClasses: RadarAxisClasses = generateUtilityClasses('MuiRadarAxis', slotNames);

export const useUtilityClasses = (classes?: Partial<RadarAxisClasses>) => {
  const slots = Object.fromEntries(Object.keys(chartsAxisClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getRadarAxisUtilityClass, classes);
};
