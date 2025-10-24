import * as React from 'react';
import { SimpleTreeViewParameters } from '../internals/SimpleTreeViewStore/SimpleTreeViewStore.types';

export function useExtractSimpleTreeViewParameters<
  Multiple extends boolean | undefined,
  P extends SimpleTreeViewParameters<Multiple>,
>(props: P): UseExtractSimpleTreeViewParametersReturnValue<Multiple, P> {
  const {
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

  const parameters: SimpleTreeViewParameters<Multiple> = React.useMemo(
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
    parameters,
    forwardedProps: forwardedProps as Omit<P, keyof SimpleTreeViewParameters<Multiple>>,
  };
}

interface UseExtractSimpleTreeViewParametersReturnValue<
  Multiple extends boolean | undefined,
  P extends SimpleTreeViewParameters<Multiple>,
> {
  parameters: SimpleTreeViewParameters<Multiple>;
  forwardedProps: Omit<P, keyof SimpleTreeViewParameters<Multiple>>;
}
