import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartZoomOverviewHandleOwnerState } from './ChartAxisZoomOverviewHandle';

export interface ChartAxisZoomOverviewHandleClasses {
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

export type ChartAxisZoomOverviewHandleClassKey = keyof ChartAxisZoomOverviewHandleClasses;

export const chartAxisZoomOverviewHandleClasses: ChartAxisZoomOverviewHandleClasses =
  generateUtilityClasses('MuiChartAxisZoomOverviewHandle', [
    'root',
    'horizontal',
    'vertical',
    'start',
    'end',
  ]);

export function getAxisZoomOverviewHandleUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartAxisZoomOverviewHandle', slot);
}

export const useUtilityClasses = (ownerState: ChartZoomOverviewHandleOwnerState) => {
  const { orientation, placement } = ownerState;
  const slots = {
    root: [
      'root',
      orientation === 'horizontal' ? 'horizontal' : 'vertical',
      placement === 'start' ? 'start' : 'end',
    ],
  };

  return composeClasses(slots, getAxisZoomOverviewHandleUtilityClass);
};
