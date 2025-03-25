import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import {
  findOrderInTremauxTree,
  getAllNavigableItems,
  getFirstNavigableItem,
  getLastNavigableItem,
  getNonDisabledItemsInRange,
} from '../../utils/tree';
import {
  TreeViewSelectionValue,
  UseTreeViewSelectionInstance,
  UseTreeViewSelectionParameters,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import {
  propagateSelection,
  getAddedAndRemovedItems,
  getLookupFromArray,
} from './useTreeViewSelection.utils';
import {
  selectorIsItemSelected,
  selectorIsMultiSelectEnabled,
  selectorIsSelectionEnabled,
  selectorSelectionModel,
  selectorSelectionModelArray,
} from './useTreeViewSelection.selectors';
import { useTreeViewSelectionItemPlugin } from './useTreeViewSelection.itemPlugin';
import { useAssertModelConsistency } from '../../utils/models';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({
  store,
  params,
}) => {
  useAssertModelConsistency({
    state: 'selectedItems',
    controlled: params.selectedItems,
    defaultValue: params.defaultSelectedItems,
  });

  const lastSelectedItem = React.useRef<string | null>(null);
  const lastSelectedRange = React.useRef<{ [itemId: string]: boolean }>({});

  const setSelectedItems = (
    event: React.SyntheticEvent | null,
    newModel: typeof params.defaultSelectedItems,
    additionalItemsToPropagate?: TreeViewItemId[],
  ) => {
    const oldModel = selectorSelectionModel(store.value);
    let cleanModel: typeof newModel;
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);

    if (
      isMultiSelectEnabled &&
      (params.selectionPropagation.descendants || params.selectionPropagation.parents)
    ) {
      cleanModel = propagateSelection({
        store,
        selectionPropagation: params.selectionPropagation,
        newModel: newModel as string[],
        oldModel: oldModel as string[],
        additionalItemsToPropagate,
      });
    } else {
      cleanModel = newModel;
    }

    if (params.onItemSelectionToggle) {
      if (isMultiSelectEnabled) {
        const changes = getAddedAndRemovedItems({
          store,
          newModel: cleanModel as string[],
          oldModel: oldModel as string[],
        });

        if (params.onItemSelectionToggle) {
          changes.added.forEach((itemId) => {
            params.onItemSelectionToggle!(event, itemId, true);
          });

          changes.removed.forEach((itemId) => {
            params.onItemSelectionToggle!(event, itemId, false);
          });
        }
      } else if (params.onItemSelectionToggle && cleanModel !== oldModel) {
        if (oldModel != null) {
          params.onItemSelectionToggle(event, oldModel as string, false);
        }
        if (cleanModel != null) {
          params.onItemSelectionToggle(event, cleanModel as string, true);
        }
      }
    }

    if (params.selectedItems === undefined) {
      store.update((prevState) => ({
        ...prevState,
        selection: { ...prevState.selection, selectedItems: cleanModel },
      }));
    }

    params.onSelectedItemsChange?.(event, cleanModel);
  };

  const setItemSelection: UseTreeViewSelectionInstance['setItemSelection'] = ({
    itemId,
    event = null,
    keepExistingSelection = false,
    shouldBeSelected,
  }) => {
    if (!selectorIsSelectionEnabled(store.value)) {
      return;
    }

    let newSelected: TreeViewSelectionValue<boolean>;
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);
    if (keepExistingSelection) {
      const oldSelected = selectorSelectionModelArray(store.value);
      const isSelectedBefore = selectorIsItemSelected(store.value, itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = oldSelected.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(oldSelected);
      } else {
        newSelected = oldSelected;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (
        shouldBeSelected === false ||
        (shouldBeSelected == null && selectorIsItemSelected(store.value, itemId))
      ) {
        newSelected = isMultiSelectEnabled ? [] : null;
      } else {
        newSelected = isMultiSelectEnabled ? [itemId] : itemId;
      }
    }

    setSelectedItems(
      event,
      newSelected,
      // If shouldBeSelected === selectorIsItemSelected(store, itemId), we still want to propagate the select.
      // This is useful when the element is in an indeterminate state.
      [itemId],
    );
    lastSelectedItem.current = itemId;
    lastSelectedRange.current = {};
  };

  const selectRange = (event: React.SyntheticEvent, [start, end]: [string, string]) => {
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectorSelectionModelArray(store.value).slice();

    // If the last selection was a range selection,
    // remove the items that were part of the last range from the model
    if (Object.keys(lastSelectedRange.current).length > 0) {
      newSelectedItems = newSelectedItems.filter((id) => !lastSelectedRange.current[id]);
    }

    // Add to the model the items that are part of the new range and not already part of the model.
    const selectedItemsLookup = getLookupFromArray(newSelectedItems);
    const range = getNonDisabledItemsInRange(store.value, start, end);
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);

    setSelectedItems(event, newSelectedItems);
    lastSelectedRange.current = getLookupFromArray(range);
  };

  const expandSelectionRange = (event: React.SyntheticEvent, itemId: string) => {
    if (lastSelectedItem.current != null) {
      const [start, end] = findOrderInTremauxTree(store.value, itemId, lastSelectedItem.current);
      selectRange(event, [start, end]);
    }
  };

  const selectRangeFromStartToItem = (event: React.SyntheticEvent, itemId: string) => {
    selectRange(event, [getFirstNavigableItem(store.value), itemId]);
  };

  const selectRangeFromItemToEnd = (event: React.SyntheticEvent, itemId: string) => {
    selectRange(event, [itemId, getLastNavigableItem(store.value)]);
  };

  const selectAllNavigableItems = (event: React.SyntheticEvent) => {
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);
    if (!isMultiSelectEnabled) {
      return;
    }

    const navigableItems = getAllNavigableItems(store.value);
    setSelectedItems(event, navigableItems);

    lastSelectedRange.current = getLookupFromArray(navigableItems);
  };

  const selectItemFromArrowNavigation = (
    event: React.SyntheticEvent,
    currentItem: string,
    nextItem: string,
  ) => {
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectorSelectionModelArray(store.value).slice();

    if (Object.keys(lastSelectedRange.current).length === 0) {
      newSelectedItems.push(nextItem);
      lastSelectedRange.current = { [currentItem]: true, [nextItem]: true };
    } else {
      if (!lastSelectedRange.current[currentItem]) {
        lastSelectedRange.current = {};
      }

      if (lastSelectedRange.current[nextItem]) {
        newSelectedItems = newSelectedItems.filter((id) => id !== currentItem);
        delete lastSelectedRange.current[currentItem];
      } else {
        newSelectedItems.push(nextItem);
        lastSelectedRange.current[nextItem] = true;
      }
    }

    setSelectedItems(event, newSelectedItems);
  };

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      selection: {
        selectedItems:
          params.selectedItems === undefined
            ? prevState.selection.selectedItems
            : params.selectedItems,
        isEnabled: !params.disableSelection,
        isMultiSelectEnabled: params.multiSelect,
        isCheckboxSelectionEnabled: params.checkboxSelection,
        selectionPropagation: {
          descendants: params.selectionPropagation.descendants,
          parents: params.selectionPropagation.parents,
        },
      },
    }));
  }, [
    store,
    params.selectedItems,
    params.multiSelect,
    params.checkboxSelection,
    params.disableSelection,
    params.selectionPropagation.descendants,
    params.selectionPropagation.parents,
  ]);

  return {
    getRootProps: () => ({
      'aria-multiselectable': params.multiSelect,
    }),
    publicAPI: {
      setItemSelection,
    },
    instance: {
      setItemSelection,
      selectAllNavigableItems,
      expandSelectionRange,
      selectRangeFromStartToItem,
      selectRangeFromItemToEnd,
      selectItemFromArrowNavigation,
    },
  };
};

