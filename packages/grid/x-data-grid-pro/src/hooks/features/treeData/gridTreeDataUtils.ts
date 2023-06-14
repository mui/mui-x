import {
  GridRowId,
  GridRowTreeConfig,
  GridTreeNode,
  GridFilterState,
  GridFilterModel,
  GridServerSideGroupNode,
  GridRowIdToModelLookup,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  GridAggregatedFilterItemApplier,
  GridApiCommunity,
  passFilterLogic,
} from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridPrivateApiPro } from '../../../models/gridApiPro';

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  disableChildrenFiltering: boolean;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}

export const TREE_DATA_STRATEGY = 'tree-data';
export const TREE_DATA_LAZY_LOADING_STRATEGY = 'tree-data-lazy-loading';

/**
 * A node is visible if one of the following criteria is met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export const filterRowTreeFromTreeData = (
  params: FilterRowTreeFromTreeDataParams,
): Omit<GridFilterState, 'filterModel'> => {
  const { rowTree, disableChildrenFiltering, isRowMatchingFilters } = params;
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const filterTreeNode = (
    node: GridTreeNode,
    isParentMatchingFilters: boolean,
    areAncestorsExpanded: boolean,
  ): number => {
    const shouldSkipFilters = disableChildrenFiltering && node.depth > 0;

    let isMatchingFilters: boolean | null;
    if (shouldSkipFilters) {
      isMatchingFilters = null;
    } else if (!isRowMatchingFilters || node.type === 'footer') {
      isMatchingFilters = true;
    } else {
      const { passingFilterItems, passingQuickFilterValues } = isRowMatchingFilters(node.id);
      isMatchingFilters = passFilterLogic(
        [passingFilterItems],
        [passingQuickFilterValues],
        params.filterModel,
        params.apiRef,
      );
    }

    let filteredDescendantCount = 0;
    if (node.type === 'group') {
      node.children.forEach((childId) => {
        const childNode = rowTree[childId];
        const childSubTreeSize = filterTreeNode(
          childNode,
          isMatchingFilters ?? isParentMatchingFilters,
          areAncestorsExpanded && !!node.childrenExpanded,
        );

        filteredDescendantCount += childSubTreeSize;
      });
    }

    let shouldPassFilters: boolean;
    switch (isMatchingFilters) {
      case true: {
        shouldPassFilters = true;
        break;
      }
      case false: {
        shouldPassFilters = filteredDescendantCount > 0;
        break;
      }
      default: {
        shouldPassFilters = isParentMatchingFilters;
        break;
      }
    }

    filteredRowsLookup[node.id] = shouldPassFilters;

    if (!shouldPassFilters) {
      return 0;
    }

    filteredDescendantCountLookup[node.id] = filteredDescendantCount;

    if (node.type === 'footer') {
      return filteredDescendantCount;
    }

    return filteredDescendantCount + 1;
  };

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.depth === 0) {
      filterTreeNode(node, true, true);
    }
  }

  return {
    filteredRowsLookup,
    filteredDescendantCountLookup,
  };
};

/**
 * For the server-side filter, we need to generate the filteredRowsLookup with all the rows
 * returned by the server.
 */
export const getFilteredRowsLookup = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  rowTree: GridRowTreeConfig,
  getDescendentCount: DataGridProProcessedProps['getDescendantCount'],
): Omit<GridFilterState, 'filterModel'> => {
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const filterTreeNode = (node: GridTreeNode) => {
    if (node.type === 'group') {
      node.children.forEach((childId) => {
        const childNode = rowTree[childId];
        filterTreeNode(childNode);
      });
    }
    filteredRowsLookup[node.id] = true;
    const row = apiRef.current.getRow(node.id);
    filteredDescendantCountLookup[node.id] = getDescendentCount?.(row) ?? 0;
  };

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.depth === 0) {
      filterTreeNode(node);
    }
  }

  return {
    filteredRowsLookup,
    filteredDescendantCountLookup,
  };
};

export const iterateTreeNodes = (
  dataRowIdToModelLookup: GridRowIdToModelLookup<GridValidRowModel>,
  tree: GridRowTreeConfig,
  nodeId: GridTreeNode['id'],
  isServerSideRow: DataGridProProcessedProps['isServerSideRow'],
) => {
  const node = tree[nodeId];

  if (node.type === 'leaf') {
    const row = dataRowIdToModelLookup[node.id];
    if (!row) {
      return;
    }
    if (row && isServerSideRow!(row)) {
      const groupingField = '__no_field__';
      const groupingKey = node.groupingKey ?? '__no_key__';
      const updatedNode: GridServerSideGroupNode = {
        ...node,
        type: 'group',
        children: [],
        childrenFromPath: {},
        isAutoGenerated: false,
        groupingField,
        groupingKey,
        childrenExpanded: false,
        isServerSide: true,
        isLoading: false,
        childrenFetched: false,
      };
      tree[node.id] = updatedNode;
    }
    return;
  }

  if (node.type === 'group') {
    for (let i = 0; i < node.children.length; i += 1) {
      iterateTreeNodes(dataRowIdToModelLookup, tree, node.children[i], isServerSideRow);
    }
  }
};
