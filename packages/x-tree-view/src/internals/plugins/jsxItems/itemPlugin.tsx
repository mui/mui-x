'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { TreeItemWrapper, TreeViewItemPlugin } from '../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { itemHasChildren } from '../../../hooks/useTreeItemUtils/useTreeItemUtils';
import { idSelectors } from '../id';
import { SimpleTreeViewStore } from '../../SimpleTreeViewStore';

export const useJSXItemsItemPlugin: TreeViewItemPlugin = ({ props, rootRef, contentRef }) => {
  const { store } = useTreeViewContext<SimpleTreeViewStore<any>>();
  const { children, disabled = false, disableSelection = false, label, itemId, id } = props;

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
  const idAttribute = useStore(store, idSelectors.treeItemIdAttribute, itemId, id);
  const isMountedRef = React.useRef(true);
  const ownerTokenRef = useRefWithInit(Symbol);

  // Prevent any flashing
  useIsoLayoutEffect(() => {
    registerChild(idAttribute, itemId);

    return () => {
      unregisterChild(idAttribute);
      unregisterChild(idAttribute);
    };
  }, [store, registerChild, unregisterChild, idAttribute, itemId]);

  useIsoLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useIsoLayoutEffect(() => {
    const remove = store.jsxItems.upsertJSXItem(
      {
        id: itemId,
        idAttribute: id,
        parentId,
        expandable,
        disabled,
        selectable: !disableSelection,
      },
      ownerTokenRef.current,
    );

    return () => {
      // Only remove the item if the component is unmounting, not if the dependencies are changing.
      if (!isMountedRef.current) {
        remove();
      }
    };
  }, [store, parentId, itemId, expandable, disabled, disableSelection, id, ownerTokenRef]);

  React.useEffect(() => {
    if (label) {
      return store.jsxItems.mapLabelFromJSX(
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

export const jsxItemsitemWrapper: TreeItemWrapper<SimpleTreeViewStore<any>> = ({
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
