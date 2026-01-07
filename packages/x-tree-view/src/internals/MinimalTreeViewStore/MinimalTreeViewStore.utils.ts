import { EMPTY_ARRAY, EMPTY_OBJECT } from '@base-ui/utils/empty';
import { TreeViewValidItem } from '../../models';
import { getExpansionTrigger } from '../plugins/expansion/utils';
import {
  MinimalTreeViewParameters,
  MinimalTreeViewState,
  TreeViewSelectionValue,
} from './MinimalTreeViewStore.types';
import { TreeViewItemsPlugin } from '../plugins/items';

/**
 * Returns the properties of the state that are derived from the parameters.
 * This do not contain state properties that don't update whenever the parameters update.
 */
export function deriveStateFromParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(parameters: MinimalTreeViewParameters<R, Multiple> & { isItemEditable?: any }) {
  return {
    disabledItemsFocusable: parameters.disabledItemsFocusable ?? false,
    domStructure: 'nested' as const,
    itemChildrenIndentation: parameters.itemChildrenIndentation ?? '12px',
    providedTreeId: parameters.id,
    // TODO: Fix
    expansionTrigger: getExpansionTrigger({
      isItemEditable: parameters.isItemEditable,
      expansionTrigger: parameters.expansionTrigger,
    }),
    disableSelection: parameters.disableSelection ?? false,
    multiSelect: parameters.multiSelect ?? false,
    checkboxSelection: parameters.checkboxSelection ?? false,
    selectionPropagation: parameters.selectionPropagation ?? EMPTY_OBJECT,
  };
}

function applyModelInitialValue<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  fallback: T,
): T {
  if (controlledValue !== undefined) {
    return controlledValue;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return fallback;
}

export function createMinimalInitialState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(parameters: MinimalTreeViewParameters<R, Multiple>): MinimalTreeViewState<R, Multiple> {
  return {
    treeId: undefined,
    focusedItemId: null,
    ...deriveStateFromParameters(parameters),
    ...TreeViewItemsPlugin.buildItemsStateIfNeeded(parameters),
    expandedItems: applyModelInitialValue(
      parameters.expandedItems,
      parameters.defaultExpandedItems,
      [],
    ),
    selectedItems: applyModelInitialValue(
      parameters.selectedItems,
      parameters.defaultSelectedItems,
      (parameters.multiSelect ? EMPTY_ARRAY : null) as TreeViewSelectionValue<Multiple>,
    ),
  };
}

let globalTreeViewDefaultId = 0;
export const createTreeViewDefaultId = () => {
  globalTreeViewDefaultId += 1;
  return `mui-tree-view-${globalTreeViewDefaultId}`;
};
