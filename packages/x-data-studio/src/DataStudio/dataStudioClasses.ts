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
  /** Styles applied to the sidebar action area (e.g. "New joint source"). */
  sheetsAction: string;
  /** Styles applied to the empty state. */
  empty: string;
  /** Styles applied to the view tab strip rendered on top of a dataset. */
  viewTabBar: string;
  /** Styles applied to every tab in the view tab strip. */
  viewTab: string;
  /** Styles applied to the active view tab. */
  viewTabActive: string;
  /** Styles applied to the leading, non-deletable "Table" tab. */
  viewTabTable: string;
  /** Styles applied to the per-view dropdown trigger inside a view tab. */
  viewTabActions: string;
  /** Styles applied to the "add view" button in the view tab strip. */
  viewTabAddButton: string;
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
  'viewTabBar',
  'viewTab',
  'viewTabActive',
  'viewTabTable',
  'viewTabActions',
  'viewTabAddButton',
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
  viewTabBar: ['viewTabBar'],
  viewTab: ['viewTab'],
  viewTabActive: ['viewTabActive'],
  viewTabTable: ['viewTabTable'],
  viewTabActions: ['viewTabActions'],
  viewTabAddButton: ['viewTabAddButton'],
};

export const useDataStudioUtilityClasses = (
  classes: Partial<DataStudioClasses> | undefined,
): DataStudioClasses => composeClasses(slots, getDataStudioUtilityClass, classes);
