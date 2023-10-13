import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface ChartsReferenceLineClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the reference line. */
  line: string;
  /** Styles applied to the reference label. */
  label: string;
}

export type ChartsReferenceLineClassKey = keyof ChartsReferenceLineClasses;

export function getChartsReferenceLineUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsReferenceLine', slot);
}

export const referenceLineClasses: ChartsReferenceLineClasses = generateUtilityClasses(
  'MuiChartsReferenceLine',
  ['root', 'line', 'label'],
);
