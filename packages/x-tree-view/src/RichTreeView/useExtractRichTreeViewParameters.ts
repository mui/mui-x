import * as React from 'react';
import { TreeViewValidItem } from '../models';
import { RichTreeViewProps } from './RichTreeView.types';
import { UseTreeViewStoreParameters } from '../internals/hooks/useTreeViewStore';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';

export function useExtractRichTreeViewParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(props: RichTreeViewProps<R, Multiple>) {
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

    // Forwarded props
    ...forwardedProps
  } = props;

  const parameters: UseTreeViewStoreParameters<RichTreeViewStore<R, Multiple>> = React.useMemo(
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
