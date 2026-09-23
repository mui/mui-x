import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreeItemLoaderClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the icon gutter element of the default content. */
  iconContainer: string;
  /** Styles applied to the checkbox placeholder element of the default content. */
  checkbox: string;
  /** Styles applied to the label placeholder element of the default content. */
  label: string;
}

export type TreeItemLoaderClassKey = keyof TreeItemLoaderClasses;

export function getTreeItemLoaderUtilityClass(slot: string): string {
  return generateUtilityClass('MuiTreeItemLoader', slot);
}

export const treeItemLoaderClasses: TreeItemLoaderClasses = generateUtilityClasses(
  'MuiTreeItemLoader',
  ['root', 'iconContainer', 'checkbox', 'label'],
);
