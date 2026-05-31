import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface DataStudioClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the sidebar. */
  sidebar: string;
  /** Styles applied to the data explorer tree. */
  tree: string;
  /** Styles applied to the right pane wrapping toolbar + grid. */
  main: string;
  /** Styles applied to the toolbar area above the grid. */
  toolbarArea: string;
  /** Styles applied to the Data Grid wrapper. */
  grid: string;
  /** Styles applied to the views section action. */
  sheetsAction: string;
  /** Styles applied to the empty state. */
  empty: string;
  /** Styles applied to the bottom tab bar (tabs layout). */
  tabBar: string;
  /** Styles applied to every tab in the tab bar. */
  tab: string;
  /** Styles applied to the active tab. */
  tabActive: string;
  /** Styles applied to tabs that represent a dataSource. */
  tabDataset: string;
  /** Styles applied to tabs that represent a user view. */
  tabView: string;
  /** Styles applied to the per-view dropdown trigger inside the active view tab. */
  tabActions: string;
  /** Styles applied to the "add view" button in the tab bar. */
  tabAddButton: string;
  /** Styles applied to the "tabs menu" button in the tab bar. */
  tabMenuButton: string;
}

export type DataStudioClassKey = keyof DataStudioClasses;

export function getDataStudioUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataStudio', slot);
}

export const dataStudioClasses: DataStudioClasses = generateUtilityClasses('MuiDataStudio', [
  'root',
  'sidebar',
  'tree',
  'main',
  'toolbarArea',
  'grid',
  'sheetsAction',
  'empty',
  'tabBar',
  'tab',
  'tabActive',
  'tabDataset',
  'tabView',
  'tabActions',
  'tabAddButton',
  'tabMenuButton',
]);

const slots: Record<DataStudioClassKey, string[]> = {
  root: ['root'],
  sidebar: ['sidebar'],
  tree: ['tree'],
  main: ['main'],
  toolbarArea: ['toolbarArea'],
  grid: ['grid'],
  sheetsAction: ['sheetsAction'],
  empty: ['empty'],
  tabBar: ['tabBar'],
  tab: ['tab'],
  tabActive: ['tabActive'],
  tabDataset: ['tabDataset'],
  tabView: ['tabView'],
  tabActions: ['tabActions'],
  tabAddButton: ['tabAddButton'],
  tabMenuButton: ['tabMenuButton'],
};

export const useDataStudioUtilityClasses = (
  classes: Partial<DataStudioClasses> | undefined,
): DataStudioClasses => composeClasses(slots, getDataStudioUtilityClass, classes);
