"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveElement = void 0;
exports.isOverflown = isOverflown;
exports.findParentElementFromClassName = findParentElementFromClassName;
exports.escapeOperandAttributeSelector = escapeOperandAttributeSelector;
exports.getGridColumnHeaderElement = getGridColumnHeaderElement;
exports.getGridRowElement = getGridRowElement;
exports.getGridCellElement = getGridCellElement;
exports.isEventTargetInPortal = isEventTargetInPortal;
exports.getFieldFromHeaderElem = getFieldFromHeaderElem;
exports.findHeaderElementFromField = findHeaderElementFromField;
exports.getFieldsFromGroupHeaderElem = getFieldsFromGroupHeaderElem;
exports.findGroupHeaderElementsFromField = findGroupHeaderElementsFromField;
exports.findGridCellElementsFromCol = findGridCellElementsFromCol;
exports.findGridElement = findGridElement;
exports.findLeftPinnedCellsAfterCol = findLeftPinnedCellsAfterCol;
exports.findRightPinnedCellsBeforeCol = findRightPinnedCellsBeforeCol;
exports.findLeftPinnedHeadersAfterCol = findLeftPinnedHeadersAfterCol;
exports.findRightPinnedHeadersBeforeCol = findRightPinnedHeadersBeforeCol;
exports.findGridHeader = findGridHeader;
exports.findGridCells = findGridCells;
var gridClasses_1 = require("../constants/gridClasses");
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function findParentElementFromClassName(elem, className) {
    return elem.closest(".".concat(className));
}
// TODO, eventually replaces this function with CSS.escape, once available in jsdom, either added manually or built in
// https://github.com/jsdom/jsdom/issues/1550#issuecomment-236734471
function escapeOperandAttributeSelector(operand) {
    return operand.replace(/["\\]/g, '\\$&');
}
function getGridColumnHeaderElement(root, field) {
    return root.querySelector("[role=\"columnheader\"][data-field=\"".concat(escapeOperandAttributeSelector(field), "\"]"));
}
function getGridRowElementSelector(id) {
    return ".".concat(gridClasses_1.gridClasses.row, "[data-id=\"").concat(escapeOperandAttributeSelector(String(id)), "\"]");
}
function getGridRowElement(root, id) {
    return root.querySelector(getGridRowElementSelector(id));
}
function getGridCellElement(root, _a) {
    var id = _a.id, field = _a.field;
    var rowSelector = getGridRowElementSelector(id);
    var cellSelector = ".".concat(gridClasses_1.gridClasses.cell, "[data-field=\"").concat(escapeOperandAttributeSelector(field), "\"]");
    var selector = "".concat(rowSelector, " ").concat(cellSelector);
    return root.querySelector(selector);
}
// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
var getActiveElement = function (root) {
    if (root === void 0) { root = document; }
    var activeEl = root.activeElement;
    if (!activeEl) {
        return null;
    }
    if (activeEl.shadowRoot) {
        return (0, exports.getActiveElement)(activeEl.shadowRoot);
    }
    return activeEl;
};
exports.getActiveElement = getActiveElement;
function isEventTargetInPortal(event) {
    if (
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    event.target.nodeType === 1 &&
        !event.currentTarget.contains(event.target)) {
        return true;
    }
    return false;
}
function getFieldFromHeaderElem(colCellEl) {
    return colCellEl.getAttribute('data-field');
}
function findHeaderElementFromField(elem, field) {
    return elem.querySelector("[data-field=\"".concat(escapeOperandAttributeSelector(field), "\"]"));
}
function getFieldsFromGroupHeaderElem(colCellEl) {
    return colCellEl.getAttribute('data-fields').slice(2, -2).split('-|-');
}
function findGroupHeaderElementsFromField(elem, field) {
    var _a;
    return Array.from((_a = elem.querySelectorAll("[data-fields*=\"|-".concat(escapeOperandAttributeSelector(field), "-|\"]"))) !== null && _a !== void 0 ? _a : []);
}
function findGridCellElementsFromCol(col, api) {
    var _a;
    var root = findParentElementFromClassName(col, gridClasses_1.gridClasses.root);
    if (!root) {
        throw new Error('MUI X: The root element is not found.');
    }
    var ariaColIndex = col.getAttribute('aria-colindex');
    if (!ariaColIndex) {
        return [];
    }
    var colIndex = Number(ariaColIndex) - 1;
    var cells = [];
    if (!((_a = api.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current)) {
        return [];
    }
    queryRows(api).forEach(function (rowElement) {
        var rowId = rowElement.getAttribute('data-id');
        if (!rowId) {
            return;
        }
        var columnIndex = colIndex;
        var cellColSpanInfo = api.unstable_getCellColSpanInfo(rowId, colIndex);
        if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
            columnIndex = cellColSpanInfo.leftVisibleCellIndex;
        }
        var cell = rowElement.querySelector("[data-colindex=\"".concat(columnIndex, "\"]"));
        if (cell) {
            cells.push(cell);
        }
    });
    return cells;
}
function findGridElement(api, klass) {
    return api.rootElementRef.current.querySelector(".".concat(gridClasses_1.gridClasses[klass]));
}
var findPinnedCells = function (_a) {
    var api = _a.api, colIndex = _a.colIndex, position = _a.position, filterFn = _a.filterFn;
    if (colIndex === null) {
        return [];
    }
    var cells = [];
    queryRows(api).forEach(function (rowElement) {
        var rowId = rowElement.getAttribute('data-id');
        if (!rowId) {
            return;
        }
        rowElement
            .querySelectorAll(".".concat(gridClasses_1.gridClasses[position === 'left' ? 'cell--pinnedLeft' : 'cell--pinnedRight']))
            .forEach(function (cell) {
            var currentColIndex = parseCellColIndex(cell);
            if (currentColIndex !== null && filterFn(currentColIndex)) {
                cells.push(cell);
            }
        });
    });
    return cells;
};
function findLeftPinnedCellsAfterCol(api, col, isRtl) {
    var colIndex = parseCellColIndex(col);
    return findPinnedCells({
        api: api,
        colIndex: colIndex,
        position: isRtl ? 'right' : 'left',
        filterFn: function (index) { return (isRtl ? index < colIndex : index > colIndex); },
    });
}
function findRightPinnedCellsBeforeCol(api, col, isRtl) {
    var colIndex = parseCellColIndex(col);
    return findPinnedCells({
        api: api,
        colIndex: colIndex,
        position: isRtl ? 'left' : 'right',
        filterFn: function (index) { return (isRtl ? index > colIndex : index < colIndex); },
    });
}
var findPinnedHeaders = function (_a) {
    var _b;
    var api = _a.api, colIndex = _a.colIndex, position = _a.position, filterFn = _a.filterFn;
    if (!((_b = api.columnHeadersContainerRef) === null || _b === void 0 ? void 0 : _b.current)) {
        return [];
    }
    if (colIndex === null) {
        return [];
    }
    var elements = [];
    api.columnHeadersContainerRef.current
        .querySelectorAll(".".concat(gridClasses_1.gridClasses[position === 'left' ? 'columnHeader--pinnedLeft' : 'columnHeader--pinnedRight']))
        .forEach(function (element) {
        var currentColIndex = parseCellColIndex(element);
        if (currentColIndex !== null && filterFn(currentColIndex, element)) {
            elements.push(element);
        }
    });
    return elements;
};
function findLeftPinnedHeadersAfterCol(api, col, isRtl) {
    var colIndex = parseCellColIndex(col);
    return findPinnedHeaders({
        api: api,
        position: isRtl ? 'right' : 'left',
        colIndex: colIndex,
        filterFn: function (index) { return (isRtl ? index < colIndex : index > colIndex); },
    });
}
function findRightPinnedHeadersBeforeCol(api, col, isRtl) {
    var colIndex = parseCellColIndex(col);
    return findPinnedHeaders({
        api: api,
        position: isRtl ? 'left' : 'right',
        colIndex: colIndex,
        filterFn: function (index, element) {
            if (element.classList.contains(gridClasses_1.gridClasses['columnHeader--last'])) {
                return false;
            }
            return isRtl ? index > colIndex : index < colIndex;
        },
    });
}
function findGridHeader(api, field) {
    var headers = api.columnHeadersContainerRef.current;
    return headers.querySelector(":scope > div > [data-field=\"".concat(escapeOperandAttributeSelector(field), "\"][role=\"columnheader\"]"));
}
function findGridCells(api, field) {
    var container = api.virtualScrollerRef.current;
    return Array.from(container.querySelectorAll(":scope > div > div > div > [data-field=\"".concat(escapeOperandAttributeSelector(field), "\"][role=\"gridcell\"]")));
}
function queryRows(api) {
    return api.virtualScrollerRef.current.querySelectorAll(
    // Use > to ignore rows from nested Data Grids (for example in detail panel)
    ":scope > div > div > .".concat(gridClasses_1.gridClasses.row));
}
function parseCellColIndex(col) {
    var ariaColIndex = col.getAttribute('aria-colindex');
    if (!ariaColIndex) {
        return null;
    }
    return Number(ariaColIndex) - 1;
}
