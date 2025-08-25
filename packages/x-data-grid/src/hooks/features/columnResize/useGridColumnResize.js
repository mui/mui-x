"use strict";
'use client';
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
exports.useGridColumnResize = exports.columnResizeStateInitializer = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var domUtils_1 = require("../../../utils/domUtils");
var gridColumnResizeApi_1 = require("./gridColumnResizeApi");
var gridClasses_1 = require("../../../constants/gridClasses");
var utils_1 = require("../../utils");
var virtualization_1 = require("../virtualization");
var createControllablePromise_1 = require("../../../utils/createControllablePromise");
var utils_2 = require("../../../utils/utils");
var useTimeout_1 = require("../../utils/useTimeout");
var gridColumnsInterfaces_1 = require("../columns/gridColumnsInterfaces");
var columns_1 = require("../columns");
function trackFinger(event, currentTouchId) {
    if (currentTouchId !== undefined && event.changedTouches) {
        for (var i = 0; i < event.changedTouches.length; i += 1) {
            var touch = event.changedTouches[i];
            if (touch.identifier === currentTouchId) {
                return {
                    x: touch.clientX,
                    y: touch.clientY,
                };
            }
        }
        return false;
    }
    return {
        x: event.clientX,
        y: event.clientY,
    };
}
function computeNewWidth(initialOffsetToSeparator, clickX, columnBounds, resizeDirection) {
    var newWidth = initialOffsetToSeparator;
    if (resizeDirection === 'Right') {
        newWidth += clickX - columnBounds.left;
    }
    else {
        newWidth += columnBounds.right - clickX;
    }
    return newWidth;
}
function computeOffsetToSeparator(clickX, columnBounds, resizeDirection) {
    if (resizeDirection === 'Left') {
        return clickX - columnBounds.left;
    }
    return columnBounds.right - clickX;
}
function flipResizeDirection(side) {
    if (side === 'Right') {
        return 'Left';
    }
    return 'Right';
}
function getResizeDirection(separator, isRtl) {
    var side = separator.classList.contains(gridClasses_1.gridClasses['columnSeparator--sideRight'])
        ? 'Right'
        : 'Left';
    if (isRtl) {
        // Resizing logic should be mirrored in the RTL case
        return flipResizeDirection(side);
    }
    return side;
}
function preventClick(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
/**
 * Checker that returns a promise that resolves when the column virtualization
 * is disabled.
 */
function useColumnVirtualizationDisabled(apiRef) {
    var promise = React.useRef(undefined);
    var selector = function () { return (0, virtualization_1.gridVirtualizationColumnEnabledSelector)(apiRef); };
    var value = (0, utils_1.useGridSelector)(apiRef, selector);
    React.useEffect(function () {
        if (promise.current && value === false) {
            promise.current.resolve();
            promise.current = undefined;
        }
    });
    var asyncCheck = function () {
        if (!promise.current) {
            if (selector() === false) {
                return Promise.resolve();
            }
            promise.current = (0, createControllablePromise_1.createControllablePromise)();
        }
        return promise.current;
    };
    return asyncCheck;
}
/**
 * Basic statistical outlier detection, checks if the value is `F * IQR` away from
 * the Q1 and Q3 boundaries. IQR: interquartile range.
 */
function excludeOutliers(inputValues, factor) {
    if (inputValues.length < 4) {
        return inputValues;
    }
    var values = inputValues.slice();
    values.sort(function (a, b) { return a - b; });
    var q1 = values[Math.floor(values.length * 0.25)];
    var q3 = values[Math.floor(values.length * 0.75) - 1];
    var iqr = q3 - q1;
    // We make a small adjustment if `iqr < 5` for the cases where the IQR is
    // very small (for example zero) due to very close by values in the input data.
    // Otherwise, with an IQR of `0`, anything outside that would be considered
    // an outlier, but it makes more sense visually to allow for this 5px variance
    // rather than showing a cropped cell.
    var deviation = iqr < 5 ? 5 : iqr * factor;
    return values.filter(function (v) { return v > q1 - deviation && v < q3 + deviation; });
}
function extractColumnWidths(apiRef, options, columns) {
    var widthByField = {};
    var root = apiRef.current.rootElementRef.current;
    root.classList.add(gridClasses_1.gridClasses.autosizing);
    columns.forEach(function (column) {
        var _a, _b;
        var cells = (0, domUtils_1.findGridCells)(apiRef.current, column.field);
        var widths = cells.map(function (cell) {
            var _a;
            return (_a = cell.getBoundingClientRect().width) !== null && _a !== void 0 ? _a : 0;
        });
        var filteredWidths = options.includeOutliers
            ? widths
            : excludeOutliers(widths, options.outliersFactor);
        if (options.includeHeaders) {
            var header = (0, domUtils_1.findGridHeader)(apiRef.current, column.field);
            if (header) {
                var title = header.querySelector(".".concat(gridClasses_1.gridClasses.columnHeaderTitle));
                var content = header.querySelector(".".concat(gridClasses_1.gridClasses.columnHeaderTitleContainerContent));
                var iconContainer = header.querySelector(".".concat(gridClasses_1.gridClasses.iconButtonContainer));
                var menuContainer = header.querySelector(".".concat(gridClasses_1.gridClasses.menuIcon));
                var element = title !== null && title !== void 0 ? title : content;
                var style = window.getComputedStyle(header, null);
                var paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                var contentWidth = element.scrollWidth + 1;
                var width = contentWidth +
                    paddingWidth +
                    ((_a = iconContainer === null || iconContainer === void 0 ? void 0 : iconContainer.clientWidth) !== null && _a !== void 0 ? _a : 0) +
                    ((_b = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.clientWidth) !== null && _b !== void 0 ? _b : 0);
                filteredWidths.push(width);
            }
        }
        var hasColumnMin = column.minWidth !== -Infinity && column.minWidth !== undefined;
        var hasColumnMax = column.maxWidth !== Infinity && column.maxWidth !== undefined;
        var min = hasColumnMin ? column.minWidth : 0;
        var max = hasColumnMax ? column.maxWidth : Infinity;
        var maxContent = filteredWidths.length === 0 ? 0 : Math.max.apply(Math, filteredWidths);
        widthByField[column.field] = (0, utils_2.clamp)(maxContent, min, max);
    });
    root.classList.remove(gridClasses_1.gridClasses.autosizing);
    return widthByField;
}
var columnResizeStateInitializer = function (state) { return (__assign(__assign({}, state), { columnResize: { resizingColumnField: '' } })); };
exports.columnResizeStateInitializer = columnResizeStateInitializer;
function createResizeRefs() {
    return {
        colDef: undefined,
        initialColWidth: 0,
        initialTotalWidth: 0,
        previousMouseClickEvent: undefined,
        columnHeaderElement: undefined,
        headerFilterElement: undefined,
        groupHeaderElements: [],
        cellElements: [],
        leftPinnedCellsAfter: [],
        rightPinnedCellsBefore: [],
        fillerLeft: undefined,
        fillerRight: undefined,
        leftPinnedHeadersAfter: [],
        rightPinnedHeadersBefore: [],
    };
}
/**
 * @requires useGridColumns (method, event)
 * TODO: improve experience for last column
 */
var useGridColumnResize = function (apiRef, props) {
    var isRtl = (0, RtlProvider_1.useRtl)();
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridColumnResize');
    var refs = (0, useLazyRef_1.default)(createResizeRefs).current;
    // To improve accessibility, the separator has padding on both sides.
    // Clicking inside the padding area should be treated as a click in the separator.
    // This ref stores the offset between the click and the separator.
    var initialOffsetToSeparator = React.useRef(null);
    var resizeDirection = React.useRef(null);
    var stopResizeEventTimeout = (0, useTimeout_1.useTimeout)();
    var touchId = React.useRef(undefined);
    var updateWidth = function (newWidth) {
        var _a, _b;
        logger.debug("Updating width to ".concat(newWidth, " for col ").concat(refs.colDef.field));
        var prevWidth = refs.columnHeaderElement.offsetWidth;
        var widthDiff = newWidth - prevWidth;
        var columnWidthDiff = newWidth - refs.initialColWidth;
        if (columnWidthDiff > 0) {
            var newTotalWidth = refs.initialTotalWidth + columnWidthDiff;
            (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.style.setProperty('--DataGrid-rowWidth', "".concat(newTotalWidth, "px"));
        }
        refs.colDef.computedWidth = newWidth;
        refs.colDef.width = newWidth;
        refs.colDef.flex = 0;
        refs.columnHeaderElement.style.width = "".concat(newWidth, "px");
        var headerFilterElement = refs.headerFilterElement;
        if (headerFilterElement) {
            headerFilterElement.style.width = "".concat(newWidth, "px");
        }
        refs.groupHeaderElements.forEach(function (element) {
            var div = element;
            var finalWidth;
            if (div.getAttribute('aria-colspan') === '1') {
                finalWidth = "".concat(newWidth, "px");
            }
            else {
                // Cell with colspan > 1 cannot be just updated width new width.
                // Instead, we add width diff to the current width.
                finalWidth = "".concat(div.offsetWidth + widthDiff, "px");
            }
            div.style.width = finalWidth;
        });
        refs.cellElements.forEach(function (element) {
            var div = element;
            var finalWidth;
            if (div.getAttribute('aria-colspan') === '1') {
                finalWidth = "".concat(newWidth, "px");
            }
            else {
                // Cell with colspan > 1 cannot be just updated width new width.
                // Instead, we add width diff to the current width.
                finalWidth = "".concat(div.offsetWidth + widthDiff, "px");
            }
            div.style.setProperty('--width', finalWidth);
        });
        var pinnedPosition = apiRef.current.unstable_applyPipeProcessors('isColumnPinned', false, refs.colDef.field);
        if (pinnedPosition === gridColumnsInterfaces_1.GridPinnedColumnPosition.LEFT) {
            updateProperty(refs.fillerLeft, 'width', widthDiff);
            refs.leftPinnedCellsAfter.forEach(function (cell) {
                updateProperty(cell, 'left', widthDiff);
            });
            refs.leftPinnedHeadersAfter.forEach(function (header) {
                updateProperty(header, 'left', widthDiff);
            });
        }
        if (pinnedPosition === gridColumnsInterfaces_1.GridPinnedColumnPosition.RIGHT) {
            updateProperty(refs.fillerRight, 'width', widthDiff);
            refs.rightPinnedCellsBefore.forEach(function (cell) {
                updateProperty(cell, 'right', widthDiff);
            });
            refs.rightPinnedHeadersBefore.forEach(function (header) {
                updateProperty(header, 'right', widthDiff);
            });
        }
    };
    var finishResize = function (nativeEvent) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        stopListening();
        // Prevent double-clicks from being interpreted as two separate clicks
        if (refs.previousMouseClickEvent) {
            var prevEvent = refs.previousMouseClickEvent;
            var prevTimeStamp = prevEvent.timeStamp;
            var prevClientX = prevEvent.clientX;
            var prevClientY = prevEvent.clientY;
            // Check if the current event is part of a double-click
            if (nativeEvent.timeStamp - prevTimeStamp < 300 &&
                nativeEvent.clientX === prevClientX &&
                nativeEvent.clientY === prevClientY) {
                refs.previousMouseClickEvent = undefined;
                apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
                return;
            }
        }
        if (refs.colDef) {
            apiRef.current.setColumnWidth(refs.colDef.field, refs.colDef.width);
            logger.debug("Updating col ".concat(refs.colDef.field, " with new width: ").concat(refs.colDef.width));
            // Since during resizing we update the columns width outside of React, React is unable to
            // reapply the right style properties. We need to sync the state manually.
            // So we reapply the same logic as in https://github.com/mui/mui-x/blob/0511bf65543ca05d2602a5a3e0a6156f2fc8e759/packages/x-data-grid/src/hooks/features/columnHeaders/useGridColumnHeaders.tsx#L405
            var columnsState_1 = (0, columns_1.gridColumnsStateSelector)(apiRef);
            refs.groupHeaderElements.forEach(function (element) {
                var fields = (0, domUtils_1.getFieldsFromGroupHeaderElem)(element);
                var div = element;
                var newWidth = fields.reduce(function (acc, field) {
                    if (columnsState_1.columnVisibilityModel[field] !== false) {
                        return acc + columnsState_1.lookup[field].computedWidth;
                    }
                    return acc;
                }, 0);
                var finalWidth = "".concat(newWidth, "px");
                div.style.width = finalWidth;
            });
        }
        stopResizeEventTimeout.start(0, function () {
            apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
        });
    };
    var storeReferences = function (colDef, separator, xStart) {
        var _a;
        var root = apiRef.current.rootElementRef.current;
        refs.initialColWidth = colDef.computedWidth;
        refs.initialTotalWidth = apiRef.current.getRootDimensions().rowWidth;
        refs.colDef = colDef;
        refs.columnHeaderElement = (0, domUtils_1.findHeaderElementFromField)(apiRef.current.columnHeadersContainerRef.current, colDef.field);
        var headerFilterElement = root.querySelector(".".concat(gridClasses_1.gridClasses.headerFilterRow, " [data-field=\"").concat((0, domUtils_1.escapeOperandAttributeSelector)(colDef.field), "\"]"));
        if (headerFilterElement) {
            refs.headerFilterElement = headerFilterElement;
        }
        refs.groupHeaderElements = (0, domUtils_1.findGroupHeaderElementsFromField)((_a = apiRef.current.columnHeadersContainerRef) === null || _a === void 0 ? void 0 : _a.current, colDef.field);
        refs.cellElements = (0, domUtils_1.findGridCellElementsFromCol)(refs.columnHeaderElement, apiRef.current);
        refs.fillerLeft = (0, domUtils_1.findGridElement)(apiRef.current, isRtl ? 'filler--pinnedRight' : 'filler--pinnedLeft');
        refs.fillerRight = (0, domUtils_1.findGridElement)(apiRef.current, isRtl ? 'filler--pinnedLeft' : 'filler--pinnedRight');
        var pinnedPosition = apiRef.current.unstable_applyPipeProcessors('isColumnPinned', false, refs.colDef.field);
        refs.leftPinnedCellsAfter =
            pinnedPosition !== gridColumnsInterfaces_1.GridPinnedColumnPosition.LEFT
                ? []
                : (0, domUtils_1.findLeftPinnedCellsAfterCol)(apiRef.current, refs.columnHeaderElement, isRtl);
        refs.rightPinnedCellsBefore =
            pinnedPosition !== gridColumnsInterfaces_1.GridPinnedColumnPosition.RIGHT
                ? []
                : (0, domUtils_1.findRightPinnedCellsBeforeCol)(apiRef.current, refs.columnHeaderElement, isRtl);
        refs.leftPinnedHeadersAfter =
            pinnedPosition !== gridColumnsInterfaces_1.GridPinnedColumnPosition.LEFT
                ? []
                : (0, domUtils_1.findLeftPinnedHeadersAfterCol)(apiRef.current, refs.columnHeaderElement, isRtl);
        refs.rightPinnedHeadersBefore =
            pinnedPosition !== gridColumnsInterfaces_1.GridPinnedColumnPosition.RIGHT
                ? []
                : (0, domUtils_1.findRightPinnedHeadersBeforeCol)(apiRef.current, refs.columnHeaderElement, isRtl);
        resizeDirection.current = getResizeDirection(separator, isRtl);
        initialOffsetToSeparator.current = computeOffsetToSeparator(xStart, refs.columnHeaderElement.getBoundingClientRect(), resizeDirection.current);
    };
    var handleResizeMouseUp = (0, useEventCallback_1.default)(finishResize);
    var handleResizeMouseMove = (0, useEventCallback_1.default)(function (nativeEvent) {
        // Cancel move in case some other element consumed a mouseup event and it was not fired.
        if (nativeEvent.buttons === 0) {
            handleResizeMouseUp(nativeEvent);
            return;
        }
        var newWidth = computeNewWidth(initialOffsetToSeparator.current, nativeEvent.clientX, refs.columnHeaderElement.getBoundingClientRect(), resizeDirection.current);
        newWidth = (0, utils_2.clamp)(newWidth, refs.colDef.minWidth, refs.colDef.maxWidth);
        updateWidth(newWidth);
        var params = {
            element: refs.columnHeaderElement,
            colDef: refs.colDef,
            width: newWidth,
        };
        apiRef.current.publishEvent('columnResize', params, nativeEvent);
    });
    var handleTouchEnd = (0, useEventCallback_1.default)(function (nativeEvent) {
        var finger = trackFinger(nativeEvent, touchId.current);
        if (!finger) {
            return;
        }
        finishResize(nativeEvent);
    });
    var handleTouchMove = (0, useEventCallback_1.default)(function (nativeEvent) {
        var finger = trackFinger(nativeEvent, touchId.current);
        if (!finger) {
            return;
        }
        // Cancel move in case some other element consumed a touchmove event and it was not fired.
        if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
            handleTouchEnd(nativeEvent);
            return;
        }
        var newWidth = computeNewWidth(initialOffsetToSeparator.current, finger.x, refs.columnHeaderElement.getBoundingClientRect(), resizeDirection.current);
        newWidth = (0, utils_2.clamp)(newWidth, refs.colDef.minWidth, refs.colDef.maxWidth);
        updateWidth(newWidth);
        var params = {
            element: refs.columnHeaderElement,
            colDef: refs.colDef,
            width: newWidth,
        };
        apiRef.current.publishEvent('columnResize', params, nativeEvent);
    });
    var handleTouchStart = (0, useEventCallback_1.default)(function (event) {
        var cellSeparator = (0, domUtils_1.findParentElementFromClassName)(event.target, gridClasses_1.gridClasses['columnSeparator--resizable']);
        // Let the event bubble if the target is not a col separator
        if (!cellSeparator) {
            return;
        }
        var touch = event.changedTouches[0];
        if (touch != null) {
            // A number that uniquely identifies the current finger in the touch session.
            touchId.current = touch.identifier;
        }
        var columnHeaderElement = (0, domUtils_1.findParentElementFromClassName)(event.target, gridClasses_1.gridClasses.columnHeader);
        var field = (0, domUtils_1.getFieldFromHeaderElem)(columnHeaderElement);
        var colDef = apiRef.current.getColumn(field);
        logger.debug("Start Resize on col ".concat(colDef.field));
        apiRef.current.publishEvent('columnResizeStart', { field: field }, event);
        storeReferences(colDef, cellSeparator, touch.clientX);
        var doc = (0, ownerDocument_1.default)(event.currentTarget);
        doc.addEventListener('touchmove', handleTouchMove);
        doc.addEventListener('touchend', handleTouchEnd);
    });
    var stopListening = React.useCallback(function () {
        var doc = (0, ownerDocument_1.default)(apiRef.current.rootElementRef.current);
        doc.body.style.removeProperty('cursor');
        doc.removeEventListener('mousemove', handleResizeMouseMove);
        doc.removeEventListener('mouseup', handleResizeMouseUp);
        doc.removeEventListener('touchmove', handleTouchMove);
        doc.removeEventListener('touchend', handleTouchEnd);
        // The click event runs right after the mouseup event, we want to wait until it
        // has been canceled before removing our handler.
        setTimeout(function () {
            doc.removeEventListener('click', preventClick, true);
        }, 100);
        if (refs.columnHeaderElement) {
            refs.columnHeaderElement.style.pointerEvents = 'unset';
        }
    }, [apiRef, refs, handleResizeMouseMove, handleResizeMouseUp, handleTouchMove, handleTouchEnd]);
    var handleResizeStart = React.useCallback(function (_a) {
        var field = _a.field;
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { columnResize: __assign(__assign({}, state.columnResize), { resizingColumnField: field }) })); });
    }, [apiRef]);
    var handleResizeStop = React.useCallback(function () {
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { columnResize: __assign(__assign({}, state.columnResize), { resizingColumnField: '' }) })); });
    }, [apiRef]);
    var handleColumnResizeMouseDown = (0, useEventCallback_1.default)(function (_a, event) {
        var colDef = _a.colDef;
        // Only handle left clicks
        if (event.button !== 0) {
            return;
        }
        // Skip if the column isn't resizable
        if (!event.currentTarget.classList.contains(gridClasses_1.gridClasses['columnSeparator--resizable'])) {
            return;
        }
        // Avoid text selection
        event.preventDefault();
        logger.debug("Start Resize on col ".concat(colDef.field));
        apiRef.current.publishEvent('columnResizeStart', { field: colDef.field }, event);
        storeReferences(colDef, event.currentTarget, event.clientX);
        var doc = (0, ownerDocument_1.default)(apiRef.current.rootElementRef.current);
        doc.body.style.cursor = 'col-resize';
        refs.previousMouseClickEvent = event.nativeEvent;
        doc.addEventListener('mousemove', handleResizeMouseMove);
        doc.addEventListener('mouseup', handleResizeMouseUp);
        // Prevent the click event if we have resized the column.
        // Fixes https://github.com/mui/mui-x/issues/4777
        doc.addEventListener('click', preventClick, true);
    });
    var handleColumnSeparatorDoubleClick = (0, useEventCallback_1.default)(function (params, event) {
        if (props.disableAutosize) {
            return;
        }
        // Only handle left clicks
        if (event.button !== 0) {
            return;
        }
        var column = apiRef.current.state.columns.lookup[params.field];
        if (column.resizable === false) {
            return;
        }
        apiRef.current.autosizeColumns(__assign(__assign({}, props.autosizeOptions), { disableColumnVirtualization: false, columns: [column.field] }));
    });
    /**
     * API METHODS
     */
    var columnVirtualizationDisabled = useColumnVirtualizationDisabled(apiRef);
    var isAutosizingRef = React.useRef(false);
    var autosizeColumns = React.useCallback(function (userOptions) { return __awaiter(void 0, void 0, void 0, function () {
        var root, state, options, columns, widthByField_1, newColumns, visibleColumns, totalWidth, dimensions, availableWidth, remainingWidth, widthPerColumn_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    root = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current;
                    if (!root) {
                        return [2 /*return*/];
                    }
                    if (isAutosizingRef.current) {
                        return [2 /*return*/];
                    }
                    isAutosizingRef.current = true;
                    state = (0, columns_1.gridColumnsStateSelector)(apiRef);
                    options = __assign(__assign(__assign({}, gridColumnResizeApi_1.DEFAULT_GRID_AUTOSIZE_OPTIONS), userOptions), { columns: (_b = userOptions === null || userOptions === void 0 ? void 0 : userOptions.columns) !== null && _b !== void 0 ? _b : state.orderedFields });
                    options.columns = options.columns.filter(function (c) { return state.columnVisibilityModel[c] !== false; });
                    columns = options.columns.map(function (c) { return apiRef.current.state.columns.lookup[c]; });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 4, 5]);
                    if (!(!props.disableVirtualization && options.disableColumnVirtualization)) return [3 /*break*/, 3];
                    apiRef.current.unstable_setColumnVirtualization(false);
                    return [4 /*yield*/, columnVirtualizationDisabled()];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    widthByField_1 = extractColumnWidths(apiRef, options, columns);
                    newColumns = columns.map(function (column) { return (__assign(__assign({}, column), { width: widthByField_1[column.field], computedWidth: widthByField_1[column.field], flex: 0 })); });
                    if (options.expand) {
                        visibleColumns = state.orderedFields
                            .map(function (field) { return state.lookup[field]; })
                            .filter(function (c) { return state.columnVisibilityModel[c.field] !== false; });
                        totalWidth = visibleColumns.reduce(function (total, column) { var _a, _b; return total + ((_b = (_a = widthByField_1[column.field]) !== null && _a !== void 0 ? _a : column.computedWidth) !== null && _b !== void 0 ? _b : column.width); }, 0);
                        dimensions = apiRef.current.getRootDimensions();
                        availableWidth = dimensions.viewportInnerSize.width;
                        remainingWidth = availableWidth - totalWidth;
                        if (remainingWidth > 0) {
                            widthPerColumn_1 = remainingWidth / (newColumns.length || 1);
                            newColumns.forEach(function (column) {
                                column.width += widthPerColumn_1;
                                column.computedWidth += widthPerColumn_1;
                            });
                        }
                    }
                    apiRef.current.updateColumns(newColumns);
                    newColumns.forEach(function (newColumn, index) {
                        if (newColumn.width !== columns[index].width) {
                            var width = newColumn.width;
                            apiRef.current.publishEvent('columnWidthChange', {
                                element: apiRef.current.getColumnHeaderElement(newColumn.field),
                                colDef: newColumn,
                                width: width,
                            });
                        }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    if (!props.disableVirtualization) {
                        apiRef.current.unstable_setColumnVirtualization(true);
                    }
                    isAutosizingRef.current = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [apiRef, columnVirtualizationDisabled, props.disableVirtualization]);
    /**
     * EFFECTS
     */
    React.useEffect(function () { return stopListening; }, [stopListening]);
    (0, utils_1.useOnMount)(function () {
        if (props.autosizeOnMount) {
            Promise.resolve().then(function () {
                apiRef.current.autosizeColumns(props.autosizeOptions);
            });
        }
    });
    (0, utils_1.useGridNativeEventListener)(apiRef, function () { var _a; return (_a = apiRef.current.columnHeadersContainerRef) === null || _a === void 0 ? void 0 : _a.current; }, 'touchstart', handleTouchStart, { passive: true });
    (0, utils_1.useGridApiMethod)(apiRef, {
        autosizeColumns: autosizeColumns,
    }, 'public');
    (0, utils_1.useGridEvent)(apiRef, 'columnResizeStop', handleResizeStop);
    (0, utils_1.useGridEvent)(apiRef, 'columnResizeStart', handleResizeStart);
    (0, utils_1.useGridEvent)(apiRef, 'columnSeparatorMouseDown', handleColumnResizeMouseDown);
    (0, utils_1.useGridEvent)(apiRef, 'columnSeparatorDoubleClick', handleColumnSeparatorDoubleClick);
    (0, utils_1.useGridEventPriority)(apiRef, 'columnResize', props.onColumnResize);
    (0, utils_1.useGridEventPriority)(apiRef, 'columnWidthChange', props.onColumnWidthChange);
};
exports.useGridColumnResize = useGridColumnResize;
function updateProperty(element, property, delta) {
    if (!element) {
        return;
    }
    element.style[property] = "".concat(parseInt(element.style[property], 10) + delta, "px");
}
