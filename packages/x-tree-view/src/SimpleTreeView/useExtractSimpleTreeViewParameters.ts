import * as React from 'react';
import { SimpleTreeViewProps } from './SimpleTreeView.types';
import { UseTreeViewStoreParameters } from '../internals/hooks/useTreeViewStore';
import { SimpleTreeViewStore } from '../internals/SimpleTreeViewStore';

export function useExtractSimpleTreeViewParameters<Multiple extends boolean | undefined>(
  props: SimpleTreeViewProps<Multiple>,
) {
  const {
    // Props for Provider
    apiRef,
    slots,
    slotProps,

    // Shared parameters
    disabledItemsFocusable,
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

    // SimpleTreeViewStore parameters

    // Forwarded props
    ...forwardedProps
  } = props;

  const parameters: UseTreeViewStoreParameters<SimpleTreeViewStore<Multiple>> = React.useMemo(
    () => ({
      // Shared parameters
      disabledItemsFocusable,
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

      // SimpleTreeViewStore parameters
    }),
    [
      // Shared parameters
      disabledItemsFocusable,
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

      // SimpleTreeViewStore parameters
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
