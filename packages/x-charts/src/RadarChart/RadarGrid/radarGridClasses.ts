import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarGridClasses {
  /** Styles applied to every radial line element. */
  radial: string;
  /** Styles applied to every divider element. */
  divider: string;
}

export type RadarGridClassKey = keyof RadarGridClasses;

export function getRadarGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarGrid', slot);
}
export const chartsGridClasses: RadarGridClasses = generateUtilityClasses('MuiRadarGrid', [
  'radial',
  'divider',
]);
