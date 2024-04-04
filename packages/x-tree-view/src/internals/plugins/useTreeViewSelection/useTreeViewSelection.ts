import * as React from 'react';
import { TreeViewPlugin, TreeViewItemRange } from '../../models';
import {
  populateInstance,
  getNextItem,
  getFirstItem,
  getLastItem,
} from '../../useTreeView/useTreeView.utils';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { findOrderInTremauxTree } from './useTreeViewSelection.utils';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({
  instance,
  params,
  models,
}) => {
  const lastSelectedItem = React.useRef<string | null>(null);
  const lastSelectionWasRange = React.useRef(false);
  const currentRangeSelection = React.useRef<string[]>([]);

  const setSelectedItems = (
    event: React.SyntheticEvent,
    newSelectedItems: typeof params.defaultSelectedItems,
  ) => {
    if (params.onItemSelectionToggle) {
      if (params.multiSelect) {
        const addedItems = (newSelectedItems as string[]).filter(
          (itemId) => !instance.isItemSelected(itemId),
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

  const isItemSelected = (itemId: string) =>
    Array.isArray(models.selectedItems.value)
      ? models.selectedItems.value.indexOf(itemId) !== -1
      : models.selectedItems.value === itemId;

  const selectItem = (event: React.SyntheticEvent, itemId: string, multiple = false) => {
    if (params.disableSelection) {
      return;
    }

    if (multiple) {
      if (Array.isArray(models.selectedItems.value)) {
        let newSelected: string[];
        if (models.selectedItems.value.indexOf(itemId) !== -1) {
          newSelected = models.selectedItems.value.filter((id) => id !== itemId);
        } else {
          newSelected = [itemId].concat(models.selectedItems.value);
        }

        setSelectedItems(event, newSelected);
      }
    } else {
      const newSelected = params.multiSelect ? [itemId] : itemId;
      setSelectedItems(event, newSelected);
    }
    lastSelectedItem.current = itemId;
    lastSelectionWasRange.current = false;
    currentRangeSelection.current = [];
  };

  const getItemsInRange = (itemAId: string, itemBId: string) => {
    const [first, last] = findOrderInTremauxTree(instance, itemAId, itemBId);
    const items = [first];

    let current = first;

    while (current !== last) {
      current = getNextItem(instance, current)!;
      items.push(current);
    }

    return items;
  };

  const handleRangeArrowSelect = (event: React.SyntheticEvent, items: TreeViewItemRange) => {
    let base = (models.selectedItems.value as string[]).slice();
    const { start, next, current } = items;

    if (!next || !current) {
      return;
    }

    if (currentRangeSelection.current.indexOf(current) === -1) {
      currentRangeSelection.current = [];
    }

    if (lastSelectionWasRange.current) {
      if (currentRangeSelection.current.indexOf(next) !== -1) {
        base = base.filter((id) => id === start || id !== current);
        currentRangeSelection.current = currentRangeSelection.current.filter(
          (id) => id === start || id !== current,
        );
      } else {
        base.push(next);
        currentRangeSelection.current.push(next);
      }
    } else {
      base.push(next);
      currentRangeSelection.current.push(current, next);
    }
    setSelectedItems(event, base);
  };

  const handleRangeSelect = (
    event: React.SyntheticEvent,
    items: { start: string; end: string },
  ) => {
    let base = (models.selectedItems.value as string[]).slice();
    const { start, end } = items;
    // If last selection was a range selection ignore items that were selected.
    if (lastSelectionWasRange.current) {
      base = base.filter((id) => currentRangeSelection.current.indexOf(id) === -1);
    }

    let range = getItemsInRange(start, end);
    range = range.filter((item) => !instance.isItemDisabled(item));
    currentRangeSelection.current = range;
    let newSelected = base.concat(range);
    newSelected = newSelected.filter((id, i) => newSelected.indexOf(id) === i);
    setSelectedItems(event, newSelected);
  };

  const selectRange = (event: React.SyntheticEvent, items: TreeViewItemRange, stacked = false) => {
    if (params.disableSelection) {
      return;
    }

    const { start = lastSelectedItem.current, end, current } = items;
    if (stacked) {
      handleRangeArrowSelect(event, { start, next: end, current });
    } else if (start != null && end != null) {
      handleRangeSelect(event, { start, end });
    }
    lastSelectionWasRange.current = true;
  };

  const rangeSelectToFirst = (event: React.KeyboardEvent, itemId: string) => {
    if (!lastSelectedItem.current) {
      lastSelectedItem.current = itemId;
    }

    const start = lastSelectionWasRange.current ? lastSelectedItem.current : itemId;

    instance.selectRange(event, {
      start,
      end: getFirstItem(instance),
    });
  };

  const rangeSelectToLast = (event: React.KeyboardEvent, itemId: string) => {
    if (!lastSelectedItem.current) {
      lastSelectedItem.current = itemId;
    }

    const start = lastSelectionWasRange.current ? lastSelectedItem.current : itemId;

    instance.selectRange(event, {
      start,
      end: getLastItem(instance),
    });
  };

  populateInstance<UseTreeViewSelectionSignature>(instance, {
    isItemSelected,
    selectItem,
    selectRange,
    rangeSelectToLast,
    rangeSelectToFirst,
  });

  return {
    getRootProps: () => ({
      'aria-multiselectable': params.multiSelect,
    }),
    contextValue: {
      selection: {
        multiSelect: params.multiSelect,
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
  defaultSelectedItems:
    params.defaultSelectedItems ?? (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null),
});

useTreeViewSelection.params = {
  disableSelection: true,
  multiSelect: true,
  defaultSelectedItems: true,
  selectedItems: true,
  onSelectedItemsChange: true,
  onItemSelectionToggle: true,
};
