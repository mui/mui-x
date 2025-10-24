'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { TreeItemWrapper, TreeViewItemPlugin } from '../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';
import { itemHasChildren } from '../../../hooks/useTreeItemUtils/useTreeItemUtils';
import { idSelectors } from '../../corePlugins/useTreeViewId';
import { SimpleTreeViewStore } from '../../SimpleTreeViewStore';

export const useItemPlugin: TreeViewItemPlugin = ({ props, rootRef, contentRef }) => {
  const { store } = useTreeViewContext<SimpleTreeViewStore<any>>();
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
  }, [store, registerChild, unregisterChild, itemId, id, treeId]);

  useIsoLayoutEffect(() => {
    return store.insertJSXItem({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });
  }, [store, parentId, itemId, expandable, disabled, id]);

  React.useEffect(() => {
    if (label) {
      return store.mapLabelFromJSX(
        itemId,
        (pluginContentRef.current?.textContent ?? '').toLowerCase(),
      );
    }
    return undefined;
  }, [store, itemId, label]);

  return {
    contentRef: handleContentRef,
    rootRef,
  };
};

export const itemWrapper: TreeItemWrapper<SimpleTreeViewStore<any>> = ({
  children,
  itemId,
  idAttribute,
}) => {
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
