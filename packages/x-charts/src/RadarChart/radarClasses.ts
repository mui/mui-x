import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarClasses {
  /** Styles applied to the radar axis root element. */
  axisRoot: string;
  /** Styles applied to the radar axis line element. */
  axisLine: string;
  /** Styles applied to every radar axis label element. */
  axisLabel: string;
  /** Styles applied to every radial line element of the grid. */
  gridRadial: string;
  /** Styles applied to every divider element of the grid. */
  gridDivider: string;
  /** Styles applied to every stripe element of the grid. */
  gridStripe: string;
  /** Styles applied to the series plot root element. */
  seriesRoot: string;
  /** Styles applied to the series area element. */
  seriesArea: string;
  /** Styles applied to the series mark element. */
  seriesMark: string;
  /** Styles applied to the axis highlight root element. */
  axisHighlightRoot: string;
  /** Styles applied to the axis highlight line element. */
  axisHighlightLine: string;
  /** Styles applied to every axis highlight dot element. */
  axisHighlightDot: string;
}

export type RadarClassKey = keyof RadarClasses;

function getRadarUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarChart', slot);
}

export const radarClasses: RadarClasses = generateUtilityClasses('MuiRadarChart', [
  'axisRoot',
  'axisLine',
  'axisLabel',
  'gridRadial',
  'gridDivider',
  'gridStripe',
  'seriesRoot',
  'seriesArea',
  'seriesMark',
  'axisHighlightRoot',
  'axisHighlightLine',
  'axisHighlightDot',
]);

export const useUtilityClasses = (classes?: Partial<RadarClasses>) => {
  const slots = {
    axisRoot: ['axisRoot'],
    axisLine: ['axisLine'],
    axisLabel: ['axisLabel'],
    gridRadial: ['gridRadial'],
    gridDivider: ['gridDivider'],
    gridStripe: ['gridStripe'],
    seriesRoot: ['seriesRoot'],
    seriesArea: ['seriesArea'],
    seriesMark: ['seriesMark'],
    axisHighlightRoot: ['axisHighlightRoot'],
    axisHighlightLine: ['axisHighlightLine'],
    axisHighlightDot: ['axisHighlightDot'],
  };

  return composeClasses(slots, getRadarUtilityClass, classes);
};
