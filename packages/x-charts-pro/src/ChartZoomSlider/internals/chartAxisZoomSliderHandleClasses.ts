import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartZoomSliderHandleOwnerState } from './ChartAxisZoomSliderHandle';

export interface ChartAxisZoomSliderHandleClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root element when it is vertical. */
  vertical: string;
  /** Styles applied to the root element when it is a start handle. */
  start: string;
  /** Styles applied to the root element when it is an end handle. */
  end: string;
}

export type ChartAxisZoomSliderHandleClassKey = keyof ChartAxisZoomSliderHandleClasses;

export const chartAxisZoomSliderHandleClasses: ChartAxisZoomSliderHandleClasses =
  generateUtilityClasses('MuiChartAxisZoomSliderHandle', [
    'root',
    'horizontal',
    'vertical',
    'start',
    'end',
  ]);

export function getAxisZoomSliderHandleUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartAxisZoomSliderHandle', slot);
}

export const useUtilityClasses = (ownerState: ChartZoomSliderHandleOwnerState) => {
  const { orientation, placement } = ownerState;
  const slots = {
    root: [
      'root',
      orientation === 'horizontal' ? 'horizontal' : 'vertical',
      placement === 'start' ? 'start' : 'end',
    ],
  };

  return composeClasses(slots, getAxisZoomSliderHandleUtilityClass);
};
