import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

/**
 * @deprecated Use `RadarClasses` instead.
 */
export interface RadarAxisClasses {
  /**
   * Styles applied to the root element.
   * @deprecated Use `radarClasses.axisRoot` instead.
   */
  root: string;
  /**
   * Styles applied to the line element.
   * @deprecated Use `radarClasses.axisLine` instead.
   */
  line: string;
  /**
   * Styles applied to every label element.
   * @deprecated Use `radarClasses.axisLabel` instead.
   */
  label: string;
}

/**
 * @deprecated Use `RadarClassKey` instead.
 */
export type RadarAxisClassKey = keyof RadarAxisClasses;

/**
 * @deprecated Use `getRadarUtilityClass` instead.
 */
export function getRadarAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxis', slot);
}

/**
 * @deprecated Use `radarClasses` instead.
 */
export const chartsAxisClasses: RadarAxisClasses = generateUtilityClasses('MuiRadarAxis', [
  'root',
  'line',
  'label',
]);

/**
 * @deprecated Use `useUtilityClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarAxisClasses>) => {
  const slots = {
    root: ['root'],
    line: ['line'],
    label: ['label'],
  };

  return composeClasses(slots, getRadarAxisUtilityClass, classes);
};
