import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartZoomBrushHandleOwnerState } from './ChartZoomBrushHandle';

export interface ChartZoomBrushHandleClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root line element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root line element when it is vertical. */
  vertical: string;
}

export type ChartZoomBrushHandleClassKey = keyof ChartZoomBrushHandleClasses;

export const chartZoomBrushHandleClasses: ChartZoomBrushHandleClasses = generateUtilityClasses(
  'MuiChartZoomBrushHandle',
  ['root', 'horizontal', 'vertical'],
);

export function getZoomBrushHandleUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartZoomBrushHandle', slot);
}

export const useUtilityClasses = (ownerState: ChartZoomBrushHandleOwnerState) => {
  const { orientation } = ownerState;
  const slots = {
    root: ['root', orientation === 'horizontal' ? 'horizontal' : 'vertical'],
  };

  return composeClasses(slots, getZoomBrushHandleUtilityClass);
};
