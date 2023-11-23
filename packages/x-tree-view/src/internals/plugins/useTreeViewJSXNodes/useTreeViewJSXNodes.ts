import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesSignature } from './useTreeViewJSXNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  setState,
}) => {
  const insertJSXNode = useEventCallback((node: TreeViewNode) => {
    setState((prevState) => ({ ...prevState, nodeMap: { ...prevState.nodeMap, [node.id]: node } }));
  });

  const removeJSXNode = useEventCallback((nodeId: string) => {
    setState((prevState) => {
      const newMap = { ...prevState.nodeMap };
      delete newMap[nodeId];
      return {
        ...prevState,
        nodeMap: newMap,
      };
    });
    publishTreeViewEvent(instance, 'removeNode', { id: nodeId });
  });

  const mapFirstCharFromJSX = useEventCallback((nodeId: string, firstChar: string) => {
    instance.updateFirstCharMap((firstCharMap) => {
      firstCharMap[nodeId] = firstChar;
      return firstCharMap;
    });

    return () => {
      instance.updateFirstCharMap((firstCharMap) => {
        const newMap = { ...firstCharMap };
        delete newMap[nodeId];
        return newMap;
      });
    };
  });

  populateInstance<UseTreeViewJSXNodesSignature>(instance, {
    insertJSXNode,
    removeJSXNode,
    mapFirstCharFromJSX,
  });
};
