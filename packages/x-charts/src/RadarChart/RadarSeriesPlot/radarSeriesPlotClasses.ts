import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarSeriesPlotClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the series element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the series element if it is faded. */
  faded: string;
  /** Styles applied to the series area element. */
  area: string;
  /** Styles applied to the series mark element. */
  mark: string;
}

export type RadarSeriesPlotClassKey = keyof RadarSeriesPlotClasses;

export function getRadarSeriesPlotUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarSeriesPlot', slot);
}

export const radarSeriesPlotClasses = generateUtilityClasses('MuiRadarSeriesPlot', [
  'root',
  'area',
  'mark',
  'highlighted',
  'faded',
]);

export const useUtilityClasses = (classes?: Partial<RadarSeriesPlotClasses>) => {
  const slots = {
    root: ['root'],
    area: ['area'],
    mark: ['mark'],
    highlighted: ['highlighted'],
    faded: ['faded'],
  };

  return composeClasses(slots, getRadarSeriesPlotUtilityClass, classes);
};
