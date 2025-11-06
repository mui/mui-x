"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchRowUpdater = exports.collectAllLeafDescendants = exports.getNodePathInTree = exports.conditions = void 0;
exports.determineOperationType = determineOperationType;
exports.calculateTargetIndex = calculateTargetIndex;
exports.adjustTargetNode = adjustTargetNode;
exports.findExistingGroupWithSameKey = findExistingGroupWithSameKey;
exports.removeEmptyAncestors = removeEmptyAncestors;
exports.handleProcessRowUpdateError = handleProcessRowUpdateError;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var warning_1 = require("@mui/x-internals/warning");
// TODO: Share these conditions with the executor by making the contexts similar
/**
 * Reusable validation conditions for row reordering validation
 */
exports.conditions = {
    // Node type checks
    isGroupToGroup: function (ctx) { return ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'group'; },
    isLeafToLeaf: function (ctx) { return ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'leaf'; },
    isLeafToGroup: function (ctx) { return ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'group'; },
    isGroupToLeaf: function (ctx) { return ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'leaf'; },
    // Drop position checks
    isDropAbove: function (ctx) { return ctx.dropPosition === 'above'; },
    isDropBelow: function (ctx) { return ctx.dropPosition === 'below'; },
    // Depth checks
    sameDepth: function (ctx) { return ctx.sourceNode.depth === ctx.targetNode.depth; },
    sourceDepthGreater: function (ctx) { return ctx.sourceNode.depth > ctx.targetNode.depth; },
    targetDepthIsSourceMinusOne: function (ctx) { return ctx.targetNode.depth === ctx.sourceNode.depth - 1; },
    // Parent checks
    sameParent: function (ctx) { return ctx.sourceNode.parent === ctx.targetNode.parent; },
    // Node state checks
    targetGroupExpanded: function (ctx) {
        var _a;
        return (_a = (ctx.targetNode.type === 'group' && ctx.targetNode.childrenExpanded)) !== null && _a !== void 0 ? _a : false;
    },
    targetGroupCollapsed: function (ctx) {
        return ctx.targetNode.type === 'group' && !ctx.targetNode.childrenExpanded;
    },
    // Previous/Next node checks
    hasPrevNode: function (ctx) { return ctx.prevNode !== null; },
    hasNextNode: function (ctx) { return ctx.nextNode !== null; },
    prevIsLeaf: function (ctx) { var _a; return ((_a = ctx.prevNode) === null || _a === void 0 ? void 0 : _a.type) === 'leaf'; },
    prevIsGroup: function (ctx) { var _a; return ((_a = ctx.prevNode) === null || _a === void 0 ? void 0 : _a.type) === 'group'; },
    nextIsLeaf: function (ctx) { var _a; return ((_a = ctx.nextNode) === null || _a === void 0 ? void 0 : _a.type) === 'leaf'; },
    nextIsGroup: function (ctx) { var _a; return ((_a = ctx.nextNode) === null || _a === void 0 ? void 0 : _a.type) === 'group'; },
    prevDepthEquals: function (ctx, depth) { var _a; return ((_a = ctx.prevNode) === null || _a === void 0 ? void 0 : _a.depth) === depth; },
    prevDepthEqualsSource: function (ctx) { var _a; return ((_a = ctx.prevNode) === null || _a === void 0 ? void 0 : _a.depth) === ctx.sourceNode.depth; },
    // Complex checks
    prevBelongsToSource: function (ctx) {
        if (!ctx.prevNode) {
            return false;
        }
        // Check if prevNode.parent OR any of its ancestors === sourceNode.id
        var currentId = ctx.prevNode.parent;
        while (currentId) {
            if (currentId === ctx.sourceNode.id) {
                return true;
            }
            var node = ctx.rowTree[currentId];
            if (!node) {
                break;
            }
            currentId = node.parent;
        }
        return false;
    },
    // Position checks
    isAdjacentPosition: function (ctx) {
        var sourceRowIndex = ctx.sourceRowIndex, targetRowIndex = ctx.targetRowIndex, dropPosition = ctx.dropPosition;
        return ((dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
            (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1));
    },
    // First child check
    targetFirstChildIsGroupWithSourceDepth: function (ctx) {
        var _a;
        if (ctx.targetNode.type !== 'group') {
            return false;
        }
        var targetGroup = ctx.targetNode;
        var firstChild = ((_a = targetGroup.children) === null || _a === void 0 ? void 0 : _a[0]) ? ctx.rowTree[targetGroup.children[0]] : null;
        return (firstChild === null || firstChild === void 0 ? void 0 : firstChild.type) === 'group' && firstChild.depth === ctx.sourceNode.depth;
    },
    targetFirstChildDepthEqualsSource: function (ctx) {
        var _a;
        if (ctx.targetNode.type !== 'group') {
            return false;
        }
        var targetGroup = ctx.targetNode;
        var firstChild = ((_a = targetGroup.children) === null || _a === void 0 ? void 0 : _a[0]) ? ctx.rowTree[targetGroup.children[0]] : null;
        return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
    },
};
function determineOperationType(sourceNode, targetNode) {
    if (sourceNode.parent === targetNode.parent) {
        return 'same-parent-swap';
    }
    if (sourceNode.type === 'leaf') {
        return 'cross-parent-leaf';
    }
    return 'cross-parent-group';
}
function calculateTargetIndex(sourceNode, targetNode, isLastChild, rowTree) {
    if (sourceNode.parent === targetNode.parent && !isLastChild) {
        // Same parent: find target's position in parent's children
        var parent_1 = rowTree[sourceNode.parent];
        return parent_1.children.findIndex(function (id) { return id === targetNode.id; });
    }
    if (isLastChild) {
        // Append at the end
        var targetParent_1 = rowTree[targetNode.parent];
        return targetParent_1.children.length;
    }
    // Find position in target parent
    var targetParent = rowTree[targetNode.parent];
    var targetIndex = targetParent.children.findIndex(function (id) { return id === targetNode.id; });
    return targetIndex >= 0 ? targetIndex : 0;
}
// Get the path from a node to the root in the tree
var getNodePathInTree = function (_a) {
    var id = _a.id, tree = _a.tree;
    var path = [];
    var node = tree[id];
    while (node.id !== x_data_grid_pro_1.GRID_ROOT_GROUP_ID) {
        path.push({
            field: node.type === 'leaf' ? null : node.groupingField,
            key: node.groupingKey,
        });
        node = tree[node.parent];
    }
    path.reverse();
    return path;
};
exports.getNodePathInTree = getNodePathInTree;
// Recursively collect all leaf node IDs from a group
var collectAllLeafDescendants = function (groupNode, tree) {
    var leafIds = [];
    var collectFromNode = function (nodeId) {
        var node = tree[nodeId];
        if (node.type === 'leaf') {
            leafIds.push(nodeId);
        }
        else if (node.type === 'group') {
            node.children.forEach(collectFromNode);
        }
    };
    groupNode.children.forEach(collectFromNode);
    return leafIds;
};
exports.collectAllLeafDescendants = collectAllLeafDescendants;
/**
 * Adjusts the target node based on specific reorder scenarios and constraints.
 *
 * This function applies scenario-specific logic to find the actual target node
 * for operations, handling cases like:
 * - Moving to collapsed groups
 * - Depth-based adjustments
 * - End-of-list positioning
 *
 * @param sourceNode The node being moved
 * @param targetNode The initial target node
 * @param targetIndex The index of the target node in the visible rows
 * @param placeholderIndex The index where the placeholder appears
 * @param sortedFilteredRowIds Array of visible row IDs in display order
 * @param apiRef Reference to the grid API
 * @returns Object containing the adjusted target node and last child flag
 */
function adjustTargetNode(sourceNode, targetNode, targetIndex, placeholderIndex, sortedFilteredRowIds, apiRef) {
    var adjustedTargetNode = targetNode;
    var isLastChild = false;
    // Handle end-of-list case
    if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
        isLastChild = true;
    }
    // Case A and B adjustment: Move to last child of parent where target should be the node above
    if (targetNode.type === 'group' &&
        sourceNode.parent !== targetNode.parent &&
        sourceNode.depth > targetNode.depth) {
        // Find the first node with the same depth as source before target and quit early if a
        // node with depth < source.depth is found
        var i = targetIndex - 1;
        while (i >= 0) {
            var node = apiRef.current.getRowNode(sortedFilteredRowIds[i]);
            if (node && node.depth < sourceNode.depth) {
                break;
            }
            if (node && node.depth === sourceNode.depth) {
                adjustedTargetNode = node;
                break;
            }
            i -= 1;
        }
    }
    // Case D adjustment: Leaf to group where we need previous leaf
    if (sourceNode.type === 'leaf' &&
        targetNode.type === 'group' &&
        targetNode.depth < sourceNode.depth) {
        isLastChild = true;
        var prevIndex = placeholderIndex - 1;
        if (prevIndex >= 0) {
            var prevRowId = sortedFilteredRowIds[prevIndex];
            var leafTargetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, prevRowId);
            if (leafTargetNode && leafTargetNode.type === 'leaf') {
                adjustedTargetNode = leafTargetNode;
            }
        }
    }
    return { adjustedTargetNode: adjustedTargetNode, isLastChild: isLastChild };
}
/**
 * Finds an existing group node with the same groupingKey and groupingField under a parent.
 *
 * @param parentNode - The parent group node to search in
 * @param groupingKey - The grouping key to match
 * @param groupingField - The grouping field to match
 * @param tree - The row tree configuration
 * @returns The existing group node if found, null otherwise
 */
