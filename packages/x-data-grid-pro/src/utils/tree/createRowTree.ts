import { GridRowId, GridTreeNode, GRID_ROOT_GROUP_ID, GridRowTreeConfig } from '@mui/x-data-grid';
import { buildRootGroup, GridRowTreeCreationValue } from '@mui/x-data-grid/internals';
import { RowTreeBuilderNode, GridTreePathDuplicateHandler } from './models';
import { insertDataRowInTree } from './insertDataRowInTree';
import { DataGridProProps } from '../../models/dataGridProProps';

interface CreateRowTreeParams {
  previousTree: GridRowTreeConfig | null;
  nodes: RowTreeBuilderNode[];
  defaultGroupingExpansionDepth: number;
  isGroupExpandedByDefault?: DataGridProProps['isGroupExpandedByDefault'];
  groupingName: string;
  onDuplicatePath?: GridTreePathDuplicateHandler;
}

/**
 * Transform a list of rows into a tree structure where each row references its parent and children.
 */
export const createRowTree = (params: CreateRowTreeParams): GridRowTreeCreationValue => {
  const dataRowIds: GridRowId[] = [];
  const tree: Record<GridRowId, GridTreeNode> = {
    [GRID_ROOT_GROUP_ID]: buildRootGroup(),
  };
  const treeDepths: GridRowTreeCreationValue['treeDepths'] = {};
  const groupsToFetch = new Set<GridRowId>();

  for (let i = 0; i < params.nodes.length; i += 1) {
    const node = params.nodes[i];
    dataRowIds.push(node.id);

    insertDataRowInTree({
      tree,
      previousTree: params.previousTree,
      id: node.id,
      path: node.path,
      serverChildrenCount: node.serverChildrenCount,
      onDuplicatePath: params.onDuplicatePath,
      treeDepths,
      isGroupExpandedByDefault: params.isGroupExpandedByDefault,
      defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
      groupsToFetch,
    });
  }

  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds,
    groupsToFetch: Array.from(groupsToFetch),
  };
};
