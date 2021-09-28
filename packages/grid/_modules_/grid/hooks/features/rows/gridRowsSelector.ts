import { createSelector } from 'reselect';
import { GridRowId, GridRowConfigTree, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

export const gridRowsStateSelector = (state: GridState) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalRowCount,
);

export const gridTopLevelRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalTopLevelRowCount,
);

export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.idRowsLookup,
);

export const gridRowsPathSelector = createSelector(gridRowsStateSelector, (rows) => rows.paths);

export const gridRowTreeSelector = createSelector(gridRowsStateSelector, (rows) => rows.tree);

export const gridRowExpandedTreeSelector = createSelector(gridRowTreeSelector, (rowsTree) => {
  const removeCollapsedNodes = (tree: GridRowConfigTree) => {
    const treeWithoutCollapsedChildren: GridRowConfigTree = new Map();

    tree.forEach((node, id) => {
      const children: GridRowConfigTree | undefined =
        node.expanded && node.children ? removeCollapsedNodes(node.children) : undefined;

      treeWithoutCollapsedChildren.set(id, {
        ...node,
        children,
      });
    });

    return treeWithoutCollapsedChildren;
  };

  return removeCollapsedNodes(rowsTree);
});

export const gridExpandedRowCountSelector = createSelector(
  gridRowExpandedTreeSelector,
  (expandedRows) => {
    const countNodes = (tree: GridRowConfigTree) => {
      let count: number = 0;

      tree.forEach((node) => {
        count += 1;

        if (node.children) {
          count += countNodes(node.children);
        }
      });

      return count;
    };

    return countNodes(expandedRows);
  },
);

export const gridRowIdsFlatSelector = createSelector(gridRowTreeSelector, (tree) => {
  const flattenRowIds = (nodes: GridRowConfigTree): GridRowId[] =>
    Array.from(nodes.values()).flatMap((node) => [
      node.id,
      ...(node.children ? flattenRowIds(node.children) : []),
    ]);

  return flattenRowIds(tree);
});
