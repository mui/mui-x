import { RefObject } from '@mui/x-internals/types';
import { GridSignature } from '../../../constants/signature';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { gridRowSelectionStateSelector } from './gridRowSelectionSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { createSelector } from '../../../utils/createSelector';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type {
  GridPrivateApiCommunity,
  GridApiCommunity,
} from '../../../models/api/gridApiCommunity';
import {
  createRowSelectionManager,
  type GridRowSelectionPropagation,
} from '../../../models/gridRowSelectionModel';

export const ROW_SELECTION_PROPAGATION_DEFAULT: GridRowSelectionPropagation = {
  parents: true,
  descendants: true,
};

function getGridRowGroupSelectableDescendants(
  apiRef: RefObject<GridApiCommunity>,
  groupId: GridRowId,
) {
  const rowTree = gridRowTreeSelector(apiRef);
  const sortedRowIds = gridSortedRowIdsSelector(apiRef);
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);
  const groupNode = rowTree[groupId];
  if (!groupNode || groupNode.type !== 'group') {
    return [];
  }

  const descendants: GridRowId[] = [];

  const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
  for (
    let index = startIndex;
    index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
    index += 1
  ) {
    const id = sortedRowIds[index];
    if (filteredRowsLookup[id] !== false && apiRef.current.isRowSelectable(id)) {
      descendants.push(id);
    }
  }
  return descendants;
}

// TODO v8: Use `createSelectorV8`
export function getCheckboxPropsSelector(groupId: GridRowId, autoSelectParents: boolean) {
  return createSelector(
    gridRowTreeSelector,
    gridSortedRowIdsSelector,
    gridFilteredRowsLookupSelector,
    gridRowSelectionStateSelector,
    (rowTree, sortedRowIds, filteredRowsLookup, rowSelectionModel) => {
      const selectionManager = createRowSelectionManager(rowSelectionModel);
      const groupNode = rowTree[groupId];
      if (!groupNode || groupNode.type !== 'group') {
        return {
          isIndeterminate: false,
          isChecked: selectionManager.has(groupId),
        };
      }

      if (selectionManager.has(groupId)) {
        return {
          isIndeterminate: false,
          isChecked: true,
        };
      }

      let selectableDescendantsCount = 0;
      let selectedDescendantsCount = 0;
      const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
      for (
        let index = startIndex;
        index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
        index += 1
      ) {
        const id = sortedRowIds[index];
        if (filteredRowsLookup[id] !== false) {
          selectableDescendantsCount += 1;
          if (selectionManager.has(id)) {
            selectedDescendantsCount += 1;
          }
        }
      }
      return {
        isIndeterminate:
          selectedDescendantsCount > 0 &&
          (selectedDescendantsCount < selectableDescendantsCount || !selectionManager.has(groupId)),
        isChecked: autoSelectParents ? selectedDescendantsCount > 0 : selectionManager.has(groupId),
      };
    },
  );
}

export function isMultipleRowSelectionEnabled(
  props: Pick<
    DataGridProcessedProps,
    'signature' | 'disableMultipleRowSelection' | 'checkboxSelection'
  >,
) {
  if (props.signature === GridSignature.DataGrid) {
    // DataGrid Community has multiple row selection enabled only if checkbox selection is enabled.
    return props.checkboxSelection && props.disableMultipleRowSelection !== true;
  }
  return !props.disableMultipleRowSelection;
}

const getRowNodeParents = (tree: GridRowTreeConfig, id: GridRowId) => {
  const parents: GridRowId[] = [];

  let parent: GridRowId | null = id;

  while (parent != null && parent !== GRID_ROOT_GROUP_ID) {
    const node = tree[parent] as GridGroupNode;
    if (!node) {
      return parents;
    }
    parents.push(parent);
    parent = node.parent;
  }
  return parents;
};

const getFilteredRowNodeSiblings = (
  tree: GridRowTreeConfig,
  filteredRows: Record<GridRowId, boolean>,
  id: GridRowId,
) => {
  const node = tree[id];
  if (!node) {
    return [];
  }

  const parent = node.parent;
  if (parent == null) {
    return [];
  }

  const parentNode = tree[parent] as GridGroupNode;

  return parentNode.children.filter((childId) => childId !== id && filteredRows[childId] !== false);
};

export const findRowsToSelect = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  selectedRow: GridRowId,
  autoSelectDescendants: boolean,
  autoSelectParents: boolean,
  addRow: (rowId: GridRowId) => void,
) => {
  const filteredRows = gridFilteredRowsLookupSelector(apiRef);
  const rowSelectionModel = gridRowSelectionStateSelector(apiRef);
  const selectionManager = createRowSelectionManager(rowSelectionModel);
  const selectedDescendants: Set<GridRowId> = new Set([]);

  if (!autoSelectDescendants && !autoSelectParents) {
    return;
  }

  if (autoSelectDescendants) {
    const rowNode = tree[selectedRow];

    if (rowNode?.type === 'group') {
      const descendants = getGridRowGroupSelectableDescendants(apiRef, selectedRow);
      descendants.forEach((rowId) => {
        addRow(rowId);
        selectedDescendants.add(rowId);
      });
    }
  }

  if (autoSelectParents) {
    const checkAllDescendantsSelected = (rowId: GridRowId): boolean => {
      if (!selectionManager.has(rowId) && !selectedDescendants.has(rowId)) {
        return false;
      }
      const node = tree[rowId];
      if (node?.type !== 'group') {
        return true;
      }
      return node.children.every(checkAllDescendantsSelected);
    };

    const traverseParents = (rowId: GridRowId) => {
      const siblings: GridRowId[] = getFilteredRowNodeSiblings(tree, filteredRows, rowId);
      if (siblings.length === 0 || siblings.every(checkAllDescendantsSelected)) {
        const rowNode = tree[rowId] as GridGroupNode;
        const parent = rowNode.parent;
        if (
          parent != null &&
          parent !== GRID_ROOT_GROUP_ID &&
          apiRef.current.isRowSelectable(parent)
        ) {
          addRow(parent);
          selectedDescendants.add(parent);
          traverseParents(parent);
        }
      }
    };
    traverseParents(selectedRow);
  }
};

export const findRowsToDeselect = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  deselectedRow: GridRowId,
  autoSelectDescendants: boolean,
  autoSelectParents: boolean,
  removeRow: (rowId: GridRowId) => void,
) => {
  const rowSelectionModel = gridRowSelectionStateSelector(apiRef);
  const selectionManager = createRowSelectionManager(rowSelectionModel);

  if (!autoSelectParents && !autoSelectDescendants) {
    return;
  }

  if (autoSelectParents) {
    const allParents = getRowNodeParents(tree, deselectedRow);
    allParents.forEach((parent) => {
      const isSelected = selectionManager.has(parent);
      if (isSelected) {
        removeRow(parent);
      }
    });
  }

  if (autoSelectDescendants) {
    const rowNode = tree[deselectedRow];
    if (rowNode?.type === 'group') {
      const descendants = getGridRowGroupSelectableDescendants(apiRef, deselectedRow);
      descendants.forEach((descendant) => {
        removeRow(descendant);
      });
    }
  }
};
