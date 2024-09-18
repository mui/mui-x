import { GridRowSelectionPropagation } from '@mui/x-data-grid-pro';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridSignature } from '../../utils/useGridApiEventHandler';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type {
  GridPrivateApiCommunity,
  GridApiCommunity,
} from '../../../models/api/gridApiCommunity';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { selectedIdsLookupSelector } from './gridRowSelectionSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { createSelector } from '../../../utils/createSelector';

function getGridRowGroupSelectableChildrenSelector(
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

      const children: GridRowId[] = [];

      const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
      for (
        let index = startIndex;
        index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
        index += 1
      ) {
        const id = sortedRowIds[index];
        if (filteredRowsLookup[id] !== false && apiRef.current.isRowSelectable(id)) {
          children.push(id);
        }
      }
      return children;
    },
  );
}

export function getGridSomeChildrenSelectedSelector(groupId: GridRowId) {
  return createSelector(
    gridRowTreeSelector,
    gridSortedRowIdsSelector,
    gridFilteredRowsLookupSelector,
    selectedIdsLookupSelector,
    (rowTree, sortedRowIds, filteredRowsLookup, rowSelectionLookup) => {
      const groupNode = rowTree[groupId];
      if (!groupNode || groupNode.type !== 'group') {
        return false;
      }

      const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
      for (
        let index = startIndex;
        index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
        index += 1
      ) {
        const id = sortedRowIds[index];
        if (filteredRowsLookup[id] !== false && rowSelectionLookup[id] !== undefined) {
          return true;
        }
      }
      return false;
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

  while (parent && parent !== GRID_ROOT_GROUP_ID) {
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
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  filteredRows: Record<GridRowId, boolean>,
  id: GridRowId,
) => {
  const node = apiRef.current.getRowNode(id);
  if (!node) {
    return [];
  }

  const parent = node.parent;
  if (!parent) {
    return [];
  }

  const parentNode = tree[parent] as GridGroupNode;

  return [...parentNode.children].filter((childId) => childId !== id && filteredRows[childId]);
};

export const findRowsToSelect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  selectedRow: GridRowId,
  rowSelectionPropagation: GridRowSelectionPropagation,
) => {
  const filteredRows = gridFilteredRowsLookupSelector(apiRef);
  const rowsToSelect: GridRowId[] = [];

  if (rowSelectionPropagation === 'none') {
    return rowsToSelect;
  }

  if (rowSelectionPropagation === 'both' || rowSelectionPropagation === 'parents') {
    const traverseParents = (rowId: GridRowId) => {
      const siblings: GridRowId[] = getFilteredRowNodeSiblings(apiRef, tree, filteredRows, rowId);
      if (
        siblings.length === 0 ||
        siblings.every((sibling) => apiRef.current.isRowSelected(sibling))
      ) {
        const rowNode = apiRef.current.getRowNode(rowId) as GridGroupNode;
        const parent = rowNode.parent;
        if (parent && parent !== GRID_ROOT_GROUP_ID && apiRef.current.isRowSelectable(parent)) {
          rowsToSelect.push(parent);
          traverseParents(parent);
        }
      }
    };
    traverseParents(selectedRow);
  }

  if (rowSelectionPropagation === 'both' || rowSelectionPropagation === 'children') {
    const rowNode = apiRef.current.getRowNode(selectedRow);

    if (rowNode?.type === 'group') {
      const rowGroupChildrenSelector = getGridRowGroupSelectableChildrenSelector(
        apiRef,
        selectedRow,
      );
      const children = rowGroupChildrenSelector(apiRef);
      return rowsToSelect.concat(children);
    }
  }
  return rowsToSelect;
};

export const findRowsToDeselect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  deselectedRow: GridRowId,
  rowSelectionPropagation: GridRowSelectionPropagation,
) => {
  const rowsToDeselect: GridRowId[] = [];

  if (rowSelectionPropagation === 'none') {
    return rowsToDeselect;
  }

  if (rowSelectionPropagation === 'both' || rowSelectionPropagation === 'parents') {
    const allParents = getRowNodeParents(tree, deselectedRow);
    allParents.forEach((parent) => {
      const isSelected = apiRef.current.isRowSelected(parent);
      if (isSelected) {
        rowsToDeselect.push(parent);
      }
    });
  }

  if (rowSelectionPropagation === 'both' || rowSelectionPropagation === 'children') {
    const rowNode = apiRef.current.getRowNode(deselectedRow);
    if (rowNode?.type === 'group') {
      const rowGroupChildrenSelector = getGridRowGroupSelectableChildrenSelector(
        apiRef,
        deselectedRow,
      );
      const children = rowGroupChildrenSelector(apiRef);
      return rowsToDeselect.concat(children);
    }
  }
  return rowsToDeselect;
};
