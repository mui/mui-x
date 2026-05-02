import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadialLineClasses {
  /** Styles applied to the area element. */
  area: string;
  /** Styles applied to the line element. */
  line: string;
  /** Styles applied to the mark element. */
  mark: string;
  /** Styles applied to the highlight element. */
  highlight: string;
  /** Styles applied to the AreaPlot root element. */
  areaPlot: string;
  /** Styles applied to the LinePlot root element. */
  linePlot: string;
  /** Styles applied to the MarkPlot root element. */
  markPlot: string;
}

export type LineClassKey = keyof RadialLineClasses;

export interface MarkElementOwnerState {
  classes?: Partial<RadialLineClasses>;
  skipAnimation?: boolean;
}

export function getLineUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadialLineChart', slot);
}

export const radialLineClasses: RadialLineClasses = generateUtilityClasses('MuiRadialLineChart', [
  'area',
  'line',
  'mark',
  'highlight',
  'areaPlot',
  'linePlot',
  'markPlot',
]);

export interface UseUtilityClassesOptions {
  classes?: Partial<RadialLineClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { classes } = options ?? {};
  const slots = {
    area: ['area'],
    line: ['line'],
    mark: ['mark'],
    highlight: ['highlight'],
    areaPlot: ['areaPlot'],
    linePlot: ['linePlot'],
    markPlot: ['markPlot'],
  };

  return composeClasses(slots, getLineUtilityClass, classes);
};
