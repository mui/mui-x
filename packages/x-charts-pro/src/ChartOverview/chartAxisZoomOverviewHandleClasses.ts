import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartZoomOverviewHandleOwnerState } from './ChartAxisZoomOverviewHandle';

export interface ChartAxisZoomOverviewHandleClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root line element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root line element when it is vertical. */
  vertical: string;
}

export type ChartAxisZoomOverviewHandleClassKey = keyof ChartAxisZoomOverviewHandleClasses;

export const chartAxisZoomOverviewHandleClasses: ChartAxisZoomOverviewHandleClasses =
  generateUtilityClasses('MuiChartAxisZoomOverviewHandle', ['root', 'horizontal', 'vertical']);

export function getAxisZoomOverviewHandleUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartAxisZoomOverviewHandle', slot);
}

export const useUtilityClasses = (ownerState: ChartZoomOverviewHandleOwnerState) => {
  const { orientation } = ownerState;
  const slots = {
    root: ['root', orientation === 'horizontal' ? 'horizontal' : 'vertical'],
  };

  return composeClasses(slots, getAxisZoomOverviewHandleUtilityClass);
};
