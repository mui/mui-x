import * as React from 'react';
import { RichTreeViewParameters } from '../internals/RichTreeViewStore/RichTreeViewStore.types';
import { TreeViewValidItem } from '../models';

export function useExtractRichTreeViewParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  P extends RichTreeViewParameters<R, Multiple>,
>(props: P): UseExtractRichTreeViewParametersReturnValue<R, Multiple, P> {
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

    // Forwarded props
    ...forwardedProps
  } = props;

  const parameters: RichTreeViewParameters<R, Multiple> = React.useMemo(
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
    ],
  );

  return {
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof RichTreeViewParameters<R, Multiple>>,
  };
}

interface UseExtractRichTreeViewParametersReturnValue<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  P extends RichTreeViewParameters<R, Multiple>,
> {
  parameters: RichTreeViewParameters<R, Multiple>;
  forwardedProps: Omit<P, keyof RichTreeViewParameters<R, Multiple>>;
}
