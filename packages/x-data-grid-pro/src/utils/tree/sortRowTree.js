"use strict";
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
exports.sortRowTree = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
// Single-linked list node
var Node = /** @class */ (function () {
    function Node(data, next) {
        this.next = next;
        this.data = data;
    }
    Node.prototype.insertAfter = function (list) {
        if (!list.first || !list.last) {
            return;
        }
        var next = this.next;
        this.next = list.first;
        list.last.next = next;
    };
    return Node;
}());
// Single-linked list container
var List = /** @class */ (function () {
    function List(first, last) {
        this.first = first;
        this.last = last;
    }
    List.prototype.data = function () {
        var array = [];
        this.forEach(function (node) {
            array.push(node.data);
        });
        return array;
    };
    List.prototype.forEach = function (fn) {
        var current = this.first;
        while (current !== null) {
            fn(current);
            current = current.next;
        }
    };
    List.from = function (array) {
        if (array.length === 0) {
            return new List(null, null);
        }
        var index = 0;
        var first = new Node(array[index], null);
        var current = first;
        while (index + 1 < array.length) {
            index += 1;
            var node = new Node(array[index], null);
            current.next = node;
            current = node;
        }
        return new List(first, current);
    };
    return List;
}());
var sortRowTree = function (params) {
    var rowTree = params.rowTree, disableChildrenSorting = params.disableChildrenSorting, sortRowList = params.sortRowList, shouldRenderGroupBelowLeaves = params.shouldRenderGroupBelowLeaves;
    var sortedGroupedByParentRows = new Map();
    var sortGroup = function (node) {
        var shouldSortGroup = !!sortRowList && (!disableChildrenSorting || node.depth === -1);
        var sortedRowIds;
        if (shouldSortGroup) {
            for (var i = 0; i < node.children.length; i += 1) {
                var childNode = rowTree[node.children[i]];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                }
            }
            sortedRowIds = sortRowList(node.children.map(function (childId) { return rowTree[childId]; }));
        }
        else if (shouldRenderGroupBelowLeaves) {
            var childrenLeaves = [];
            var childrenGroups = [];
            for (var i = 0; i < node.children.length; i += 1) {
                var childId = node.children[i];
                var childNode = rowTree[childId];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                    childrenGroups.push(childId);
                }
                else if (childNode.type === 'leaf') {
                    childrenLeaves.push(childId);
                }
            }
            sortedRowIds = __spreadArray(__spreadArray([], childrenLeaves, true), childrenGroups, true);
        }
        else {
            for (var i = 0; i < node.children.length; i += 1) {
                var childNode = rowTree[node.children[i]];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                }
            }
            sortedRowIds = __spreadArray([], node.children, true);
        }
        if (node.footerId != null) {
            sortedRowIds.push(node.footerId);
        }
        sortedGroupedByParentRows.set(node.id, sortedRowIds);
    };
    sortGroup(rowTree[x_data_grid_1.GRID_ROOT_GROUP_ID]);
    var rootList = List.from(sortedGroupedByParentRows.get(x_data_grid_1.GRID_ROOT_GROUP_ID));
    rootList.forEach(function (node) {
        var children = sortedGroupedByParentRows.get(node.data);
        if (children === null || children === void 0 ? void 0 : children.length) {
            node.insertAfter(List.from(children));
        }
    });
    return rootList.data();
};
exports.sortRowTree = sortRowTree;
