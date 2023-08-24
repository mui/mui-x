import * as React from 'react';

export interface UseTreeViewFocusInstance {
  isNodeFocused: (nodeId: string) => boolean;
  focusNode: (event: React.SyntheticEvent, nodeId: string | null) => void;
  setFocusedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UseTreeViewFocusProps
  extends Pick<React.HTMLAttributes<HTMLUListElement>, 'onFocus' | 'onBlur'> {
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus?: (event: React.SyntheticEvent, nodeId: string) => void;
}

export interface UseTreeViewFocusState {
  focusedNodeId: string | null;
}
