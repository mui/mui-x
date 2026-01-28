import composeClasses from '@mui/utils/composeClasses';
import { getChartsTooltipUtilityClass } from '@mui/x-charts/ChartsTooltip';
import type { SankeyTooltipProps } from './SankeyTooltip.types';

export const useUtilityClasses = (props: Pick<SankeyTooltipProps, 'classes'>) => {
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
