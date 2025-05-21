import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartZoomSliderThumbOwnerState } from './ChartAxisZoomSliderThumb';

export interface ChartAxisZoomSliderThumbClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root element when it is vertical. */
  vertical: string;
  /** Styles applied to the root element when it is a start thumb. */
  start: string;
  /** Styles applied to the root element when it is an end thumb. */
  end: string;
}

export type ChartAxisZoomSliderThumbClassKey = keyof ChartAxisZoomSliderThumbClasses;

export const chartAxisZoomSliderThumbClasses: ChartAxisZoomSliderThumbClasses =
  generateUtilityClasses('MuiChartAxisZoomSliderThumb', [
    'root',
    'horizontal',
    'vertical',
    'start',
    'end',
  ]);

export function getAxisZoomSliderThumbUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartAxisZoomSliderThumb', slot);
}

export const useUtilityClasses = (ownerState: ChartZoomSliderThumbOwnerState) => {
  const { orientation, placement } = ownerState;
  const slots = {
    root: [
      'root',
      orientation === 'horizontal' ? 'horizontal' : 'vertical',
      placement === 'start' ? 'start' : 'end',
    ],
  };

  return composeClasses(slots, getAxisZoomSliderThumbUtilityClass);
};
