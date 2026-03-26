import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChartsSvgLayerClasses {
  /** Styles applied to the root element. */
  root: string;
}

function getSvgLayerUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsSvgLayer', slot);
}

export const useUtilityClasses = () => {
  const slots = { root: ['root'] };

  return composeClasses(slots, getSvgLayerUtilityClass);
};

export const chartsSvgLayerClasses: ChartsSvgLayerClasses = generateUtilityClasses(
  'MuiChartsSvgLayer',
  ['root'],
);
