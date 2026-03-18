import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

/**
 * @deprecated Use `RadarClasses` instead.
 */
export interface RadarSeriesPlotClasses {
  /**
   * Styles applied to the root element.
   * @deprecated Use `radarClasses.seriesRoot` instead.
   */
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
  /**
   * Styles applied to the series area element.
   * @deprecated Use `radarClasses.seriesArea` instead.
   */
  area: string;
  /** Styles applied to the series mark element.
   * @deprecated Use `radarClasses.seriesMark` instead.
   */
  mark: string;
}

/**
 * @deprecated Use `RadarClassKey` instead.
 */
export type RadarSeriesPlotClassKey = keyof RadarSeriesPlotClasses;

/**
 * @deprecated Use `getRadarUtilityClass` instead.
 */
export function getRadarSeriesPlotUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarSeriesPlot', slot);
}

/**
 * @deprecated Use `radarClasses` instead.
 */
export const radarSeriesPlotClasses = generateUtilityClasses('MuiRadarSeriesPlot', [
  'root',
  'area',
  'mark',
  'highlighted',
  'faded',
]);

/**
 * @deprecated Use `useUtilityClasses` instead.
 */
export const useUtilityClasses = (classes?: Partial<RadarSeriesPlotClasses>) => {
  const slots = {
    ...createSlotArrayMap(['root', 'area', 'mark', 'highlighted', 'faded'] as const),
  };

  return composeClasses(slots, getRadarSeriesPlotUtilityClass, classes);
};
