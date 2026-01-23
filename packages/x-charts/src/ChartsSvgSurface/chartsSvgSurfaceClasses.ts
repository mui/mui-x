import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChartsSvgSurfaceClasses {
  /** Styles applied to the root element. */
  root: string;
}

function getSurfaceUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsSvgSurface', slot);
}

export const useUtilityClasses = () => {
  const slots = { root: ['root'] };

  return composeClasses(slots, getSurfaceUtilityClass);
};

export const chartsSvgSurfaceClasses: ChartsSvgSurfaceClasses = generateUtilityClasses(
  'MuiChartsSvgSurface',
  ['root'],
);
