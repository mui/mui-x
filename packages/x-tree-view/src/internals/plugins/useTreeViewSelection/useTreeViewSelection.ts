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
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import {
  convertSelectedItemsToArray,
  getLookupFromArray,
  getSelectedItemsMap,
} from './useTreeViewSelection.utils';
import { selectorIsItemSelected } from './useTreeViewSelection.selectors';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({
  instance,
  store,
  params,
  models,
}) => {
  const lastSelectedItem = React.useRef<string | null>(null);
  const lastSelectedRange = React.useRef<{ [itemId: string]: boolean }>({});

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      selection: {
        selectedItemsMap: getSelectedItemsMap(models.selectedItems.value),
      },
    }));
  }, [store, models.selectedItems.value]);

  const setSelectedItems = (
    event: React.SyntheticEvent,
    newSelectedItems: typeof params.defaultSelectedItems,
  ) => {
    if (params.onItemSelectionToggle) {
      if (params.multiSelect) {
        const addedItems = (newSelectedItems as string[]).filter(
          (itemId) => !selectorIsItemSelected(store.value, itemId),
        );
        const removedItems = (models.selectedItems.value as string[]).filter(
          (itemId) => !(newSelectedItems as string[]).includes(itemId),
        );

        addedItems.forEach((itemId) => {
          params.onItemSelectionToggle!(event, itemId, true);
        });

        removedItems.forEach((itemId) => {
          params.onItemSelectionToggle!(event, itemId, false);
        });
      } else if (newSelectedItems !== models.selectedItems.value) {
        if (models.selectedItems.value != null) {
          params.onItemSelectionToggle(event, models.selectedItems.value as string, false);
        }
        if (newSelectedItems != null) {
          params.onItemSelectionToggle(event, newSelectedItems as string, true);
        }
      }
    }

    if (params.onSelectedItemsChange) {
      params.onSelectedItemsChange(event, newSelectedItems);
    }

    models.selectedItems.setControlledValue(newSelectedItems);
  };

  const selectItem: UseTreeViewSelectionInstance['selectItem'] = ({
    event,
    itemId,
    keepExistingSelection = false,
    shouldBeSelected,
  }) => {
    if (params.disableSelection) {
      return;
    }

    let newSelected: typeof models.selectedItems.value;
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
        newSelected = params.multiSelect ? [] : null;
      } else {
        newSelected = params.multiSelect ? [itemId] : itemId;
      }
    }

    setSelectedItems(event, newSelected);
    lastSelectedItem.current = itemId;
    lastSelectedRange.current = {};
  };

  const selectRange = (event: React.SyntheticEvent, [start, end]: [string, string]) => {
    if (params.disableSelection || !params.multiSelect) {
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
    const range = getNonDisabledItemsInRange(instance, start, end);
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);

    setSelectedItems(event, newSelectedItems);
    lastSelectedRange.current = getLookupFromArray(range);
  };

  const expandSelectionRange = (event: React.SyntheticEvent, itemId: string) => {
    if (lastSelectedItem.current != null) {
      const [start, end] = findOrderInTremauxTree(instance, itemId, lastSelectedItem.current);
      selectRange(event, [start, end]);
    }
  };

  const selectRangeFromStartToItem = (event: React.SyntheticEvent, itemId: string) => {
    selectRange(event, [getFirstNavigableItem(instance), itemId]);
  };

  const selectRangeFromItemToEnd = (event: React.SyntheticEvent, itemId: string) => {
    selectRange(event, [itemId, getLastNavigableItem(instance)]);
  };

  const selectAllNavigableItems = (event: React.SyntheticEvent) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }

    const navigableItems = getAllNavigableItems(instance);
    setSelectedItems(event, navigableItems);

    lastSelectedRange.current = getLookupFromArray(navigableItems);
  };

  const selectItemFromArrowNavigation = (
    event: React.SyntheticEvent,
    currentItem: string,
    nextItem: string,
  ) => {
    if (params.disableSelection || !params.multiSelect) {
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

  return {
    getRootProps: () => ({
      'aria-multiselectable': params.multiSelect,
    }),
    publicAPI: {
      selectItem,
    },
    instance: {
      selectItem,
      selectAllNavigableItems,
      expandSelectionRange,
      selectRangeFromStartToItem,
      selectRangeFromItemToEnd,
      selectItemFromArrowNavigation,
    },
    contextValue: {
      selection: {
        multiSelect: params.multiSelect,
        checkboxSelection: params.checkboxSelection,
        disableSelection: params.disableSelection,
      },
    },
  };
};

useTreeViewSelection.models = {
  selectedItems: {
    getDefaultValue: (params) => params.defaultSelectedItems,
  },
};

const DEFAULT_SELECTED_ITEMS: string[] = [];

useTreeViewSelection.getDefaultizedParams = (params) => ({
  ...params,
  disableSelection: params.disableSelection ?? false,
  multiSelect: params.multiSelect ?? false,
  checkboxSelection: params.checkboxSelection ?? false,
  defaultSelectedItems:
    params.defaultSelectedItems ?? (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null),
});

useTreeViewSelection.getInitialState = (params) => ({
  selection: {
    selectedItemsMap: getSelectedItemsMap(
      params.selectedItems === undefined ? params.defaultSelectedItems : params.selectedItems,
    ),
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
};
