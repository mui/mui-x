import composeClasses from '@mui/utils/composeClasses';
import { getChartsTooltipUtilityClass } from '@mui/x-charts/ChartsTooltip';
import { type HeatmapTooltipProps } from './HeatmapTooltip.types';

export const useUtilityClasses = (props: Pick<HeatmapTooltipProps, 'classes'>) => {
  const { classes } = props;

  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markContainer: ['markContainer'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};
