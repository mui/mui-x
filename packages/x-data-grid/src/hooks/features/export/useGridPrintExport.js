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
exports.useGridPrintExport = void 0;
var React = require("react");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var export_1 = require("@mui/x-internals/export");
var useGridLogger_1 = require("../../utils/useGridLogger");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridClasses_1 = require("../../../constants/gridClasses");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridRowsMetaSelector_1 = require("../rows/gridRowsMetaSelector");
var gridRowsUtils_1 = require("../rows/gridRowsUtils");
var utils_1 = require("./utils");
var useGridPaginationModel_1 = require("../pagination/useGridPaginationModel");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var toolbar_1 = require("../../../components/toolbar");
var gridColumnsUtils_1 = require("../columns/gridColumnsUtils");
var gridCheckboxSelectionColDef_1 = require("../../../colDef/gridCheckboxSelectionColDef");
function raf() {
    return new Promise(function (resolve) {
        requestAnimationFrame(function () {
            resolve();
        });
    });
}
function buildPrintWindow(title) {
    var iframeEl = document.createElement('iframe');
    iframeEl.style.position = 'absolute';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.title = title || document.title;
    return iframeEl;
}
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridParamsApi (method)
 */
var useGridPrintExport = function (apiRef, props) {
    var hasRootReference = apiRef.current.rootElementRef.current !== null;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridPrintExport');
    var doc = React.useRef(null);
    var previousGridState = React.useRef(null);
    var previousColumnVisibility = React.useRef({});
    var previousRows = React.useRef([]);
    var previousVirtualizationState = React.useRef(null);
    React.useEffect(function () {
        doc.current = (0, ownerDocument_1.default)(apiRef.current.rootElementRef.current);
    }, [apiRef, hasRootReference]);
    // Returns a promise because updateColumns triggers state update and
    // the new state needs to be in place before the grid can be sized correctly
    var updateGridColumnsForPrint = React.useCallback(function (fields, allColumns, includeCheckboxes) {
        return new Promise(function (resolve) {
            var exportedColumnFields = (0, utils_1.getColumnsToExport)({
                apiRef: apiRef,
                options: { fields: fields, allColumns: allColumns },
            }).map(function (column) { return column.field; });
            var columns = (0, gridColumnsSelector_1.gridColumnDefinitionsSelector)(apiRef);
            var newColumnVisibilityModel = {};
            columns.forEach(function (column) {
                newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
            });
            if (includeCheckboxes) {
                newColumnVisibilityModel[gridCheckboxSelectionColDef_1.GRID_CHECKBOX_SELECTION_COL_DEF.field] = true;
            }
            apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
            resolve();
        });
    }, [apiRef]);
    var updateGridRowsForPrint = React.useCallback(function (getRowsToExport) {
        var rowsToExportIds = getRowsToExport({ apiRef: apiRef });
        var newRows = rowsToExportIds.reduce(function (acc, id) {
            var row = apiRef.current.getRow(id);
            if (!row[gridRowsUtils_1.GRID_ID_AUTOGENERATED]) {
                acc.push(row);
            }
            return acc;
        }, []);
        apiRef.current.setRows(newRows);
    }, [apiRef]);
    var handlePrintWindowLoad = React.useCallback(function (printWindow, options) {
        var _a;
        var _b, _c, _d;
        var normalizeOptions = __assign({ copyStyles: true, hideToolbar: false, hideFooter: false, includeCheckboxes: false }, options);
        var printDoc = printWindow.contentDocument;
        if (!printDoc) {
            return;
        }
        var rowsMeta = (0, gridRowsMetaSelector_1.gridRowsMetaSelector)(apiRef);
        var gridRootElement = apiRef.current.rootElementRef.current;
        var gridClone = gridRootElement.cloneNode(true);
        // Allow to overflow to not hide the border of the last row
        var gridMain = gridClone.querySelector(".".concat(gridClasses_1.gridClasses.main));
        gridMain.style.overflow = 'visible';
        // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
        gridClone.style.contain = 'size';
        var gridToolbarElementHeight = ((_b = gridRootElement.querySelector(".".concat(gridClasses_1.gridClasses.toolbar))) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
        var gridFooterElementHeight = ((_c = gridRootElement.querySelector(".".concat(gridClasses_1.gridClasses.footerContainer))) === null || _c === void 0 ? void 0 : _c.offsetHeight) || 0;
        var gridFooterElement = gridClone.querySelector(".".concat(gridClasses_1.gridClasses.footerContainer));
        if (normalizeOptions.hideToolbar) {
            (_d = gridClone.querySelector(".".concat(gridClasses_1.gridClasses.toolbar))) === null || _d === void 0 ? void 0 : _d.remove();
            gridToolbarElementHeight = 0;
        }
        if (normalizeOptions.hideFooter && gridFooterElement) {
            gridFooterElement.remove();
            gridFooterElementHeight = 0;
        }
        // Expand container height to accommodate all rows
        var computedTotalHeight = rowsMeta.currentPageTotalHeight +
            (0, gridColumnsUtils_1.getTotalHeaderHeight)(apiRef, props) +
            gridToolbarElementHeight +
            gridFooterElementHeight;
        gridClone.style.height = "".concat(computedTotalHeight, "px");
        // The height above does not include grid border width, so we need to exclude it
        gridClone.style.boxSizing = 'content-box';
        if (!normalizeOptions.hideFooter && gridFooterElement) {
            // the footer is always being placed at the bottom of the page as if all rows are exported
            // so if getRowsToExport is being used to only export a subset of rows then we need to
            // adjust the footer position to be correctly placed at the bottom of the grid
            gridFooterElement.style.position = 'absolute';
            gridFooterElement.style.width = '100%';
            gridFooterElement.style.top = "".concat(computedTotalHeight - gridFooterElementHeight, "px");
        }
        // printDoc.body.appendChild(gridClone); should be enough but a clone isolation bug in Safari
        // prevents us to do it
        var container = document.createElement('div');
        container.appendChild(gridClone);
        // To avoid an empty page in start on Chromium based browsers
        printDoc.body.style.marginTop = '0px';
        printDoc.body.innerHTML = container.innerHTML;
        var defaultPageStyle = typeof normalizeOptions.pageStyle === 'function'
            ? normalizeOptions.pageStyle()
            : normalizeOptions.pageStyle;
        if (typeof defaultPageStyle === 'string') {
            // TODO custom styles should always win
            var styleElement = printDoc.createElement('style');
            styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
            printDoc.head.appendChild(styleElement);
        }
        if (normalizeOptions.bodyClassName) {
            (_a = printDoc.body.classList).add.apply(_a, normalizeOptions.bodyClassName.split(' '));
        }
        var stylesheetLoadPromises = [];
        if (normalizeOptions.copyStyles) {
            var rootCandidate = gridRootElement.getRootNode();
            var root = rootCandidate.constructor.name === 'ShadowRoot'
                ? rootCandidate
                : doc.current;
            stylesheetLoadPromises = (0, export_1.loadStyleSheets)(printDoc, root);
        }
        // Trigger print
        if (process.env.NODE_ENV !== 'test') {
            // wait for remote stylesheets to load
            Promise.all(stylesheetLoadPromises).then(function () {
                printWindow.contentWindow.print();
            });
        }
    }, [apiRef, doc, props]);
    var handlePrintWindowAfterPrint = React.useCallback(function (printWindow) {
        var _a, _b;
        // Remove the print iframe
        doc.current.body.removeChild(printWindow);
        // Revert grid to previous state
        apiRef.current.restoreState(previousGridState.current || {});
        if (!((_b = (_a = previousGridState.current) === null || _a === void 0 ? void 0 : _a.columns) === null || _b === void 0 ? void 0 : _b.columnVisibilityModel)) {
            // if the apiRef.current.exportState(); did not exported the column visibility, we update it
            apiRef.current.setColumnVisibilityModel(previousColumnVisibility.current);
        }
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { virtualization: previousVirtualizationState.current })); });
        apiRef.current.setRows(previousRows.current);
        // Clear local state
        previousGridState.current = null;
        previousColumnVisibility.current = {};
        previousRows.current = [];
    }, [apiRef]);
    var exportDataAsPrint = React.useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var visibleRowCount, paginationModel_1, printWindow;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger.debug("Export data as Print");
                    if (!apiRef.current.rootElementRef.current) {
                        throw new Error('MUI X: No grid root element available.');
                    }
                    previousGridState.current = apiRef.current.exportState();
                    // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
                    previousColumnVisibility.current = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
                    previousRows.current = apiRef.current
                        .getSortedRows()
                        .filter(function (row) { return !row[gridRowsUtils_1.GRID_ID_AUTOGENERATED]; });
                    if (props.pagination) {
                        visibleRowCount = (0, gridFilterSelector_1.gridExpandedRowCountSelector)(apiRef);
                        paginationModel_1 = {
                            page: 0,
                            pageSize: visibleRowCount,
                        };
                        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationModel: (0, useGridPaginationModel_1.getDerivedPaginationModel)(state.pagination, 
                                // Using signature `DataGridPro` to allow more than 100 rows in the print export
                                'DataGridPro', paginationModel_1) }) })); });
                    }
                    previousVirtualizationState.current = apiRef.current.state.virtualization;
                    apiRef.current.unstable_setVirtualization(false);
                    return [4 /*yield*/, updateGridColumnsForPrint(options === null || options === void 0 ? void 0 : options.fields, options === null || options === void 0 ? void 0 : options.allColumns, options === null || options === void 0 ? void 0 : options.includeCheckboxes)];
                case 1:
                    _b.sent();
                    updateGridRowsForPrint((_a = options === null || options === void 0 ? void 0 : options.getRowsToExport) !== null && _a !== void 0 ? _a : utils_1.defaultGetRowsToExport);
                    return [4 /*yield*/, raf()];
                case 2:
                    _b.sent(); // wait for the state changes to take action
                    printWindow = buildPrintWindow(options === null || options === void 0 ? void 0 : options.fileName);
                    if (process.env.NODE_ENV === 'test') {
                        doc.current.body.appendChild(printWindow);
                        // In test env, run the all pipeline without waiting for loading
                        handlePrintWindowLoad(printWindow, options);
                        handlePrintWindowAfterPrint(printWindow);
                    }
                    else {
                        printWindow.onload = function () {
                            handlePrintWindowLoad(printWindow, options);
                            var mediaQueryList = printWindow.contentWindow.matchMedia('print');
                            mediaQueryList.addEventListener('change', function (mql) {
                                var isAfterPrint = mql.matches === false;
                                if (isAfterPrint) {
                                    handlePrintWindowAfterPrint(printWindow);
                                }
                            });
                        };
                        doc.current.body.appendChild(printWindow);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [
        props,
        logger,
        apiRef,
        handlePrintWindowLoad,
        handlePrintWindowAfterPrint,
        updateGridColumnsForPrint,
        updateGridRowsForPrint,
    ]);
    var printExportApi = {
        exportDataAsPrint: exportDataAsPrint,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, printExportApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var addExportMenuButtons = React.useCallback(function (initialValue, options) {
        var _a;
        if ((_a = options.printOptions) === null || _a === void 0 ? void 0 : _a.disableToolbarButton) {
            return initialValue;
        }
        return __spreadArray(__spreadArray([], initialValue, true), [
            {
                component: <toolbar_1.GridPrintExportMenuItem options={options.printOptions}/>,
                componentName: 'printExport',
            },
        ], false);
    }, []);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
};
exports.useGridPrintExport = useGridPrintExport;
