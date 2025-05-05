import { RefObject } from '@mui/x-internals/types';
import { GridSignature } from '../../../constants/signature';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { gridRowSelectionManagerSelector } from './gridRowSelectionSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { createSelector } from '../../../utils/createSelector';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type {
  GridPrivateApiCommunity,
  GridApiCommunity,
} from '../../../models/api/gridApiCommunity';
import { type GridRowSelectionPropagation } from '../../../models/gridRowSelectionModel';
import { type RowSelectionManager } from '../../../models/gridRowSelectionManager';

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

export const checkboxPropsSelector = createSelector(
  gridRowTreeSelector,
  gridFilteredRowsLookupSelector,
  gridRowSelectionManagerSelector,
  (
    rowTree,
    filteredRowsLookup,
    rowSelectionManager,
    { groupId, autoSelectParents }: { groupId: GridRowId; autoSelectParents: boolean },
  ) => {
    const groupNode = rowTree[groupId];
    if (!groupNode || groupNode.type !== 'group' || rowSelectionManager.has(groupId)) {
      return {
        isIndeterminate: false,
        isChecked: rowSelectionManager.has(groupId),
      };
    }

    let hasSelectedDescendant = false;
    let hasUnSelectedDescendant = false;

    const traverseDescendants = (itemToTraverseId: GridRowId) => {
      if (
        filteredRowsLookup[itemToTraverseId] === false ||
        // Perf: Skip checking the rest of the descendants if we already
        // know that there is a selected and an unselected descendant
        (hasSelectedDescendant && hasUnSelectedDescendant)
      ) {
        return;
      }
      const node = rowTree[itemToTraverseId];
      if (node?.type === 'group') {
        node.children.forEach(traverseDescendants);
      }
      if (rowSelectionManager.has(itemToTraverseId)) {
        hasSelectedDescendant = true;
      } else {
        hasUnSelectedDescendant = true;
      }
    };

    traverseDescendants(groupId);

    return {
      isIndeterminate: hasSelectedDescendant && hasUnSelectedDescendant,
      isChecked: autoSelectParents ? hasSelectedDescendant && !hasUnSelectedDescendant : false,
    };
  },
);

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
  rowSelectionManager: RowSelectionManager = gridRowSelectionManagerSelector(apiRef),
) => {
  const filteredRows = gridFilteredRowsLookupSelector(apiRef);
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
      if (!rowSelectionManager.has(rowId) && !selectedDescendants.has(rowId)) {
        return false;
      }
      const node = tree[rowId];
      if (!node) {
        return false;
      }
      if (node.type !== 'group') {
        return true;
      }
      return node.children.every(checkAllDescendantsSelected);
    };

    const traverseParents = (rowId: GridRowId) => {
      const siblings: GridRowId[] = getFilteredRowNodeSiblings(tree, filteredRows, rowId);
      if (siblings.length === 0 || siblings.every(checkAllDescendantsSelected)) {
        const rowNode = tree[rowId] as GridGroupNode;
        const parent = rowNode?.parent;
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
  const rowSelectionManager = gridRowSelectionManagerSelector(apiRef);

  if (!autoSelectParents && !autoSelectDescendants) {
    return;
  }

  if (autoSelectParents) {
    const allParents = getRowNodeParents(tree, deselectedRow);
    allParents.forEach((parent) => {
      const isSelected = rowSelectionManager.has(parent);
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