useTreeViewSelection.itemPlugin = useTreeViewSelectionItemPlugin;

const DEFAULT_SELECTED_ITEMS: string[] = [];

const EMPTY_SELECTION_PROPAGATION: UseTreeViewSelectionParameters<true>['selectionPropagation'] =
  {};

useTreeViewSelection.getDefaultizedParams = ({ params }) => ({
  ...params,
  disableSelection: params.disableSelection ?? false,
  multiSelect: params.multiSelect ?? false,
  checkboxSelection: params.checkboxSelection ?? false,
  defaultSelectedItems:
    params.defaultSelectedItems ?? (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null),
  selectionPropagation: params.selectionPropagation ?? EMPTY_SELECTION_PROPAGATION,
});

useTreeViewSelection.getInitialState = (params) => ({
  selection: {
    selectedItems:
      params.selectedItems === undefined ? params.defaultSelectedItems : params.selectedItems,
    isEnabled: !params.disableSelection,
    isMultiSelectEnabled: params.multiSelect,
    isCheckboxSelectionEnabled: params.checkboxSelection,
    selectionPropagation: params.selectionPropagation,
  },
});

useTreeViewSelection.params = {
  disableSelection: true,
  multiSelect: true,
  checkboxSelection: true,
  defaultSelectedItems: true,
  selectedItems: true,
  onSelectedItemsChange: true,
  onItemSelectionToggle: true,
  selectionPropagation: true,
};
