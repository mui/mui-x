import * as React from 'react';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { UseTreeViewStoreParameters } from '@mui/x-tree-view/internals';
import { RichTreeViewProStore } from '../internals/RichTreeViewProStore';
import { RichTreeViewProProps } from './RichTreeViewPro.types';

export function useExtractRichTreeViewProParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(props: RichTreeViewProProps<R, Multiple>) {
  const {
    // Props for Provider
    apiRef,
    slots,
    slotProps,

    // Shared parameters
    disabledItemsFocusable,
    items,
    isItemDisabled,
    isItemSelectionDisabled,
    getItemLabel,
    getItemChildren,
    getItemId,
    onItemClick,
    itemChildrenIndentation,
    id,
    expandedItems,
    defaultExpandedItems,
    onExpandedItemsChange,
    onItemExpansionToggle,
    expansionTrigger,
    disableSelection,
    selectedItems,
    defaultSelectedItems,
    multiSelect,
    checkboxSelection,
    selectionPropagation,
    onSelectedItemsChange,
    onItemSelectionToggle,
    onItemFocus,
    itemHeight,

    // RichTreeViewStore parameters
    onItemLabelChange,
    isItemEditable,
    domStructure,

    // RichTreeViewProStore parameters
    dataSource,
    dataSourceCache,
    onItemsLazyLoaded,
    itemsReordering,
    isItemReorderable,
    canMoveItemToNewPosition,
    onItemPositionChange,
    disableVirtualization,

    // Render-only props
    loading,
    loadingItemsCount,

    // Forwarded props
    ...forwardedProps
  } = props;

  const parameters: UseTreeViewStoreParameters<RichTreeViewProStore<R, Multiple>> = React.useMemo(
    () => ({
      // Shared parameters
      disabledItemsFocusable,
      items,
      isItemDisabled,
      isItemSelectionDisabled,
      getItemLabel,
      getItemChildren,
      getItemId,
      onItemClick,
      itemChildrenIndentation,
      id,
      expandedItems,
      defaultExpandedItems,
      onExpandedItemsChange,
      onItemExpansionToggle,
      expansionTrigger,
      disableSelection,
      selectedItems,
      defaultSelectedItems,
      multiSelect,
      checkboxSelection,
      selectionPropagation,
      onSelectedItemsChange,
      onItemSelectionToggle,
      onItemFocus,
      itemHeight,

      // RichTreeViewStore parameters
      onItemLabelChange,
      isItemEditable,
      domStructure,

      // RichTreeViewProStore parameters
      dataSource,
      dataSourceCache,
      onItemsLazyLoaded,
      itemsReordering,
      isItemReorderable,
      canMoveItemToNewPosition,
      onItemPositionChange,
      disableVirtualization,
    }),
    [
      // Shared parameters
      disabledItemsFocusable,
      items,
      isItemDisabled,
      isItemSelectionDisabled,
      getItemLabel,
      getItemChildren,
      getItemId,
      onItemClick,
      itemChildrenIndentation,
      id,
      expandedItems,
      defaultExpandedItems,
      onExpandedItemsChange,
      onItemExpansionToggle,
      expansionTrigger,
      disableSelection,
      selectedItems,
      defaultSelectedItems,
      multiSelect,
      checkboxSelection,
      selectionPropagation,
      onSelectedItemsChange,
      onItemSelectionToggle,
      onItemFocus,
      itemHeight,

      // RichTreeViewStore parameters
      onItemLabelChange,
      isItemEditable,
      domStructure,

      // RichTreeViewProStore parameters
      dataSource,
      dataSourceCache,
      onItemsLazyLoaded,
      itemsReordering,
      isItemReorderable,
      canMoveItemToNewPosition,
      onItemPositionChange,
      disableVirtualization,
    ],
  );

  return {
    apiRef,
    slots,
    slotProps,
    parameters,
    forwardedProps,
    loading,
    loadingItemsCount,
  };
}
