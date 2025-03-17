import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { NestedClasses } from '../internals/models';
import { TreeItemNonStateClasses } from '../TreeItem/treeItemClasses';

export interface RichTreeViewClasses extends NestedClasses<'item', keyof TreeItemNonStateClasses> {
  /** Styles applied to the root element. */
  root: string;
}

export type RichTreeViewClassKey = keyof RichTreeViewClasses;

export function getRichTreeViewUtilityClass(slot: string): string {
  return generateUtilityClass('MuiRichTreeView', slot);
}

export const richTreeViewClasses: RichTreeViewClasses = generateUtilityClasses('MuiRichTreeView', [
  'root',
  'item',
  'itemContent',
  'itemGroupTransition',
  'itemIconContainer',
  'itemLabel',
  'itemCheckbox',
  'itemLabelInput',
  'itemDragAndDropOverlay',
]);
