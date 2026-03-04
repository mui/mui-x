import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarGridClasses {
  /** Styles applied to every radial line element. */
  radial: string;
  /** Styles applied to every divider element. */
  divider: string;
  /** Styles applied to every stripe element. */
  stripe: string;
}

export type RadarGridClassKey = keyof RadarGridClasses;

export function getRadarGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarGrid', slot);
}

const slotNames = [
  'radial',
  'divider',
  'stripe',
] as (keyof RadarGridClasses)[];

export const chartsGridClasses: RadarGridClasses = generateUtilityClasses('MuiRadarGrid', slotNames);

export const useUtilityClasses = (classes?: Partial<RadarGridClasses>) => {
  const slots = Object.fromEntries(Object.keys(chartsGridClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getRadarGridUtilityClass, classes);
};