function findExistingGroupWithSameKey(parentNode, groupingKey, groupingField, tree) {
    for (var _i = 0, _a = parentNode.children; _i < _a.length; _i++) {
        var childId = _a[_i];
        var childNode = tree[childId];
        if (childNode &&
            childNode.type === 'group' &&
            childNode.groupingKey === groupingKey &&
            childNode.groupingField === groupingField) {
            return childNode;
        }
    }
    return null;
}
/**
 * Removes empty ancestor groups from the tree after a row move operation.
 * Walks up the tree from the given group, removing any empty groups encountered.
 *
 * @param groupId - The ID of the group to start checking from
 * @param tree - The row tree configuration
 * @param removedGroups - Set to track which groups have been removed
 * @returns The number of root-level groups that were removed
 */
function removeEmptyAncestors(groupId, tree, removedGroups) {
    var rootLevelRemovals = 0;
    var currentGroupId = groupId;
    while (currentGroupId && currentGroupId !== x_data_grid_pro_1.GRID_ROOT_GROUP_ID) {
        var group = tree[currentGroupId];
        if (!group) {
            break;
        }
        var remainingChildren = group.children.filter(function (childId) { return !removedGroups.has(childId); });
        if (remainingChildren.length > 0) {
            break;
        }
        if (group.depth === 0) {
            rootLevelRemovals += 1;
        }
        removedGroups.add(currentGroupId);
        currentGroupId = group.parent;
    }
    return rootLevelRemovals;
}
function handleProcessRowUpdateError(error, onProcessRowUpdateError) {
    if (onProcessRowUpdateError) {
        onProcessRowUpdateError(error);
    }
    else if (process.env.NODE_ENV !== 'production') {
        (0, warning_1.warnOnce)([
            'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
            'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
            'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
        ], 'error');
    }
}
/**
 * Handles batch row updates with partial failure tracking.
 *
 * This class is designed for operations that need to update multiple rows
 * atomically (like moving entire groups), while gracefully handling cases
 * where some updates succeed and others fail.
 *
 * @example
 * ```tsx
 * const updater = new BatchRowUpdater(processRowUpdate, onError);
 *
 * // Queue multiple updates
 * updater.queueUpdate('row1', originalRow1, newRow1);
 * updater.queueUpdate('row2', originalRow2, newRow2);
 *
 * // Execute all updates
 * const { successful, failed, updates } = await updater.executeAll();
 *
 * // Handle results
 * if (successful.length > 0) {
 *   apiRef.current.updateRows(updates);
 * }
 * ```
 */
