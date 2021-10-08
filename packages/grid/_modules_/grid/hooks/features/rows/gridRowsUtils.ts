import type { GridRowConfigTree, GridRowId, GridRowsLookup } from '../../../models';

export const insertLeafInTree = ({
  tree,
  path,
  id,
  defaultGroupingExpansionDepth,
  paths,
  idRowsLookup,
}: {
  tree: GridRowConfigTree;
  path: string[];
  id: GridRowId;
  defaultGroupingExpansionDepth: number;
  paths: Record<GridRowId, string[]>;
  idRowsLookup: GridRowsLookup;
}) => {
  let subTree = tree;

  path.forEach((nodeName, index) => {
    if (index < path.length - 1) {
      let parentNode = subTree.get(nodeName);

      if (!parentNode) {
        const fillerPath = path.slice(0, index + 1);
        const fillerId = `filler-row-${fillerPath.join('-')}`;
        const childrenTree: GridRowConfigTree = new Map();

        parentNode = {
          id: fillerId,
          fillerNode: true,
          expanded: defaultGroupingExpansionDepth > index,
          children: childrenTree,
        };

        subTree.set(nodeName, parentNode);
        idRowsLookup[fillerId] = {};
        paths[fillerId] = fillerPath;
      }

      if (!parentNode.children) {
        parentNode.children = new Map();
      }

      subTree = parentNode!.children!;
    } else {
      subTree.set(nodeName, {
        id,
        expanded: defaultGroupingExpansionDepth > index,
      });
      paths[id] = path;
    }
  });
};
