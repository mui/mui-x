import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridSignature } from '../../utils/useGridApiEventHandler';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { gridFilteredRowsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { selectedIdsLookupSelector } from './gridRowSelectionSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { createSelectorV8 } from '../../../utils/createSelectorV8';

export const gridRowGroupSelectableChildrenSelector = createSelectorV8(
  gridRowTreeSelector,
  gridSortedRowIdsSelector,
  gridFilteredRowsLookupSelector,
  (rowTree, sortedRowIds, filteredRowsLookup, args) => {
    const children = new Set<GridRowId>();
    const { groupId, apiRef } = args;
    if (groupId === undefined || apiRef === undefined) {
      return children;
    }
    const groupNode = rowTree[groupId];
    if (!groupNode || groupNode.type !== 'group') {
      return children;
    }

    const startIndex = sortedRowIds.findIndex((id) => id === groupId) + 1;
    for (
      let index = startIndex;
      index < sortedRowIds.length && rowTree[sortedRowIds[index]]?.depth > groupNode.depth;
      index += 1
    ) {
      const id = sortedRowIds[index];
      if (filteredRowsLookup[id] !== false && apiRef.current.isRowSelectable(id)) {
        children.add(id);
      }
    }
    return children;
  },
);

export const gridSomeChildrenSelectedSelector = createSelectorV8(
  gridRowTreeSelector,
  gridSortedRowIdsSelector,
  gridFilteredRowsLookupSelector,
  selectedIdsLookupSelector,
  (rowTree, sortedRowIds, filteredRowsLookup, rowSelectionLookup, args) => {
    const groupId = args.groupId;
    if (groupId === undefined) {
      return false;
    }
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
) => {
  const filteredRows = gridFilteredRowsLookupSelector(apiRef);
  const rowsToSelect: GridRowId[] = [];

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

  const rowNode = apiRef.current.getRowNode(selectedRow);

  if (rowNode?.type === 'group') {
    const children = gridRowGroupSelectableChildrenSelector(apiRef, {
      groupId: selectedRow,
      apiRef,
    });
    return rowsToSelect.concat(Array.from(children));
  }
  return rowsToSelect;
};

export const findRowsToDeselect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  deselectedRow: GridRowId,
) => {
  const rowsToDeselect: GridRowId[] = [];

  const allParents = getRowNodeParents(tree, deselectedRow);
  allParents.forEach((parent) => {
    const isSelected = apiRef.current.isRowSelected(parent);
    if (isSelected) {
      rowsToDeselect.push(parent);
    }
  });

  const rowNode = apiRef.current.getRowNode(deselectedRow);
  if (rowNode?.type === 'group') {
    const children = gridRowGroupSelectableChildrenSelector(apiRef, {
      groupId: deselectedRow,
      apiRef,
    });
    return rowsToDeselect.concat(Array.from(children));
  }
  return rowsToDeselect;
};
