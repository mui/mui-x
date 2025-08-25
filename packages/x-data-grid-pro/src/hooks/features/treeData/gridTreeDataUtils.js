"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRowTreeFromTreeData = exports.TreeDataStrategy = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
var TreeDataStrategy;
(function (TreeDataStrategy) {
    TreeDataStrategy["Default"] = "tree-data";
    TreeDataStrategy["DataSource"] = "tree-data-source";
})(TreeDataStrategy || (exports.TreeDataStrategy = TreeDataStrategy = {}));
/**
 * A node is visible if one of the following criteria is met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
var filterRowTreeFromTreeData = function (params) {
    var apiRef = params.apiRef, rowTree = params.rowTree, disableChildrenFiltering = params.disableChildrenFiltering, isRowMatchingFilters = params.isRowMatchingFilters;
    var filteredRowsLookup = {};
    var filteredChildrenCountLookup = {};
    var filteredDescendantCountLookup = {};
    var filterCache = {};
    var filterResults = {
        passingFilterItems: null,
        passingQuickFilterValues: null,
    };
    var filterTreeNode = function (node, isParentMatchingFilters, areAncestorsExpanded) {
        var shouldSkipFilters = disableChildrenFiltering && node.depth > 0;
        var isMatchingFilters;
        if (shouldSkipFilters) {
            isMatchingFilters = null;
        }
        else if (!isRowMatchingFilters || node.type === 'footer') {
            isMatchingFilters = true;
        }
        else {
            var row = apiRef.current.getRow(node.id);
            isRowMatchingFilters(row, undefined, filterResults);
            isMatchingFilters = (0, internals_1.passFilterLogic)([filterResults.passingFilterItems], [filterResults.passingQuickFilterValues], params.filterModel, params.apiRef, filterCache);
        }
        var filteredChildrenCount = 0;
        var filteredDescendantCount = 0;
        if (node.type === 'group') {
            node.children.forEach(function (childId) {
                var childNode = rowTree[childId];
                var childSubTreeSize = filterTreeNode(childNode, isMatchingFilters !== null && isMatchingFilters !== void 0 ? isMatchingFilters : isParentMatchingFilters, areAncestorsExpanded && !!node.childrenExpanded);
                filteredDescendantCount += childSubTreeSize;
                if (childSubTreeSize > 0) {
                    filteredChildrenCount += 1;
                }
            });
        }
        var shouldPassFilters;
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
    var nodes = Object.values(rowTree);
    for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        if (node.depth === 0) {
            filterTreeNode(node, true, true);
        }
    }
    return {
        filteredRowsLookup: filteredRowsLookup,
        filteredChildrenCountLookup: filteredChildrenCountLookup,
        filteredDescendantCountLookup: filteredDescendantCountLookup,
    };
};
exports.filterRowTreeFromTreeData = filterRowTreeFromTreeData;
