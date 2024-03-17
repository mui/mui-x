import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreeViewClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type TreeViewClassKey = keyof TreeViewClasses;

export function getTreeViewUtilityClass(slot: string): string {
  return generateUtilityClass('MuiTreeView', slot);
}

export const treeViewClasses: TreeViewClasses = generateUtilityClasses('MuiTreeView', ['root']);
