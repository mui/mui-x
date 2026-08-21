import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { TreeViewClasses } from '../internals/TreeViewProvider/TreeViewStyleContext';

export interface RichTreeViewClasses extends Omit<
  TreeViewClasses,
  'itemDragAndDropOverlay' | 'itemErrorIcon' | 'itemLoadingIcon'
> {
  /** Styles applied to each skeleton item element. */
  skeletonItem: string;
  /** Styles applied to the skeleton item's content element. */
  skeletonContent: string;
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
  'skeletonItem',
  'skeletonContent',
]);
