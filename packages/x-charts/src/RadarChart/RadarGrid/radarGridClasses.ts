import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

/**
 * @deprecated Use `RadarClasses` from `../radarClasses` instead.
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
 * @deprecated Use `RadarClassKey` from `../radarClasses` instead.
 */
export type RadarGridClassKey = keyof RadarGridClasses;

/**
 * @deprecated Use `getRadarUtilityClass` from `../radarClasses` instead.
 */
export function getRadarGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarGrid', slot);
}

/**
 * @deprecated Use `radarClasses` from `../radarClasses` instead.
 */
export const chartsGridClasses: RadarGridClasses = generateUtilityClasses('MuiRadarGrid', [
  'radial',
  'divider',
  'stripe',
]);

/**
 * @deprecated Use `useUtilityClasses` from `../radarClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarGridClasses>) => {
  const slots = {
    radial: ['radial'],
    divider: ['divider'],
    stripe: ['stripe'],
  };

  return composeClasses(slots, getRadarGridUtilityClass, classes);
};
