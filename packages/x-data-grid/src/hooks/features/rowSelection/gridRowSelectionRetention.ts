import type { GridGroupNode, GridRowId, GridTreeNode } from '../../../models/gridRows';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createRootSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { gridRowSelectionManagerSelector } from './gridRowSelectionSelector';

export interface GridRowSelectionRetainedRow {
  parent: GridRowId;
  type: 'group' | 'leaf';
  isSelectable: boolean;
}

export type GridRowSelectionRetention = Map<GridRowId, GridRowSelectionRetainedRow>;

export type GridRowSelectionTree = Record<
  GridRowId,
  | Pick<GridGroupNode, 'type' | 'parent' | 'children'>
  | Pick<Exclude<GridTreeNode, GridGroupNode>, 'type' | 'parent'>
>;

export interface GridRowSelectionPrivateApi {
  /**
   * Remember the selection relationships before a server-side group is unloaded.
   * @param {GridRowId} parentId The group whose descendants are being unloaded.
   */
  retainRowSelection: (parentId: GridRowId) => void;
  /**
   * Discard relationships that are absent from a new response for this group.
   * @param {GridRowId} parentId The group whose children have been fetched.
   * @param {Set<GridRowId>} childIds The direct children in the response.
   */
  reconcileRowSelectionRetention: (parentId: GridRowId, childIds: Set<GridRowId>) => void;
  /** Forget the relationships when the server-side hierarchy is reset. */
  clearRowSelectionRetention: () => void;
}

export const gridRowSelectionRetentionSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowSelectionRetention,
);

// This tree is only used for selection. Unloaded rows must not reappear in rendering,
// filtering, sorting, or the row lookup.
export const gridRowSelectionTreeSelector = createSelectorMemoized(
  gridRowTreeSelector,
  gridRowSelectionRetentionSelector,
  (rowTree, retainedRows): GridRowSelectionTree => {
    if (retainedRows.size === 0) {
      return rowTree;
    }
    const tree: GridRowSelectionTree = { ...rowTree };
    retainedRows.forEach((row, id) => {
      if (!tree[id]) {
        tree[id] =
          row.type === 'group'
            ? { parent: row.parent, type: 'group', children: [] }
            : { parent: row.parent, type: 'leaf' };
      }
    });
    const updatedParents = new Set<GridRowId>();
    retainedRows.forEach((row, id) => {
      if (rowTree[id]) {
        return;
      }
      let parent = tree[row.parent];
      if (parent?.type !== 'group') {
        return;
      }
      if (!updatedParents.has(row.parent)) {
        parent = { ...parent, children: [...parent.children] };
        tree[row.parent] = parent;
        updatedParents.add(row.parent);
      }
      parent.children.push(id);
    });
    return tree;
  },
);

interface RetainedSelectionState {
  selected: boolean;
  unselected: boolean;
}

// Compute retained descendants once per tree/model change, not once per rendered checkbox.
export const gridRetainedRowSelectionLookupSelector = createSelectorMemoized(
  gridRowSelectionTreeSelector,
  gridRowTreeSelector,
  gridRowSelectionRetentionSelector,
  gridRowSelectionManagerSelector,
  (tree, rowTree, retainedRows, manager) => {
    const lookup = new Map<GridRowId, RetainedSelectionState>();
    if (retainedRows.size === 0) {
      return lookup;
    }
    const visit = (id: GridRowId): RetainedSelectionState => {
      const retained = !rowTree[id] ? retainedRows.get(id) : undefined;
      const result = {
        selected: !!retained?.isSelectable && manager.has(id),
        unselected: !!retained?.isSelectable && !manager.has(id),
      };
      const node = tree[id];
      if (node?.type === 'group') {
        node.children.forEach((childId) => {
          const child = visit(childId);
          result.selected ||= child.selected;
          result.unselected ||= child.unselected;
        });
      }
      lookup.set(id, result);
      return result;
    };
    visit(GRID_ROOT_GROUP_ID);
    return lookup;
  },
);
