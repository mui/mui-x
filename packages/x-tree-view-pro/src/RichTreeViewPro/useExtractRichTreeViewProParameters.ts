import * as React from 'react';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { RichTreeViewProParameters } from '../internals/RichTreeViewProStore';

export function useExtractRichTreeViewProParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  P extends RichTreeViewProParameters<R, Multiple>,
>(props: P): UseExtractRichTreeViewProParametersReturnValue<R, Multiple, P> {
  const {
    // Shared parameters
    disabledItemsFocusable,
    items,
    isItemDisabled,
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

  const parameters: RichTreeViewProParameters<R, Multiple> = React.useMemo(
    () => ({
      // Shared parameters
      disabledItemsFocusable,
      items,
      isItemDisabled,
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
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof RichTreeViewProParameters<R, Multiple>>,
  };
}

interface UseExtractRichTreeViewProParametersReturnValue<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  P extends RichTreeViewProParameters<R, Multiple>,
> {
  parameters: RichTreeViewProParameters<R, Multiple>;
  forwardedProps: Omit<P, keyof RichTreeViewProParameters<R, Multiple>>;
}
