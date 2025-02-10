import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsDefaultizedParameters,
  UseTreeViewItemsState,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import {
  TreeViewBaseItem,
  TreeViewDefaultItemModelProperties,
  TreeViewItemId,
} from '../../../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
  selectorItemModel,
  selectorItemDepth,
} from './useTreeViewItems.selectors';
import { selectorTreeViewId } from '../../corePlugins/useTreeViewId/useTreeViewId.selectors';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';

interface UpdateItemsStateParameters
  extends Pick<
    UseTreeViewItemsDefaultizedParameters<TreeViewBaseItem>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId' | 'disabledItemsFocusable'
  > {}

type State = UseTreeViewItemsState<TreeViewDefaultItemModelProperties>['items'];
const updateItemsState = ({
  disabledItemsFocusable,
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
}: UpdateItemsStateParameters): State => {
  const itemMetaLookup: State['itemMetaLookup'] = {};
  const itemModelLookup: State['itemModelLookup'] = {};
  const itemOrderedChildrenIdsLookup: State['itemOrderedChildrenIdsLookup'] = {
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

    if (itemMetaLookup[id] != null) {
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

    itemMetaLookup[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth,
    };

    itemModelLookup[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIdsLookup[parentIdWithDefault]) {
      itemOrderedChildrenIdsLookup[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIdsLookup[parentIdWithDefault].push(id);

    item.children?.forEach((child) => processItem(child, depth + 1, id));
  };

  items.forEach((item) => processItem(item, 0, null));

  const itemChildrenIndexesLookup: State['itemChildrenIndexesLookup'] = {};
  Object.keys(itemOrderedChildrenIdsLookup).forEach((parentId) => {
    itemChildrenIndexesLookup[parentId] = buildSiblingIndexes(
      itemOrderedChildrenIdsLookup[parentId],
    );
  });

  return {
    disabledItemsFocusable,
    itemMetaLookup,
    itemModelLookup,
    itemOrderedChildrenIdsLookup,
    itemChildrenIndexesLookup,
  };
};

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  store,
}) => {
  const getItem = React.useCallback(
    (itemId: string) => selectorItemModel(store.value, itemId),
    [store],
  );

  const getItemTree = React.useCallback(() => {
    const getItemFromItemId = (itemId: TreeViewItemId): TreeViewBaseItem => {
      const item = selectorItemModel(store.value, itemId);
      const newChildren = selectorItemOrderedChildrenIds(store.value, itemId);
      if (newChildren.length > 0) {
        item.children = newChildren.map(getItemFromItemId);
      } else {
        delete item.children;
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
        disabledItemsFocusable: params.disabledItemsFocusable,
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
      });

      Object.values(prevState.items.itemMetaLookup).forEach((item) => {
        if (!newState.itemMetaLookup[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });

      return { ...prevState, items: newState };
    });
  }, [
    instance,
    store,
    params.items,
    params.disabledItemsFocusable,
    params.isItemDisabled,
    params.getItemId,
    params.getItemLabel,
  ]);

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
      },
    }),
    [handleItemClick],
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
      preventItemUpdates,
      areItemUpdatesPrevented,
    },
    contextValue: pluginContextValue,
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: updateItemsState({
    disabledItemsFocusable: params.disabledItemsFocusable,
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

useTreeViewItems.wrapRoot = ({ children }) => {
  return (
    <TreeViewItemDepthContext.Provider value={selectorItemDepth}>
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
