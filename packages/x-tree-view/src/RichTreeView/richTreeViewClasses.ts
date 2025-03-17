import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { TreeViewClasses } from '../internals/TreeViewProvider/TreeViewClassesContext';

export interface RichTreeViewClasses
  extends Omit<TreeViewClasses, 'itemDragAndDropOverlay' | 'itemErrorIcon'> {}

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
]);