var BatchRowUpdater = /** @class */ (function () {
    function BatchRowUpdater(processRowUpdate, onProcessRowUpdateError) {
        this.processRowUpdate = processRowUpdate;
        this.onProcessRowUpdateError = onProcessRowUpdateError;
        this.rowsToUpdate = new Map();
        this.originalRows = new Map();
        this.successfulRowIds = new Set();
        this.failedRowIds = new Set();
        this.pendingRowUpdates = [];
    }
    BatchRowUpdater.prototype.queueUpdate = function (rowId, originalRow, updatedRow) {
        this.originalRows.set(rowId, originalRow);
        this.rowsToUpdate.set(rowId, updatedRow);
    };
    BatchRowUpdater.prototype.executeAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rowIds, handleRowUpdate, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowIds = Array.from(this.rowsToUpdate.keys());
                        if (rowIds.length === 0) {
                            return [2 /*return*/, { successful: [], failed: [], updates: [] }];
                        }
                        handleRowUpdate = function (rowId) { return __awaiter(_this, void 0, void 0, function () {
                            var newRow, oldRow, params, finalRow, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newRow = this.rowsToUpdate.get(rowId);
                                        oldRow = this.originalRows.get(rowId);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 5, , 6]);
                                        if (!(typeof this.processRowUpdate === 'function')) return [3 /*break*/, 3];
                                        params = {
                                            rowId: rowId,
                                            previousRow: oldRow,
                                            updatedRow: newRow,
                                        };
                                        return [4 /*yield*/, this.processRowUpdate(newRow, oldRow, params)];
                                    case 2:
                                        finalRow = _a.sent();
                                        this.pendingRowUpdates.push(finalRow || newRow);
                                        this.successfulRowIds.add(rowId);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        this.pendingRowUpdates.push(newRow);
                                        this.successfulRowIds.add(rowId);
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_1 = _a.sent();
                                        this.failedRowIds.add(rowId);
                                        handleProcessRowUpdateError(error_1, this.onProcessRowUpdateError);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        promises = rowIds.map(function (rowId) {
                            return new Promise(function (resolve) {
                                handleRowUpdate(rowId).then(resolve).catch(resolve);
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                successful: Array.from(this.successfulRowIds),
                                failed: Array.from(this.failedRowIds),
                                updates: this.pendingRowUpdates,
                            }];
                }
            });
        });
    };
    return BatchRowUpdater;
}());
exports.BatchRowUpdater = BatchRowUpdater;
