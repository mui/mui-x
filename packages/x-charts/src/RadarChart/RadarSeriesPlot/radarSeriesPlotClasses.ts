import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

/**
 * @deprecated Use `RadarClasses` from `../radarClasses` instead.
 */
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

/**
 * @deprecated Use `RadarClassKey` from `../radarClasses` instead.
 */
export type RadarSeriesPlotClassKey = keyof RadarSeriesPlotClasses;

/**
 * @deprecated Use `getRadarUtilityClass` from `../radarClasses` instead.
 */
export function getRadarSeriesPlotUtilityClass(slot: string) {
  return generateUtilityClass('MuiRadarSeriesPlot', slot);
}

/**
 * @deprecated Use `radarClasses` from `../radarClasses` instead.
 */
export const radarSeriesPlotClasses = generateUtilityClasses('MuiRadarSeriesPlot', [
  'root',
  'area',
  'mark',
  'highlighted',
  'faded',
]);

/**
 * @deprecated Use `useUtilityClasses` from `../radarClasses` instead.
 */
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
