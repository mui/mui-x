import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerWindow from '@mui/utils/ownerWindow';
import {
  buildWarning,
  clamp,
  TreeViewPlugin,
  TREE_VIEW_ROOT_PARENT_ID,
  TreeViewItemToRenderProps,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import {
  UseTreeViewVirtualizationElementSize,
  UseTreeViewVirtualizationRenderContext,
  UseTreeViewVirtualizationSignature,
} from './useTreeViewVirtualization.types';
import { areElementSizesEqual } from './useTreeViewVirtualization.utils';
import { throttle } from './throttle';

const emptyParentHeightWarning = buildWarning([
  'The parent DOM element of the data grid has an empty height.',
  'Please make sure that this element has an intrinsic height.',
  'The grid displays with a height of 0px.',
  '',
  'More details: https://mui.com/r/x-data-grid-no-dimensions.',
]);

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = ({
  params,
  state,
  rootRef,
  setState,
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

      if (newSize.height === 0 && !isJSDOM) {
        emptyParentHeightWarning();
      }

      if (prevDimensions == null) {
        // We want to initialize the Tree View dimensions as soon as possible to avoid flickering
        updateDimensions();
      } else {
        throttledUpdateDimensions();
      }
    }
  };

  const flatItemIds = React.useMemo(() => {
    const itemOrderedChildrenIds = state.items.itemOrderedChildrenIds;

    const addChildrenToItem = (itemId: TreeViewItemId): TreeViewItemId[] => {
      return [itemId, ...(itemOrderedChildrenIds[itemId] ?? []).flatMap(addChildrenToItem)];
    };

    return (itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID] ?? []).flatMap(addChildrenToItem);
  }, [state.items.itemOrderedChildrenIds]);

  const computeRenderContext = React.useCallback(
    (scrollPositionPx: number): UseTreeViewVirtualizationRenderContext => {
      const clampItemIndex = (itemIndex: number) => clamp(itemIndex, 0, itemCount - 1);

      const firstItemIndex = clampItemIndex(
        Math.floor((scrollPositionPx - params.scrollBufferPx) / params.itemsHeight),
      );

      const lastItemIndex = clampItemIndex(
        Math.ceil(
          (scrollPositionPx + state.virtualization.viewportHeight + params.scrollBufferPx) /
            params.itemsHeight,
        ),
      );

      return {
        firstItemIndex,
        lastItemIndex,
      };
    },
    [itemCount, params.itemsHeight, params.scrollBufferPx, state.virtualization.viewportHeight],
  );

  const getItemsToRenderWithVirtualization = (
    renderContext: UseTreeViewVirtualizationRenderContext,
  ) => {
    const itemsToRender = flatItemIds.slice(
      renderContext.firstItemIndex,
      renderContext.lastItemIndex + 1,
    );

    const getPropsFromItemId = (id: TreeViewItemId): TreeViewItemToRenderProps => {
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label!,
        itemId: item.id,
        id: item.idAttribute,
        children: [],
      };
    };

    return itemsToRender.map(getPropsFromItemId);
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
        virtualScrollerRef,
        scrollBufferPx: params.scrollBufferPx,
        itemsHeight: params.itemsHeight,
      },
    },
  };
};

useTreeViewVirtualization.getDefaultizedParams = (params) => ({
  ...params,
  enableVirtualization: params.enableVirtualization ?? false,
  scrollBufferPx: params.scrollBufferPx ?? 150,
  itemsHeight: params.itemsHeight ?? 32,
  resizeThrottleMs: params.resizeThrottleMs ?? 60,
});

useTreeViewVirtualization.getInitialState = () => ({
  virtualization: { contentSize: 0, viewportHeight: 0 },
});

useTreeViewVirtualization.params = {
  enableVirtualization: true,
  scrollBufferPx: true,
  itemsHeight: true,
  resizeThrottleMs: true,
};
