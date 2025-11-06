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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTreeDataOptionsToDemoData = void 0;
var random_generator_1 = require("./random-generator");
var addTreeDataOptionsToDemoData = function (data, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var _b = options.averageChildren, averageChildren = _b === void 0 ? 2 : _b, _c = options.maxDepth, maxDepth = _c === void 0 ? 1 : _c, groupingField = options.groupingField;
    var hasTreeData = maxDepth > 1 && groupingField != null;
    if (!hasTreeData) {
        return data;
    }
    if (data.rows.length > 1000) {
        throw new Error('MUI X: useDemoData tree data mode only works up to 1000 rows.');
    }
    var rowsByTreeDepth = {};
    var rowsCount = data.rows.length;
    var groupingCol = data.columns.find(function (col) { return col.field === options.groupingField; });
    if (!groupingCol) {
        throw new Error('MUI X: The tree data grouping field does not exist.');
    }
    data.initialState.columns.columnVisibilityModel[groupingField] = false;
    for (var i = 0; i < rowsCount; i += 1) {
        var row = data.rows[i];
        var currentChunk = Math.floor((i * (Math.pow(averageChildren, maxDepth) - 1)) / rowsCount) + 1;
        var currentDepth = Math.floor(Math.log(currentChunk) / Math.log(averageChildren));
        if (!rowsByTreeDepth[currentDepth]) {
            rowsByTreeDepth[currentDepth] = { rows: {}, rowIndexes: [] };
        }
        rowsByTreeDepth[currentDepth].rows[i] = { value: row, parentIndex: null };
        rowsByTreeDepth[currentDepth].rowIndexes.push(i);
    }
    Object.entries(rowsByTreeDepth).forEach(function (_a) {
        var depthStr = _a[0], rows = _a[1].rows;
        var depth = Number(depthStr);
        Object.values(rows).forEach(function (row) {
            var path = [];
            var previousRow = null;
            for (var k = depth; k >= 0; k -= 1) {
                var rowTemp = void 0;
                if (k === depth) {
                    if (depth > 0) {
                        row.parentIndex = Number((0, random_generator_1.randomArrayItem)(rowsByTreeDepth[depth - 1].rowIndexes));
                    }
                    rowTemp = row;
                }
                else {
                    rowTemp = rowsByTreeDepth[k].rows[previousRow.parentIndex];
                }
                path.unshift(rowTemp.value[groupingField]);
                previousRow = rowTemp;
            }
            row.value.path = path;
        });
    });
    return __assign(__assign({}, data), { groupingColDef: {
            headerName: (_a = groupingCol.headerName) !== null && _a !== void 0 ? _a : groupingCol.field,
            width: 250,
        }, getTreeDataPath: function (row) { return row.path; }, treeData: true });
};
exports.addTreeDataOptionsToDemoData = addTreeDataOptionsToDemoData;
