import * as React from 'react';
import type { TreeViewValidItem } from '../models';
import type { RichTreeViewProps } from './RichTreeView.types';
import type { UseTreeViewStoreParameters } from '../internals/hooks/useTreeViewStore';
import type { RichTreeViewStore } from '../internals/RichTreeViewStore';

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
    itemHeight,

    // RichTreeViewStore parameters
    onItemLabelChange,
    isItemEditable,
    domStructure,

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
      itemHeight,

      // RichTreeViewStore parameters
      onItemLabelChange,
      isItemEditable,
      domStructure,
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
