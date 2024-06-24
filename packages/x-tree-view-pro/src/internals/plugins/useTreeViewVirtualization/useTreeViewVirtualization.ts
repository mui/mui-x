import * as React from 'react';
import { clamp, TreeViewPlugin } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from './useTreeViewVirtualization.types';

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = ({
  params,
  state,
}) => {
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);

  const itemCount = Object.keys(state.items.itemMap).length;
  const computeRenderContext = React.useCallback(
    (scrollPositionPx: number) => {
      const clampItemIndex = (itemIndex: number) => clamp(itemIndex, 0, itemCount - 1);

      return {
        firstItemIndex: clampItemIndex(
          (scrollPositionPx - params.scrollBufferPx) / params.itemsHeight,
        ),
        lastItemIndex: clampItemIndex(
          (scrollPositionPx + state.virtualization.viewportHeight + params.scrollBufferPx) /
            params.itemsHeight,
        ),
      };
    },
    [itemCount, params.itemsHeight, params.scrollBufferPx, state.virtualization.viewportHeight],
  );

  return {
    instance: {
      getDimensions: () => state.virtualization,
      computeRenderContext,
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
});

useTreeViewVirtualization.getInitialState = () => ({
  virtualization: { contentSize: 0, viewportHeight: 0 },
});

useTreeViewVirtualization.params = {
  enableVirtualization: true,
  scrollBufferPx: true,
  itemsHeight: true,
};
