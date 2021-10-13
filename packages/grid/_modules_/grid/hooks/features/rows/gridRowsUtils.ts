import type {
  GridRowConfigTree,
  GridRowConfigTreeNode,
  GridRowId,
  GridRowsLookup,
} from '../../../models';

export type GridNodeNameToIdTree = {
  [nodeName: string]: { id: GridRowId; children: GridNodeNameToIdTree };
};

interface InsertRowInTreeParams {
  tree: GridRowConfigTree;
  path: string[];
  id: GridRowId;
  defaultGroupingExpansionDepth: number;
  idRowsLookup: GridRowsLookup;
  nodeNameToIdTree: GridNodeNameToIdTree;
}

export const insertRowInTree = (params: InsertRowInTreeParams) => {
  const { tree, path, id, defaultGroupingExpansionDepth, idRowsLookup, nodeNameToIdTree } = params;

  let nodeNameToIdSubTree = nodeNameToIdTree;
  let parentNode: GridRowConfigTreeNode | null = null;

  for (let depth = 0; depth < path.length; depth += 1) {
    const nodeName = path[depth];
    let nodeId: GridRowId;

    const expanded = defaultGroupingExpansionDepth > depth;

    let nodeNameConfig = nodeNameToIdSubTree[nodeName];

    if (!nodeNameConfig) {
      nodeId = depth === path.length - 1 ? id : `filler-row-${path.slice(0, depth + 1).join('-')}`;

      nodeNameConfig = { id: nodeId, children: {} };
      nodeNameToIdSubTree[nodeName] = nodeNameConfig;
    } else {
      nodeId = nodeNameConfig.id;
    }
    nodeNameToIdSubTree = nodeNameConfig.children;

    if (depth < path.length - 1) {
      let node = tree[nodeId] ?? null;
      if (!node) {
        node = {
          id: nodeId,
          fillerNode: true,
          expanded,
          children: [],
          parent: parentNode?.id ?? null,
          depth,
        };

        tree[nodeId] = node;
        idRowsLookup[nodeId] = {};
      }
    } else {
      tree[id] = {
        id,
        expanded: defaultGroupingExpansionDepth > depth,
        parent: parentNode?.id ?? null,
        depth,
      };
    }

    if (parentNode != null) {
      if (!parentNode.children) {
        parentNode.children = [];
      }

      parentNode.children.push(nodeId);
    }

    parentNode = tree[nodeId]!;
  }
};
