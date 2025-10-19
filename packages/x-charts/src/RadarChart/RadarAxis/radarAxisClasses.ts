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
export const chartsAxisClasses: RadarAxisClasses = generateUtilityClasses('MuiRadarAxis', [
  'root',
  'line',
  'label',
]);

export const useUtilityClasses = (classes?: Partial<RadarAxisClasses>) => {
  const slots = {
    root: ['root'],
    line: ['line'],
    label: ['label'],
  };

  return composeClasses(slots, getRadarAxisUtilityClass, classes);
};
