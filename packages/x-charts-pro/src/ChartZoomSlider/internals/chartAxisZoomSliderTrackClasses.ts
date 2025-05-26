import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartAxisZoomSliderTrackClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the track of the zoom slider when a range selection is being made. */
  selecting: string;
}

export type ChartAxisZoomSliderTrackClassKey = keyof ChartAxisZoomSliderTrackClasses;

export const chartAxisZoomSliderTrackClasses: ChartAxisZoomSliderTrackClasses =
  generateUtilityClasses('MuiChartAxisZoomSliderTrack', ['root', 'selecting']);
