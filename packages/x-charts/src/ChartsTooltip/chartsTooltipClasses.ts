import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import { createSlotArrayMap } from '@mui/x-internals/createSlotArrayMap';

export interface ChartsTooltipClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the paper element. */
  paper: string;
  /** Styles applied to the table element. */
  table: string;
  /** Styles applied to the row element. */
  row: string;
  /** Styles applied to the cell element. */
  cell: string;
  /** Styles applied to the mark element. */
  mark: string;
  /** Styles applied to the markContainer element. */
  markContainer: string;
  /** Styles applied to the labelCell element. */
  labelCell: string;
  /** Styles applied to the valueCell element. */
  valueCell: string;
  /** Styles applied to the axisValueCell element. Only available for axis tooltip. */
  axisValueCell: string;
}

export type ChartsTooltipClassKey = keyof Omit<
  ChartsTooltipClasses,
  // these classes are not used for styled components
  'markContainer' | 'labelCell' | 'valueCell'
>;

export function getChartsTooltipUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsTooltip', slot);
}
export const chartsTooltipClasses: ChartsTooltipClasses = generateUtilityClasses(
  'MuiChartsTooltip',
  [
    'root',
    'paper',
    'table',
    'row',
    'cell',
    'mark',
    'markContainer',
    'labelCell',
    'valueCell',
    'axisValueCell',
  ],
);

export const useUtilityClasses = (classes?: Partial<ChartsTooltipClasses>) => {
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
      'axisValueCell',
    ] as const),
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};
