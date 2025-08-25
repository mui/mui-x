"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSkeletonRowsSection = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var findSkeletonRowsSection = function (_a) {
    var _b, _c;
    var apiRef = _a.apiRef, visibleRows = _a.visibleRows, range = _a.range;
    var firstRowIndex = range.firstRowIndex, lastRowIndex = range.lastRowIndex;
    var visibleRowsSection = visibleRows.slice(range.firstRowIndex, range.lastRowIndex);
    var startIndex = 0;
    var endIndex = visibleRowsSection.length - 1;
    var isSkeletonSectionFound = false;
    while (!isSkeletonSectionFound && firstRowIndex < lastRowIndex) {
        var isStartingWithASkeletonRow = ((_b = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, visibleRowsSection[startIndex].id)) === null || _b === void 0 ? void 0 : _b.type) === 'skeletonRow';
        var isEndingWithASkeletonRow = ((_c = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, visibleRowsSection[endIndex].id)) === null || _c === void 0 ? void 0 : _c.type) === 'skeletonRow';
        if (isStartingWithASkeletonRow && isEndingWithASkeletonRow) {
            isSkeletonSectionFound = true;
        }
        if (!isStartingWithASkeletonRow) {
            startIndex += 1;
            firstRowIndex += 1;
        }
        if (!isEndingWithASkeletonRow) {
            endIndex -= 1;
            lastRowIndex -= 1;
        }
    }
    return isSkeletonSectionFound
        ? {
            firstRowIndex: firstRowIndex,
            lastRowIndex: lastRowIndex,
        }
        : undefined;
};
exports.findSkeletonRowsSection = findSkeletonRowsSection;
