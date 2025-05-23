import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartAxisZoomSliderClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when the slider is horizontal. */
  horizontal: string;
  /** Styles applied to the root element when the slider is vertical. */
  vertical: string;

  /** Styles applied to the track of the zoom slider. */
  track: string;
  /** Styles applied to the track of the zoom slider when a range selection is being made. */
  selecting: string;
}

export type ChartAxisZoomSliderClassKey = keyof ChartAxisZoomSliderClasses;

export function getChartAxisZoomSliderUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartAxisZoomSlider', slot);
}

export const chartAxisZoomSliderClasses: ChartAxisZoomSliderClasses = generateUtilityClasses(
  'MuiChartAxisZoomSlider',
  ['root', 'vertical', 'horizontal', 'track', 'selecting'],
);
