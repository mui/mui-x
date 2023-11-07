import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsReferenceLineClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element is reference line is verticale. */
  verticale: string;
  /** Styles applied to the root element is reference line is horizontal. */
  horizontal: string;
  /** Styles applied to the reference line. */
  line: string;
  /** Styles applied to the reference label. */
  label: string;
}

export type ChartsReferenceLineClassKey = keyof ChartsReferenceLineClasses;

export function getReferenceLineUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsReferenceLine', slot);
}

export const referenceLineClasses: ChartsReferenceLineClasses = generateUtilityClasses(
  'MuiChartsReferenceLine',
  ['root', 'verticale', 'horizontal', 'line', 'label'],
);
