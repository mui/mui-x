import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewItemPlugin, TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesSignature } from './useTreeViewJSXNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider/useTreeViewContext';
import {
  DescendantProvider,
  TreeItemDescendant,
  useDescendant,
} from '../../TreeViewProvider/DescendantProvider';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  setState,
}) => {
  const insertJSXNode = useEventCallback((node: TreeViewNode) => {
    setState((prevState) => {
      if (prevState.nodeMap[node.id] != null) {
        throw new Error(
          [
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            `Tow items were provided with the same id in the \`items\` prop: "${node.id}"`,
          ].join('\n'),
        );
      }

      return { ...prevState, nodeMap: { ...prevState.nodeMap, [node.id]: node } };
    });
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

const useTreeViewJSXNodesItemPlugin: TreeViewItemPlugin = ({ props, ref }) => {
  const { children, disabled = false, label, nodeId, id, ContentProps: inContentProps } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();

  const expandable = Boolean(Array.isArray(children) ? children.length : children);

  const [treeItemElement, setTreeItemElement] = React.useState<HTMLLIElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(setTreeItemElement, ref);

  const descendant = React.useMemo<TreeItemDescendant>(
    () => ({
      element: treeItemElement!,
      id: nodeId,
    }),
    [nodeId, treeItemElement],
  );

  const { index, parentId } = useDescendant(descendant);

  React.useEffect(() => {
    // On the first render a node's index will be -1. We want to wait for the real index.
    if (instance && index !== -1) {
      instance.insertJSXNode({
        id: nodeId,
        idAttribute: id,
        index,
        parentId,
        expandable,
        disabled,
      });

      return () => instance.removeJSXNode(nodeId);
    }

    return undefined;
  }, [instance, parentId, index, nodeId, expandable, disabled, id]);

  React.useEffect(() => {
    if (instance && label) {
      return instance.mapFirstCharFromJSX(
        nodeId,
        (contentRef.current?.textContent ?? '').substring(0, 1).toLowerCase(),
      );
    }
    return undefined;
  }, [instance, nodeId, label]);

  return {
    props: {
      ...props,
      ContentProps: {
        ...inContentProps,
        ref: contentRef,
      },
    },
    ref: handleRef,
    wrapItem: (item) => <DescendantProvider id={nodeId}>{item}</DescendantProvider>,
  };
};

useTreeViewJSXNodes.itemPlugin = useTreeViewJSXNodesItemPlugin;

useTreeViewJSXNodes.params = {};
