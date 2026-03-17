import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

/**
 * @deprecated Use `RadarClasses` instead.
 */
export interface RadarGridClasses {
  /** Styles applied to every radial line element. */
  radial: string;
  /** Styles applied to every divider element. */
  divider: string;
  /** Styles applied to every stripe element. */
  stripe: string;
}

/**
 * @deprecated Use `RadarClassKey` instead.
 */
export type RadarGridClassKey = keyof RadarGridClasses;

/**
 * @deprecated Use `getRadarUtilityClass` instead.
 */
export function getRadarGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarGrid', slot);
}

/**
 * @deprecated Use `radarClasses` instead.
 */
export const chartsGridClasses: RadarGridClasses = generateUtilityClasses('MuiRadarGrid', [
  'radial',
  'divider',
  'stripe',
]);

/**
 * @deprecated Use `useUtilityClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarGridClasses>) => {
  const slots = {
    radial: ['radial'],
    divider: ['divider'],
    stripe: ['stripe'],
  };

  return composeClasses(slots, getRadarGridUtilityClass, classes);
};
