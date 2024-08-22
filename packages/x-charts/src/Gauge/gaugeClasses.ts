import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';

export interface GaugeClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the arc displaying the value. */
  valueArc: string;
  /** Styles applied to the arc displaying the range of available values. */
  referenceArc: string;
  /** Styles applied to the value text. */
  valueText: string;
}

export type GaugeClassKey = keyof GaugeClasses;

export function getGaugeUtilityClass(slot: string): string {
  return generateUtilityClass('MuiGauge', slot);
}

export const gaugeClasses: GaugeClasses = generateUtilityClasses('MuiGauge', [
  'root',
  'valueArc',
  'referenceArc',
  'valueText',
]);

export default gaugeClasses;
