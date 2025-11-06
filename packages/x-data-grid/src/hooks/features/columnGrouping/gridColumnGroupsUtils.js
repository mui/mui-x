"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnGroupsHeaderStructure = exports.unwrapGroupingColumnModel = exports.createGroupLookup = void 0;
var gridColumnGrouping_1 = require("../../../models/gridColumnGrouping");
var createGroupLookup = function (columnGroupingModel) {
    var groupLookup = {};
    for (var i = 0; i < columnGroupingModel.length; i += 1) {
        var node = columnGroupingModel[i];
        if ((0, gridColumnGrouping_1.isLeaf)(node)) {
            continue;
        }
        var groupId = node.groupId, children = node.children, other = __rest(node, ["groupId", "children"]);
        if (!groupId) {
            throw new Error('MUI X: An element of the columnGroupingModel does not have either `field` or `groupId`.');
        }
        if (process.env.NODE_ENV !== 'production' && !children) {
            console.warn("MUI X: group groupId=".concat(groupId, " has no children."));
        }
        var groupParam = __assign(__assign({}, other), { groupId: groupId });
        var subTreeLookup = (0, exports.createGroupLookup)(children);
        if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
            throw new Error("MUI X: The groupId ".concat(groupId, " is used multiple times in the columnGroupingModel."));
        }
        Object.assign(groupLookup, subTreeLookup);
        groupLookup[groupId] = groupParam;
    }
    return groupLookup;
};
exports.createGroupLookup = createGroupLookup;
// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
var recurrentUnwrapGroupingColumnModel = function (columnGroupNode, parents, unwrappedGroupingModelToComplete) {
    if ((0, gridColumnGrouping_1.isLeaf)(columnGroupNode)) {
        if (unwrappedGroupingModelToComplete[columnGroupNode.field] !== undefined) {
            throw new Error([
                "MUI X: columnGroupingModel contains duplicated field",
                "column field ".concat(columnGroupNode.field, " occurs two times in the grouping model:"),
                "- ".concat(unwrappedGroupingModelToComplete[columnGroupNode.field].join(' > ')),
                "- ".concat(parents.join(' > ')),
            ].join('\n'));
        }
        unwrappedGroupingModelToComplete[columnGroupNode.field] = parents;
        return;
    }
    var groupId = columnGroupNode.groupId, children = columnGroupNode.children;
    children.forEach(function (child) {
        recurrentUnwrapGroupingColumnModel(child, __spreadArray(__spreadArray([], parents, true), [groupId], false), unwrappedGroupingModelToComplete);
    });
};
/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */
var unwrapGroupingColumnModel = function (columnGroupingModel) {
    if (!columnGroupingModel) {
        return {};
    }
    var unwrappedSubTree = {};
    columnGroupingModel.forEach(function (columnGroupNode) {
        recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
    });
    return unwrappedSubTree;
};
exports.unwrapGroupingColumnModel = unwrapGroupingColumnModel;
var getColumnGroupsHeaderStructure = function (orderedColumns, unwrappedGroupingModel, pinnedFields) {
    var _a;
    var getParents = function (field) { var _a; return (_a = unwrappedGroupingModel[field]) !== null && _a !== void 0 ? _a : []; };
    var groupingHeaderStructure = [];
    var maxDepth = Math.max.apply(Math, __spreadArray([0], orderedColumns.map(function (field) { return getParents(field).length; }), false));
    var haveSameParents = function (field1, field2, depth) {
        var a = getParents(field1);
        var b = getParents(field2);
        for (var i = 0; i <= depth; i += 1) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    };
    var haveDifferentContainers = function (field1, field2) {
        var left = pinnedFields === null || pinnedFields === void 0 ? void 0 : pinnedFields.left;
        var right = pinnedFields === null || pinnedFields === void 0 ? void 0 : pinnedFields.right;
        var inLeft1 = !!(left === null || left === void 0 ? void 0 : left.includes(field1));
        var inLeft2 = !!(left === null || left === void 0 ? void 0 : left.includes(field2));
        var inRight1 = !!(right === null || right === void 0 ? void 0 : right.includes(field1));
        var inRight2 = !!(right === null || right === void 0 ? void 0 : right.includes(field2));
        return inLeft1 !== inLeft2 || inRight1 !== inRight2;
    };
    for (var depth = 0; depth < maxDepth; depth += 1) {
        var depthStructure = [];
        for (var i = 0; i < orderedColumns.length; i += 1) {
            var field = orderedColumns[i];
            var groupId = (_a = getParents(field)[depth]) !== null && _a !== void 0 ? _a : null;
            if (depthStructure.length === 0) {
                depthStructure.push({ columnFields: [field], groupId: groupId });
                continue;
            }
            var lastGroup = depthStructure[depthStructure.length - 1];
            var prevField = lastGroup.columnFields[lastGroup.columnFields.length - 1];
            if (lastGroup.groupId !== groupId ||
                !haveSameParents(prevField, field, depth) ||
                haveDifferentContainers(prevField, field)) {
                depthStructure.push({ columnFields: [field], groupId: groupId });
            }
            else {
                lastGroup.columnFields.push(field);
            }
        }
        groupingHeaderStructure.push(depthStructure);
    }
    return groupingHeaderStructure;
};
exports.getColumnGroupsHeaderStructure = getColumnGroupsHeaderStructure;
