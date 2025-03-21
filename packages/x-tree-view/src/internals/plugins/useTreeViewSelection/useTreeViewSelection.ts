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
  UseTreeViewSelectionInstance,
  UseTreeViewSelectionParameters,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import {
  convertSelectedItemsToArray,
  propagateSelection,
  getAddedAndRemovedItems,
  getLookupFromArray,
  createSelectedItemsMap,
} from './useTreeViewSelection.utils';
import {
  selectorIsItemSelected,
  selectorIsMultiSelectEnabled,
  selectorIsSelectionEnabled,
} from './useTreeViewSelection.selectors';
import { useTreeViewSelectionItemPlugin } from './useTreeViewSelection.itemPlugin';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({
  store,
  params,
  models,
}) => {
  const lastSelectedItem = React.useRef<string | null>(null);
  const lastSelectedRange = React.useRef<{ [itemId: string]: boolean }>({});

  const setSelectedItems = (
    event: React.SyntheticEvent | null,
    newModel: typeof params.defaultSelectedItems,
    additionalItemsToPropagate?: TreeViewItemId[],
  ) => {
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
        oldModel: models.selectedItems.value as string[],
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
          oldModel: models.selectedItems.value as string[],
        });

        if (params.onItemSelectionToggle) {
          changes.added.forEach((itemId) => {
            params.onItemSelectionToggle!(event, itemId, true);
          });

          changes.removed.forEach((itemId) => {
            params.onItemSelectionToggle!(event, itemId, false);
          });
        }
      } else if (params.onItemSelectionToggle && cleanModel !== models.selectedItems.value) {
        if (models.selectedItems.value != null) {
          params.onItemSelectionToggle(event, models.selectedItems.value as string, false);
        }
        if (cleanModel != null) {
          params.onItemSelectionToggle(event, cleanModel as string, true);
        }
      }
    }

    if (params.onSelectedItemsChange) {
      params.onSelectedItemsChange(event, cleanModel);
    }

    models.selectedItems.setControlledValue(cleanModel);
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

    let newSelected: typeof models.selectedItems.value;
    const isMultiSelectEnabled = selectorIsMultiSelectEnabled(store.value);
    if (keepExistingSelection) {
      const cleanSelectedItems = convertSelectedItemsToArray(models.selectedItems.value);
      const isSelectedBefore = selectorIsItemSelected(store.value, itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = cleanSelectedItems.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(cleanSelectedItems);
      } else {
        newSelected = cleanSelectedItems;
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

    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();

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

    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();

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
        rawSelectedItems: models.selectedItems.value,
        // Only re-compute the map when the model changes.
        selectedItemsMap:
          prevState.selection.rawSelectedItems === models.selectedItems.value
            ? prevState.selection.selectedItemsMap
            : createSelectedItemsMap(models.selectedItems.value),
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
    models.selectedItems.value,
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

useTreeViewSelection.models = {
  selectedItems: {
    getDefaultValue: (params) => params.defaultSelectedItems,
  },
};

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

useTreeViewSelection.getInitialState = (params) => {
  const rawSelectedItems =
    params.selectedItems === undefined ? params.defaultSelectedItems : params.selectedItems;

  return {
    selection: {
      rawSelectedItems,
      selectedItemsMap: createSelectedItemsMap(rawSelectedItems),
      isEnabled: !params.disableSelection,
      isMultiSelectEnabled: params.multiSelect,
      isCheckboxSelectionEnabled: params.checkboxSelection,
      selectionPropagation: params.selectionPropagation,
    },
  };
};

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
