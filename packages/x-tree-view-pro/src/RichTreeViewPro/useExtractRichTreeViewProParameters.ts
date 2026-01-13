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

    // RichTreeViewStore parameters
    onItemLabelChange,
    isItemEditable,

    // RichTreeViewProStore parameters
    dataSource,
    dataSourceCache,
    itemsReordering,
    isItemReorderable,
    canMoveItemToNewPosition,
    onItemPositionChange,

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

      // RichTreeViewStore parameters
      onItemLabelChange,
      isItemEditable,

      // RichTreeViewProStore parameters
      dataSource,
      dataSourceCache,
      itemsReordering,
      isItemReorderable,
      canMoveItemToNewPosition,
      onItemPositionChange,
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

      // RichTreeViewStore parameters
      onItemLabelChange,
      isItemEditable,

      // RichTreeViewProStore parameters
      dataSource,
      dataSourceCache,
      itemsReordering,
      isItemReorderable,
      canMoveItemToNewPosition,
      onItemPositionChange,
    ],
  );

  return {
    apiRef,
    slots,
    slotProps,
    parameters,
    forwardedProps,
  };
}
