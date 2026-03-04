import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RadarSeriesPlotClasses {
  /** Styles applied to the root element. */
  root: string;
  /**
   * Styles applied to the series element if it is highlighted.
   * @deprecated Use `[data-highlighted]` selector instead.
   */
  highlighted: string;
  /**
   * Styles applied to the series element if it is faded.
   * @deprecated Use `[data-faded]` selector instead.
   */
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

const slotNames = [
  'root',
  'area',
  'mark',
  'highlighted',
  'faded',
] as (keyof RadarSeriesPlotClasses)[];

export const radarSeriesPlotClasses = generateUtilityClasses('MuiRadarSeriesPlot', slotNames);

export const useUtilityClasses = (classes?: Partial<RadarSeriesPlotClasses>) => {
  const slots = Object.fromEntries(Object.keys(radarSeriesPlotClasses).map((key) => [key, [key]]));

  return composeClasses(slots, getRadarSeriesPlotUtilityClass, classes);
};
