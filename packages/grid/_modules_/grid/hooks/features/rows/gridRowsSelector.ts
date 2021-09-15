import { createSelector } from 'reselect';
import { GridRowId, GridRowIdTree, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { GridRowsState } from './gridRowsState';

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

export const gridRowsStateSelector = (state: GridState) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.totalRowCount,
);

export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.idRowsLookup,
);

export const gridRowTreeSelector = createSelector(gridRowsStateSelector, (rows) => rows.tree);

export const gridRowExpandedTreeSelector = createSelector(gridRowTreeSelector, (rowsTree) => {
  const removeCollapsedNodes = (tree: GridRowIdTree) => {
    const treeWithoutCollapsedChildren: GridRowIdTree = new Map();

    tree.forEach((node, id) => {
      const children: GridRowIdTree = node.expanded
        ? removeCollapsedNodes(node.children)
        : new Map();

      treeWithoutCollapsedChildren.set(id, {
        ...node,
        children,
      });
    });

    return treeWithoutCollapsedChildren;
  };

  return removeCollapsedNodes(rowsTree);
});

export const gridRowIdsFlatSelector = createSelector(gridRowTreeSelector, (tree) => {
  const flattenRowIds = (nodes: GridRowIdTree): GridRowId[] =>
    Array.from(nodes.values()).flatMap((node) => [node.id, ...flattenRowIds(node.children)]);

  return flattenRowIds(tree);
});
