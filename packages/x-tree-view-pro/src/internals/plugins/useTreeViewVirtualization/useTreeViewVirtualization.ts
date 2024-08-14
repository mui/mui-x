import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerWindow from '@mui/utils/ownerWindow';
import { throttle } from '@mui/x-internals/throttle';
import {
  warnOnce,
  clamp,
  TreeViewPlugin,
  TREE_VIEW_ROOT_PARENT_ID,
  TreeViewItemToRenderProps,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import {
  UseTreeViewVirtualizationElementSize,
  UseTreeViewVirtualizationInstance,
  UseTreeViewVirtualizationRenderContext,
  UseTreeViewVirtualizationSignature,
} from './useTreeViewVirtualization.types';
import {
  areElementSizesEqual,
  getBufferFromScrollDirection,
} from './useTreeViewVirtualization.utils';

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = ({
  params,
  state,
  instance,
  rootRef,
  setState,
  experimentalFeatures,
}) => {
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);
  const rootDimensionsRef = React.useRef<UseTreeViewVirtualizationElementSize | undefined>(
    undefined,
  );
  const itemCount = Object.keys(state.items.itemMap).length;

  const getDimensions = () => state.virtualization;

  const updateDimensions = useEventCallback(() => {
    if (!rootRef.current || !rootDimensionsRef.current) {
      return;
    }

    const viewportHeight = rootDimensionsRef.current.height;

    setState((prevState) => ({
      ...prevState,
      virtualization: {
        viewportHeight,
        contentSize: itemCount * params.itemsHeight,
      },
    }));
  });

  const throttledUpdateDimensions = React.useMemo(
    () => throttle(updateDimensions, params.resizeThrottleMs),
    [params.resizeThrottleMs, updateDimensions],
  );

  const handleResizeRoot = () => {
    const element = rootRef.current;
    if (!element) {
      return;
    }

    const computedStyle = ownerWindow(element).getComputedStyle(element);

    const newSize = {
      width: parseFloat(computedStyle.width) || 0,
      height: parseFloat(computedStyle.height) || 0,
    };

    const prevDimensions = rootDimensionsRef.current;
    rootDimensionsRef.current = newSize;

    if (!prevDimensions || !areElementSizesEqual(prevDimensions, newSize)) {
      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (process.env.NODE_ENV !== 'production') {
        if (newSize.height === 0 && !isJSDOM) {
          warnOnce([
            'MUI X: The parent DOM element of the tree view has an empty height.',
            'Please make sure that this element has an intrinsic height.',
            'The tree view displays with a height of 0px.',
            '',
            // TODO: Add a link to the tree view docs
            'More details: https://mui.com/r/x-data-grid-no-dimensions.',
          ]);
        }
      }

      if (prevDimensions == null) {
        // We want to initialize the Tree View dimensions as soon as possible to avoid flickering
        updateDimensions();
      } else {
        throttledUpdateDimensions();
      }
    }
  };

  const isItemExpanded = instance.isItemExpanded;
  const flatItemIds = React.useMemo(() => {
    if (!experimentalFeatures.virtualization) {
      return [];
    }

    const itemOrderedChildrenIds = state.items.itemOrderedChildrenIds;

    const addChildrenToItem = (itemId: TreeViewItemId): TreeViewItemId[] => {
      if (isItemExpanded(itemId)) {
        return [itemId, ...(itemOrderedChildrenIds[itemId] ?? []).flatMap(addChildrenToItem)];
      }

      return [itemId];
    };

    return (itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID] ?? []).flatMap(addChildrenToItem);
  }, [state.items.itemOrderedChildrenIds, experimentalFeatures.virtualization, isItemExpanded]);

  const computeRenderContext: UseTreeViewVirtualizationInstance['computeRenderContext'] = ({
    scrollPositionPx,
    scrollDirection,
  }) => {
    const clampItemIndex = (itemIndex: number) => clamp(itemIndex, 0, itemCount - 1);

    const scrollBuffer = getBufferFromScrollDirection({
      scrollBufferPx: params.scrollBufferPx,
      verticalBuffer: params.itemsHeight * 15,
      scrollDirection,
    });

    const firstItemIndex = clampItemIndex(
      Math.floor((scrollPositionPx - params.scrollBufferPx) / params.itemsHeight) -
        scrollBuffer.itemsBefore,
    );

    const lastItemIndex = clampItemIndex(
      Math.ceil(
        (scrollPositionPx + state.virtualization.viewportHeight + params.scrollBufferPx) /
          params.itemsHeight,
      ) + scrollBuffer.itemsAfter,
    );

    return {
      firstItemIndex,
      lastItemIndex,
    };
  };

  const getItemsToRenderWithVirtualization = (
    renderContext: UseTreeViewVirtualizationRenderContext,
  ) => {
    const itemsToRender = flatItemIds.slice(
      renderContext.firstItemIndex,
      renderContext.lastItemIndex + 1,
    );

    const itemsToRenderSet = new Set(itemsToRender);
    const itemsToRenderWithVisibleContent = new Set(itemsToRenderSet);

    const addItem = (itemId: TreeViewItemId | null | undefined) => {
      if (itemId == null || itemsToRenderSet.has(itemId)) {
        return;
      }

      itemsToRenderSet.add(itemId);
      itemsToRender.push(itemId);
    };

    addItem(state.focusedItemId);
    addItem(state.itemsReordering?.draggedItemId);

    const getPropsFromItemId = (
      id: TreeViewItemId,
      isAncestor: boolean,
    ): TreeViewItemToRenderProps => {
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label!,
        itemId: item.id,
        id: item.idAttribute,
        children: isAncestor ? [] : undefined,
        isContentHidden: !itemsToRenderWithVisibleContent.has(id),
      };
    };

    const tree: TreeViewItemToRenderProps[] = [];
    for (const itemId of itemsToRender) {
      const ancestors: TreeViewItemId[] = [];
      let currentItemId: TreeViewItemId | null = state.items.itemMetaMap[itemId].parentId;
      while (currentItemId != null) {
        ancestors.push(currentItemId);
        currentItemId = state.items.itemMetaMap[currentItemId]?.parentId ?? null;
      }

      let subTree = tree;
      while (ancestors.length > 0) {
        const parentId = ancestors.pop()!;
        const parentInTree = subTree.find((props) => props.itemId === parentId);
        if (parentInTree == null) {
          const newParentIdTree = getPropsFromItemId(parentId, true);
          subTree.push(newParentIdTree);
          subTree = newParentIdTree.children!;
        } else {
          if (!parentInTree.children) {
            parentInTree.children = [];
          }
          subTree = parentInTree.children;
        }
      }

      subTree.push(getPropsFromItemId(itemId, false));
    }

    return tree;
  };

  return {
    instance: {
      getDimensions,
      handleResizeRoot,
      computeRenderContext,
      getItemsToRenderWithVirtualization,
    },
    contextValue: {
      virtualization: {
        enabled: experimentalFeatures.virtualization ?? false,
        virtualScrollerRef,
        itemsHeight: params.itemsHeight,
      },
    },
  };
};

useTreeViewVirtualization.getDefaultizedParams = (params) => ({
  ...params,
  scrollBufferPx: params.scrollBufferPx ?? 150,
  itemsHeight: params.itemsHeight ?? 32,
  resizeThrottleMs: params.resizeThrottleMs ?? 60,
});

useTreeViewVirtualization.getInitialState = () => ({
  virtualization: { contentSize: 0, viewportHeight: 0 },
});

useTreeViewVirtualization.params = {
  scrollBufferPx: true,
  itemsHeight: true,
  resizeThrottleMs: true,
};
