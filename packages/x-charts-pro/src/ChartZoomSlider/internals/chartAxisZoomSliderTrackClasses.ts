import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import ClassNameGenerator from '@mui/utils/ClassNameGenerator';
import type { ChartAxisZoomSliderActiveTrackProps } from './ChartAxisZoomSliderActiveTrack';

export interface ChartAxisZoomSliderTrackClasses {
  /** Styles applied to the root element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root element when it is vertical. */
  vertical: string;
  /** Styles applied to the root element to the active part of the track. */
  active: string;
  /** Styles applied to the root element to the background part of the track. */
  background: string;
}

export type ChartAxisZoomSliderTrackClassKey = keyof ChartAxisZoomSliderTrackClasses;

export const chartAxisZoomSliderTrackClasses: ChartAxisZoomSliderTrackClasses =
  generateUtilityClasses('MuiChartAxisZoomSliderTrack', [
    'horizontal',
    'vertical',
    'background',
    'active',
  ]);

export function getAxisZoomSliderTrackUtilityClass(slot: string) {
  return `${ClassNameGenerator.generate('MuiChartAxisZoomSliderTrack')}-${slot}`;
}

export const useUtilityClasses = (props: Partial<ChartAxisZoomSliderActiveTrackProps>) => {
  const { axisDirection } = props;
  const slots = {
    background: [axisDirection === 'x' ? 'horizontal' : 'vertical', 'background'],
    active: [axisDirection === 'x' ? 'horizontal' : 'vertical', 'active'],
  };

  return composeClasses(slots, getAxisZoomSliderTrackUtilityClass);
};
