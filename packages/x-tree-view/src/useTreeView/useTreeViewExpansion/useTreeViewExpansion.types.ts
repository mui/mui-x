import * as React from 'react';

export interface UseTreeViewExpansionInstance {
  isNodeExpanded: (nodeId: string) => boolean;
  isNodeExpandable: (nodeId: string) => boolean;
  toggleNodeExpansion: (event: React.SyntheticEvent, value: string) => void;
  expandAllSiblings: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
}

export interface UseTreeViewExpansionState {
  expanded: string[];
}
