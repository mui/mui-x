import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';

export interface GaugeClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the arc diplaying the value. */
  valueArc: string;
  /** Styles applied to the arc diplaying the range of available values. */
  referenceArc: string;
}

export type GaugeClassKey = keyof GaugeClasses;

export function getGaugeUtilityClass(slot: string): string {
  return generateUtilityClass('MuiGauge', slot);
}

const gaugeClasses: GaugeClasses = generateUtilityClasses('MuiGauge', [
  'root',
  'valueArc',
  'referenceArc',
]);

export default gaugeClasses;
