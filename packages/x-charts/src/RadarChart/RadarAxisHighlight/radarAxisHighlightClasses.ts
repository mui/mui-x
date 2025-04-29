import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the highlighted axis line element. */
  line: string;
  /** Styles applied to every highlight dot. */
  dot: string;
}

export type RadarAxisHighlightClassKey = keyof RadarAxisHighlightClasses;

export function getRadarAxisHighlightUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarAxisHighlight', slot);
}
export const chartsAxisHighlightClasses: RadarAxisHighlightClasses = generateUtilityClasses(
  'MuiRadarAxisHighlight',
  ['root', 'line', 'dot'],
);
