import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewFocusSignature } from '../useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewKeyboardNavigationInstance {
  mapFirstCharFromJSX: (nodeId: string, firstChar: string) => () => void;
}

export type UseTreeViewKeyboardNavigationSignature = TreeViewPluginSignature<
  {},
  {},
  UseTreeViewKeyboardNavigationInstance,
  {},
  {},
  never,
  [
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewFocusSignature,
    UseTreeViewExpansionSignature,
  ]
>;
