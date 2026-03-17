import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

/**
 * @deprecated Use `RadarClasses` from `../radarClasses` instead.
 */
export interface RadarAxisClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the line element. */
  line: string;
  /** Styles applied to every label element. */
  label: string;
}

/**
 * @deprecated Use `RadarClassKey` from `../radarClasses` instead.
 */
export type RadarAxisClassKey = keyof RadarAxisClasses;

/**
 * @deprecated Use `getRadarUtilityClass` from `../radarClasses` instead.
 */
export function getRadarAxisUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxis', slot);
}

/**
 * @deprecated Use `radarClasses` from `../radarClasses` instead.
 */
export const chartsAxisClasses: RadarAxisClasses = generateUtilityClasses('MuiRadarAxis', [
  'root',
  'line',
  'label',
]);

/**
 * @deprecated Use `useUtilityClasses` from `../radarClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarAxisClasses>) => {
  const slots = {
    ...createSlotArrayMap(['root', 'line', 'label'] as const),
  };

  return composeClasses(slots, getRadarAxisUtilityClass, classes);
};
