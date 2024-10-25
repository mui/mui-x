import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsDefaultizedParameters,
  UseTreeViewItemsState,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import {
  selectorIsItemDisabled,
  selectorItemMap,
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from './useTreeViewItems.selectors';
import { selectorTreeViewId } from '../../corePlugins/useTreeViewId/useTreeViewId.selectors';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';

interface UpdateNodesStateParameters
  extends Pick<
    UseTreeViewItemsDefaultizedParameters<TreeViewBaseItem>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {}

type State = UseTreeViewItemsState<any>['items'];
const updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
}: UpdateNodesStateParameters): State => {
  const itemMetaMap: State['itemMetaMap'] = {};
  const itemMap: State['itemMap'] = {};
  const itemOrderedChildrenIds: State['itemOrderedChildrenIds'] = {
    [TREE_VIEW_ROOT_PARENT_ID]: [],
  };

  const processItem = (item: TreeViewBaseItem, depth: number, parentId: string | null) => {
    const id: string = getItemId ? getItemId(item) : (item as any).id;

    if (id == null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          'An item was provided without id in the `items` prop:',
          JSON.stringify(item),
        ].join('\n'),
      );
    }

    if (itemMetaMap[id] != null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          `Two items were provided with the same id in the \`items\` prop: "${id}"`,
        ].join('\n'),
      );
    }

    const label = getItemLabel ? getItemLabel(item) : (item as { label: string }).label;
    if (label == null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.',
          'An item was provided without label in the `items` prop:',
          JSON.stringify(item),
        ].join('\n'),
      );
    }

    itemMetaMap[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth,
    };

    itemMap[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIds[parentIdWithDefault]) {
      itemOrderedChildrenIds[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIds[parentIdWithDefault].push(id);

    item.children?.forEach((child) => processItem(child, depth + 1, id));
  };

  items.forEach((item) => processItem(item, 0, null));

  const itemChildrenIndexes: State['itemChildrenIndexes'] = {};
  Object.keys(itemOrderedChildrenIds).forEach((parentId) => {
    itemChildrenIndexes[parentId] = buildSiblingIndexes(itemOrderedChildrenIds[parentId]);
  });

  return {
    itemMetaMap,
    itemMap,
    itemOrderedChildrenIds,
    itemChildrenIndexes,
  };
};

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  store,
  experimentalFeatures,
}) => {
  const getItem = React.useCallback(
    (itemId: string) => selectorItemMap(store.value)[itemId],
    [store],
  );

  const getItemTree = React.useCallback(() => {
    const getItemFromItemId = (itemId: TreeViewItemId): TreeViewBaseItem => {
      const { children: oldChildren, ...item } = selectorItemMap(store.value)[itemId];
      const newChildren = selectorItemOrderedChildrenIds(store.value, itemId);
      if (newChildren.length > 0) {
        item.children = newChildren.map(getItemFromItemId);
      }

      return item;
    };

    return selectorItemOrderedChildrenIds(store.value, null).map(getItemFromItemId);
  }, [store]);

  const getItemOrderedChildrenIds = React.useCallback(
    (itemId: string | null) => selectorItemOrderedChildrenIds(store.value, itemId),
    [store],
  );

  const getItemDOMElement = (itemId: string) => {
    const itemMeta = selectorItemMeta(store.value, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = generateTreeItemIdAttribute({
      treeId: selectorTreeViewId(store.value),
      itemId,
      id: itemMeta.idAttribute,
    });
    return document.getElementById(idAttribute);
  };

  const isItemNavigable = (itemId: string) => {
    if (params.disabledItemsFocusable) {
      return true;
    }
    return !selectorIsItemDisabled(store.value, itemId);
  };

  const areItemUpdatesPreventedRef = React.useRef(false);
  const preventItemUpdates = React.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);

  const areItemUpdatesPrevented = React.useCallback(() => areItemUpdatesPreventedRef.current, []);

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    store.update((prevState) => {
      const newState = updateItemsState({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
      });

      Object.values(prevState.items.itemMetaMap).forEach((item) => {
        if (!newState.itemMetaMap[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });

      return { ...prevState, items: newState };
    });
  }, [instance, store, params.items, params.isItemDisabled, params.getItemId, params.getItemLabel]);

  // Wrap `props.onItemClick` with `useEventCallback` to prevent unneeded context updates.
  const handleItemClick = useEventCallback((event: React.MouseEvent, itemId: string) => {
    if (params.onItemClick) {
      params.onItemClick(event, itemId);
    }
  });

  const pluginContextValue = React.useMemo(
    () => ({
      items: {
        onItemClick: handleItemClick,
        disabledItemsFocusable: params.disabledItemsFocusable,
        indentationAtItemLevel: experimentalFeatures.indentationAtItemLevel ?? false,
      },
    }),
    [handleItemClick, params.disabledItemsFocusable, experimentalFeatures.indentationAtItemLevel],
  );

  return {
    getRootProps: () => ({
      style: {
        '--TreeView-itemChildrenIndentation':
          typeof params.itemChildrenIndentation === 'number'
            ? `${params.itemChildrenIndentation}px`
            : params.itemChildrenIndentation,
      } as React.CSSProperties,
    }),
    publicAPI: {
      getItem,
      getItemDOMElement,
      getItemTree,
      getItemOrderedChildrenIds,
    },
    instance: {
      getItemDOMElement,
      isItemNavigable,
      preventItemUpdates,
      areItemUpdatesPrevented,
    },
    contextValue: pluginContextValue,
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: updateItemsState({
    items: params.items,
    isItemDisabled: params.isItemDisabled,
    getItemId: params.getItemId,
    getItemLabel: params.getItemLabel,
  }),
});

useTreeViewItems.getDefaultizedParams = ({ params }) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  itemChildrenIndentation: params.itemChildrenIndentation ?? '12px',
});

useTreeViewItems.wrapRoot = ({ children, store }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contextValue = React.useCallback(
    (itemId: TreeViewItemId) => selectorItemMeta(store.value, itemId)?.depth ?? 0,
    [store],
  );
  return (
    <TreeViewItemDepthContext.Provider value={contextValue}>
      {children}
    </TreeViewItemDepthContext.Provider>
  );
};

useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
  onItemClick: true,
  itemChildrenIndentation: true,
};
