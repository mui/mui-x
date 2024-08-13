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
  passFilterLogic,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  disableChildrenFiltering: boolean;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridPrivateApiPro>;
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
  const { apiRef, rowTree, disableChildrenFiltering, isRowMatchingFilters } = params;
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredChildrenCountLookup: Record<GridRowId, number> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};
  const filterCache = {};

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
      const row = apiRef.current.getRow(node.id);
      isRowMatchingFilters(row, undefined, filterResults);
      isMatchingFilters = passFilterLogic(
        [filterResults.passingFilterItems],
        [filterResults.passingQuickFilterValues],
        params.filterModel,
        params.apiRef,
        filterCache,
      );
    }

    let filteredChildrenCount = 0;
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
        if (childSubTreeSize > 0) {
          filteredChildrenCount += 1;
        }
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

    filteredChildrenCountLookup[node.id] = filteredChildrenCount;
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
    filteredChildrenCountLookup,
    filteredDescendantCountLookup,
  };
};
