import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesSignature } from './useTreeViewJSXNodes.types';
import { TreeViewNodeMap } from '../useTreeViewNodes/useTreeViewNodes.types';
import { useTimeout } from '../../hooks/useTimeout';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  state,
  setState,
}) => {
  const tempNodeMap = React.useRef<TreeViewNodeMap | null>(null);
  const timeout = useTimeout();

  const applyNodeMapAsync = () => {
    if (!tempNodeMap.current) {
      tempNodeMap.current = state.nodeMap;
      timeout.start(0, () => {
        const newNodeMap = tempNodeMap.current;
        if (newNodeMap == null) {
          return;
        }

        setState((prevState) => ({ ...prevState, nodeMap: newNodeMap }));
        tempNodeMap.current = null;
      });
    }
  };

  const insertJSXNode = useEventCallback((node: TreeViewNode) => {
    applyNodeMapAsync();
    tempNodeMap.current![node.id] = node;
  });

  const removeJSXNode = useEventCallback((nodeId: string) => {
    applyNodeMapAsync();
    const newMap = { ...tempNodeMap.current };
    delete newMap[nodeId];
    tempNodeMap.current = newMap;
  });

  populateInstance<UseTreeViewJSXNodesSignature>(instance, {
    insertJSXNode,
    removeJSXNode,
  });
};
