import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { TreeViewRootSelector } from '../../utils/selectors';

export const selectorEditedItemId: TreeViewRootSelector<
  [UseTreeViewLabelSignature],
  string | null
> = (state) => state.editedItemId;
