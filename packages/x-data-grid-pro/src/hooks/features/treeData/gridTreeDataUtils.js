import { passFilterLogic, } from '@mui/x-data-grid/internals';
export var TreeDataStrategy;
(function (TreeDataStrategy) {
    TreeDataStrategy["Default"] = "tree-data";
    TreeDataStrategy["DataSource"] = "tree-data-source";
})(TreeDataStrategy || (TreeDataStrategy = {}));
/**
 * A node is visible if one of the following criteria is met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export const filterRowTreeFromTreeData = (params) => {
    const { apiRef, rowTree, disableChildrenFiltering, isRowMatchingFilters } = params;
    const filteredRowsLookup = {};
    const filteredChildrenCountLookup = {};
    const filteredDescendantCountLookup = {};
    const filterCache = {};
    const filterResults = {
        passingFilterItems: null,
        passingQuickFilterValues: null,
    };
    const filterTreeNode = (node, isParentMatchingFilters, areAncestorsExpanded) => {
        const shouldSkipFilters = disableChildrenFiltering && node.depth > 0;
        let isMatchingFilters;
        if (shouldSkipFilters) {
            isMatchingFilters = null;
        }
        else if (!isRowMatchingFilters || node.type === 'footer') {
            isMatchingFilters = true;
        }
        else {
            const row = apiRef.current.getRow(node.id);
            isRowMatchingFilters(row, undefined, filterResults);
            isMatchingFilters = passFilterLogic([filterResults.passingFilterItems], [filterResults.passingQuickFilterValues], params.filterModel, params.filterValueGetter, params.apiRef, filterCache);
        }
        let filteredChildrenCount = 0;
        let filteredDescendantCount = 0;
        if (node.type === 'group') {
            node.children.forEach((childId) => {
                const childNode = rowTree[childId];
                const childSubTreeSize = filterTreeNode(childNode, isMatchingFilters ?? isParentMatchingFilters, areAncestorsExpanded && !!node.childrenExpanded);
                filteredDescendantCount += childSubTreeSize;
                if (childSubTreeSize > 0) {
                    filteredChildrenCount += 1;
                }
            });
        }
        let shouldPassFilters;
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
        if (!shouldPassFilters) {
            filteredRowsLookup[node.id] = false;
        }
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
