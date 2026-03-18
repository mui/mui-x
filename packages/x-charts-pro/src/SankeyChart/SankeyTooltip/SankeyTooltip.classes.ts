import composeClasses from '@mui/utils/composeClasses';
import { createSlotArrayMap } from '@mui/x-charts/internals';
import { getChartsTooltipUtilityClass } from '@mui/x-charts/internals';
import type { SankeyTooltipProps } from './SankeyTooltip.types';

export const useUtilityClasses = (props: Pick<SankeyTooltipProps, 'classes'>) => {
  const { classes } = props;

  const slots = {
    ...createSlotArrayMap([
      'root',
      'paper',
      'table',
      'row',
      'cell',
      'mark',
      'markContainer',
      'labelCell',
      'valueCell',
    ] as const),
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};
