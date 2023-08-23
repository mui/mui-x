import * as React from 'react';

export interface UseTreeViewFocusInstance {
  isNodeFocused: (nodeId: string) => boolean;
  focusNode: (event: React.SyntheticEvent, nodeId: string | null) => void;
  setFocusedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UseTreeViewFocusState {
  focusedNodeId: string | null;
}
