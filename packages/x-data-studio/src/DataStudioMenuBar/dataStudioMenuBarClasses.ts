import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface DataStudioMenuBarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the top row (brand + title + status + right cluster). */
  topRow: string;
  /** Styles applied to the brand mark wrapper. */
  brand: string;
  /** Styles applied to the document title. */
  title: string;
  /** Styles applied to the title status icons (favorite, folder, saved). */
  titleStatus: string;
  /** Styles applied to the right cluster (history / avatar / etc.). */
  rightCluster: string;
  /** Styles applied to the bottom menu strip (File, Edit, ...). */
  menuStrip: string;
  /** Styles applied to a menu strip trigger button. */
  menuTrigger: string;
}

export type DataStudioMenuBarClassKey = keyof DataStudioMenuBarClasses;

export function getDataStudioMenuBarUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataStudioMenuBar', slot);
}

export const dataStudioMenuBarClasses: DataStudioMenuBarClasses = generateUtilityClasses(
  'MuiDataStudioMenuBar',
  ['root', 'topRow', 'brand', 'title', 'titleStatus', 'rightCluster', 'menuStrip', 'menuTrigger'],
);

const slots: Record<DataStudioMenuBarClassKey, string[]> = {
  root: ['root'],
  topRow: ['topRow'],
  brand: ['brand'],
  title: ['title'],
  titleStatus: ['titleStatus'],
  rightCluster: ['rightCluster'],
  menuStrip: ['menuStrip'],
  menuTrigger: ['menuTrigger'],
};

export const useDataStudioMenuBarUtilityClasses = (
  classes: Partial<DataStudioMenuBarClasses> | undefined,
): DataStudioMenuBarClasses => composeClasses(slots, getDataStudioMenuBarUtilityClass, classes);
