import { GridSignature } from '../../utils/useGridApiEventHandler';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { selectedIdsLookupSelector } from './gridRowSelectionSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { createSelector } from '../../../utils/createSelector';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type {
  GridPrivateApiCommunity,
  GridApiCommunity,
} from '../../../models/api/gridApiCommunity';
import type { GridRowSelectionPropagation } from '../../../models/gridRowSelectionModel';

export const ROW_SELECTION_PROPAGATION_DEFAULT: GridRowSelectionPropagation = {
  parents: false,
  descendants: false,
};

const isValidRowId = (id: GridRowId | null): id is GridRowId =>
  id !== null && (typeof id === 'number' || typeof id === 'string');

// TODO v8: Use `createSelectorV8`
function getGridRowGroupSelectableDescendantsSelector(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  groupId: GridRowId,
) {
  return createSelector(
    gridRowTreeSelector,
    gridSortedRowIdsSelector,
    gridFilteredRowsLookupSelector,
    (rowTree, sortedRowIds, filteredRowsLookup) => {
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
    },
  );
}

// TODO v8: Use `createSelectorV8`
export function getCheckboxPropsSelector(groupId: GridRowId, autoSelectParents: boolean) {
  return createSelector(
    gridRowTreeSelector,
    gridSortedRowIdsSelector,
    gridFilteredRowsLookupSelector,
    selectedIdsLookupSelector,
    (rowTree, sortedRowIds, filteredRowsLookup, rowSelectionLookup) => {
      const groupNode = rowTree[groupId];
      if (!groupNode || groupNode.type !== 'group') {
        return {
          isIndeterminate: false,
          isChecked: rowSelectionLookup[groupId] === groupId,
        };
      }

      if (rowSelectionLookup[groupId] === groupId) {
        return {
          isIndeterminate: false,
          isChecked: true,
        };
      }

      let selectableDescendentsCount = 0;
      let selectedDescendentsCount = 0;
      const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
      for (
        let index = startIndex;
        index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
        index += 1
      ) {
        const id = sortedRowIds[index];
        if (filteredRowsLookup[id] !== false) {
          selectableDescendentsCount += 1;
          if (rowSelectionLookup[id] !== undefined) {
            selectedDescendentsCount += 1;
          }
        }
      }
      return {
        isIndeterminate:
          (selectedDescendentsCount > 0 && selectedDescendentsCount < selectableDescendentsCount) ||
          (selectedDescendentsCount === selectableDescendentsCount &&
            rowSelectionLookup[groupId] === undefined),
        isChecked: autoSelectParents
          ? selectedDescendentsCount > 0
          : rowSelectionLookup[groupId] === groupId,
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

  while (isValidRowId(parent) && parent !== GRID_ROOT_GROUP_ID) {
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
  if (!isValidRowId(parent)) {
    return [];
  }

  const parentNode = tree[parent] as GridGroupNode;

  return [...parentNode.children].filter((childId) => childId !== id && filteredRows[childId]);
};

export const findRowsToSelect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  selectedRow: GridRowId,
  autoSelectDescendants: boolean,
  autoSelectParents: boolean,
) => {
  const filteredRows = gridFilteredRowsLookupSelector(apiRef);
  const selectedIdsLookup = selectedIdsLookupSelector(apiRef);
  const rowsToSelect: Set<GridRowId> = new Set([]);

  if (!autoSelectDescendants && !autoSelectParents) {
    return rowsToSelect;
  }

  if (autoSelectDescendants) {
    const rowNode = tree[selectedRow];

    if (rowNode?.type === 'group') {
      const rowGroupDescendantsSelector = getGridRowGroupSelectableDescendantsSelector(
        apiRef,
        selectedRow,
      );
      const descendants = rowGroupDescendantsSelector(apiRef);
      descendants.forEach(rowsToSelect.add, rowsToSelect);
    }
  }

  if (autoSelectParents) {
    const checkAllDescendantsSelected = (rowId: GridRowId): boolean => {
      if (selectedIdsLookup[rowId] !== rowId && !rowsToSelect.has(rowId)) {
        return false;
      }
      const node = tree[rowId];
      if (node?.type !== 'group') {
        return true;
      }
      return node.children.every((child) => checkAllDescendantsSelected(child));
    };

    const traverseParents = (rowId: GridRowId) => {
      const siblings: GridRowId[] = getFilteredRowNodeSiblings(tree, filteredRows, rowId);
      if (
        siblings.length === 0 ||
        siblings.every((sibling) => checkAllDescendantsSelected(sibling))
      ) {
        const rowNode = tree[rowId] as GridGroupNode;
        const parent = rowNode.parent;
        if (isValidRowId(parent) && parent !== GRID_ROOT_GROUP_ID && apiRef.current.isRowSelectable(parent)) {
          rowsToSelect.add(parent);
          traverseParents(parent);
        }
      }
    };
    traverseParents(selectedRow);
  }

  return Array.from(rowsToSelect);
};

export const findRowsToDeselect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  deselectedRow: GridRowId,
  autoSelectDescendants: boolean,
  autoSelectParents: boolean,
) => {
  const rowsToDeselect: GridRowId[] = [];
  const selectedIdsLookup = selectedIdsLookupSelector(apiRef);

  if (!autoSelectParents && !autoSelectDescendants) {
    return rowsToDeselect;
  }

  if (autoSelectParents) {
    const allParents = getRowNodeParents(tree, deselectedRow);
    allParents.forEach((parent) => {
      const isSelected = selectedIdsLookup[parent] === parent;
      if (isSelected) {
        rowsToDeselect.push(parent);
      }
    });
  }

  if (autoSelectDescendants) {
    const rowNode = tree[deselectedRow];
    if (rowNode?.type === 'group') {
      const rowGroupDescendantsSelector = getGridRowGroupSelectableDescendantsSelector(
        apiRef,
        deselectedRow,
      );
      const descendants = rowGroupDescendantsSelector(apiRef);
      return rowsToDeselect.concat(descendants);
    }
  }
  return rowsToDeselect;
};
