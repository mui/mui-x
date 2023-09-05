import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesRegistrationSignature } from './useTreeViewJSXNodesRegistration.types';

/**
 * Plugin responsible for the registering of the nodes defined as JSX children of the TreeView.
 * When we will have both a SimpleTreeView using JSX children and a TreeView using a data prop,
 * this plugin will only be used by SimpleTreeView.
 */
export const useTreeViewJSXNodesRegistration: TreeViewPlugin<
  UseTreeViewJSXNodesRegistrationSignature
> = ({ instance }) => {
  const nodeMap = React.useRef<{ [nodeId: string]: TreeViewNode }>({});

  const registerNode = useEventCallback((node: TreeViewNode) => {
    const { id, index, parentId, expandable, idAttribute, disabled } = node;

    nodeMap.current[id] = { id, index, parentId, expandable, idAttribute, disabled };

    return () => {
      const newMap = { ...nodeMap.current };
      delete newMap[id];
      nodeMap.current = newMap;

      instance.publishEvent<UseTreeViewJSXNodesRegistrationSignature, 'unRegisterNode'>(
        'unRegisterNode',
        { id },
      );
    };
  });

  const getNodeMap = useEventCallback(() => nodeMap.current);

  populateInstance<UseTreeViewJSXNodesRegistrationSignature>(instance, {
    registerNode,
    getNodeMap,
  });
};
