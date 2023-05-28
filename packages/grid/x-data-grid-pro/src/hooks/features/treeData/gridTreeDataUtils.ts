import {
  GridRowId,
  GridRowTreeConfig,
  GridTreeNode,
  GridFilterState,
  GridFilterModel,
} from '@mui/x-data-grid';
import {
  GridAggregatedFilterItemApplier,
  GridAggregatedFilterItemApplierResult,
  GridApiCommunity,
  passFilterLogicSingle,
} from '@mui/x-data-grid/internals';

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  disableChildrenFiltering: boolean;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}

export const TREE_DATA_STRATEGY = 'tree-data';

/**
 * A node is visible if one of the following criteria is met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export const filterRowTreeFromTreeData = (
  params: FilterRowTreeFromTreeDataParams,
): Omit<GridFilterState, 'filterModel'> => {
  const { rowTree, disableChildrenFiltering, isRowMatchingFilters } = params;
  const visibleRowsLookup = new Set<GridRowId>();
  const filteredRowsLookup = new Set<GridRowId>();
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const filterResults: GridAggregatedFilterItemApplierResult = {
    passingFilterItems: null,
    passingQuickFilterValues: null,
  };

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
      isRowMatchingFilters(node.id, undefined, filterResults);
      isMatchingFilters = passFilterLogicSingle(
        filterResults.passingFilterItems,
        filterResults.passingQuickFilterValues,
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

    if (shouldPassFilters && areAncestorsExpanded) visibleRowsLookup.add(node.id);
    if (shouldPassFilters) filteredRowsLookup.add(node.id);

    // TODO: Should we keep storing the visibility status of footer independently or rely on the group visibility in the selector ?
    if (node.type === 'group' && node.footerId != null) {
      if (shouldPassFilters && areAncestorsExpanded && !!node.childrenExpanded)
        visibleRowsLookup.add(node.footerId);
    }

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
    visibleRowsLookup,
    filteredRowsLookup,
    filteredDescendantCountLookup,
  };
};
