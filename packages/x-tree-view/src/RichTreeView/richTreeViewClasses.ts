import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { TreeViewClasses } from '../internals/TreeViewProvider/TreeViewStyleContext';

export interface RichTreeViewClasses extends Omit<
  TreeViewClasses,
  'itemDragAndDropOverlay' | 'itemErrorIcon' | 'itemLoadingIcon'
> {
  /** Styles applied to each item loader element. */
  itemLoader: string;
  /** Styles applied to the item loader's content element. */
  itemLoaderContent: string;
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
  'itemLoader',
  'itemLoaderContent',
]);
