import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface DataStudioToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to a button group. */
  group: string;
  /** Styles applied to the divider between groups. */
  divider: string;
  /** Styles applied to the quick-filter input wrapper. */
  search: string;
}

export type DataStudioToolbarClassKey = keyof DataStudioToolbarClasses;

export function getDataStudioToolbarUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataStudioToolbar', slot);
}

export const dataStudioToolbarClasses: DataStudioToolbarClasses = generateUtilityClasses(
  'MuiDataStudioToolbar',
  ['root', 'group', 'divider', 'search'],
);

const slots: Record<DataStudioToolbarClassKey, string[]> = {
  root: ['root'],
  group: ['group'],
  divider: ['divider'],
  search: ['search'],
};

export const useDataStudioToolbarUtilityClasses = (
  classes: Partial<DataStudioToolbarClasses> | undefined,
): DataStudioToolbarClasses => composeClasses(slots, getDataStudioToolbarUtilityClass, classes);
