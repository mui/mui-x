import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewFocusSignature } from '../useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewKeyboardNavigationInstance {
  updateFirstCharMap: (updater: (map: TreeViewFirstCharMap) => TreeViewFirstCharMap) => void;
}

export type UseTreeViewKeyboardNavigationSignature = TreeViewPluginSignature<{
  instance: UseTreeViewKeyboardNavigationInstance;
  dependantPlugins: [
    UseTreeViewSelectionSignature,
    UseTreeViewFocusSignature,
    UseTreeViewExpansionSignature,
  ];
}>;

export type TreeViewFirstCharMap = { [nodeId: string]: string };
