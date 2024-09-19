import { TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const selectorTreeViewId: TreeViewRootSelector<[UseTreeViewIdSignature], string> = (state) =>
  state.id.treeId ?? '';
