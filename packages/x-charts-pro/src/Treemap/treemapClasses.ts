import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreemapClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the cells container. */
  cells: string;
  /** Styles applied to an individual cell (tile) element. */
  cell: string;
}

export type TreemapClassKey = keyof TreemapClasses;

export function getTreemapUtilityClass(slot: string) {
  return generateUtilityClass('MuiTreemap', slot);
}

export const treemapClasses: TreemapClasses = generateUtilityClasses('MuiTreemap', [
  'root',
  'cells',
  'cell',
]);

export const useUtilityClasses = (options?: { classes?: Partial<TreemapClasses> }) => {
  const { classes } = options ?? {};

  const slots = {
    root: ['root'],
    cells: ['cells'],
    cell: ['cell'],
  };

  return composeClasses(slots, getTreemapUtilityClass, classes);
};
