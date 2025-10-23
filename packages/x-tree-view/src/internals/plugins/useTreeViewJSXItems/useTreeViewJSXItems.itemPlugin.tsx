'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { TreeViewItemPlugin, TreeViewPlugin } from '../../models';
import { UseTreeViewJSXItemsSignature } from './useTreeViewJSXItems.types';
import { useTreeViewContext } from '../../TreeViewProvider';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';
import { itemHasChildren } from '../../../hooks/useTreeItemUtils/useTreeItemUtils';
import { idSelectors } from '../../corePlugins/useTreeViewId';

export const useTreeViewJSXItems: TreeViewPlugin<UseTreeViewJSXItemsSignature> = () => {
  return {
    instance: {},
  };
};

export const useTreeViewJSXItemsItemPlugin: TreeViewItemPlugin = ({
  props,
  rootRef,
  contentRef,
}) => {
  const { instance, store } = useTreeViewContext<[UseTreeViewJSXItemsSignature]>();
  const { children, disabled = false, label, itemId, id } = props;

  const parentContext = React.useContext(TreeViewChildrenItemContext);
  if (parentContext == null) {
    throw new Error(
      [
        'MUI X: Could not find the Tree View Children Item context.',
        'It looks like you rendered your component outside of a SimpleTreeView parent component.',
        'This can also happen if you are bundling multiple versions of the Tree View.',
      ].join('\n'),
    );
  }
  const { registerChild, unregisterChild, parentId } = parentContext;

  const expandable = itemHasChildren(children);
  const pluginContentRef = React.useRef<HTMLDivElement>(null);
  const handleContentRef = useMergedRefs(pluginContentRef, contentRef);
  const treeId = useStore(store, idSelectors.treeId);

  // Prevent any flashing
  useIsoLayoutEffect(() => {
    const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });
    registerChild(idAttribute, itemId);

    return () => {
      unregisterChild(idAttribute);
      unregisterChild(idAttribute);
    };
  }, [store, instance, registerChild, unregisterChild, itemId, id, treeId]);

  useIsoLayoutEffect(() => {
    return instance.insertJSXItem({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });
  }, [instance, parentId, itemId, expandable, disabled, id]);

  React.useEffect(() => {
    if (label) {
      return instance.mapLabelFromJSX(
        itemId,
        (pluginContentRef.current?.textContent ?? '').toLowerCase(),
      );
    }
    return undefined;
  }, [instance, itemId, label]);

  return {
    contentRef: handleContentRef,
    rootRef,
  };
};

useTreeViewJSXItems.itemPlugin = useTreeViewJSXItemsItemPlugin;

useTreeViewJSXItems.wrapItem = ({ children, itemId, idAttribute }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const depthContext = React.useContext(TreeViewItemDepthContext);

  return (
    <TreeViewChildrenItemProvider itemId={itemId} idAttribute={idAttribute}>
      <TreeViewItemDepthContext.Provider value={(depthContext as number) + 1}>
        {children}
      </TreeViewItemDepthContext.Provider>
    </TreeViewChildrenItemProvider>
  );
};

useTreeViewJSXItems.wrapRoot = ({ children }) => (
  <TreeViewChildrenItemProvider itemId={null} idAttribute={null}>
    <TreeViewItemDepthContext.Provider value={0}>{children}</TreeViewItemDepthContext.Provider>
  </TreeViewChildrenItemProvider>
);

useTreeViewJSXItems.params = {};
