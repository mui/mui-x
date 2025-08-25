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
exports.useGridExcelExport = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var excelSerializer_1 = require("./serializer/excelSerializer");
var components_1 = require("../../../components");
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
var useGridExcelExport = function (apiRef, props) {
    var logger = (0, x_data_grid_1.useGridLogger)(apiRef, 'useGridExcelExport');
    var getDataAsExcel = React.useCallback(function (options) {
        var _a, _b, _c, _d;
        if (options === void 0) { options = {}; }
        logger.debug("Get data as excel");
        var getRowsToExport = (_a = options.getRowsToExport) !== null && _a !== void 0 ? _a : internals_1.defaultGetRowsToExport;
        var exportedRowIds = getRowsToExport({ apiRef: apiRef });
        var exportedColumns = (0, internals_1.getColumnsToExport)({ apiRef: apiRef, options: options });
        return (0, excelSerializer_1.buildExcel)({
            columns: exportedColumns,
            rowIds: exportedRowIds,
            includeHeaders: (_b = options.includeHeaders) !== null && _b !== void 0 ? _b : true,
            includeColumnGroupsHeaders: (_c = options.includeColumnGroupsHeaders) !== null && _c !== void 0 ? _c : true,
            valueOptionsSheetName: (options === null || options === void 0 ? void 0 : options.valueOptionsSheetName) || 'Options',
            columnsStyles: options === null || options === void 0 ? void 0 : options.columnsStyles,
            exceljsPreProcess: options === null || options === void 0 ? void 0 : options.exceljsPreProcess,
            exceljsPostProcess: options === null || options === void 0 ? void 0 : options.exceljsPostProcess,
            escapeFormulas: (_d = options.escapeFormulas) !== null && _d !== void 0 ? _d : true,
        }, apiRef);
    }, [logger, apiRef]);
    var exportDataAsExcel = React.useCallback(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
            var workerFn, exceljsPostProcess, exceljsPreProcess, columnsStyles, includeHeaders, _a, getRowsToExport, _b, valueOptionsSheetName, cloneableOptions, sendExcelToUser, workbook, content, worker, exportedRowIds, exportedColumns, valueOptionsData, serializedColumns, serializedRows, i, id, serializedRow, columnGroupPaths, message;
            var _c;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        workerFn = options.worker, exceljsPostProcess = options.exceljsPostProcess, exceljsPreProcess = options.exceljsPreProcess, columnsStyles = options.columnsStyles, includeHeaders = options.includeHeaders, _a = options.getRowsToExport, getRowsToExport = _a === void 0 ? internals_1.defaultGetRowsToExport : _a, _b = options.valueOptionsSheetName, valueOptionsSheetName = _b === void 0 ? 'Options' : _b, cloneableOptions = __rest(options, ["worker", "exceljsPostProcess", "exceljsPreProcess", "columnsStyles", "includeHeaders", "getRowsToExport", "valueOptionsSheetName"]);
                        sendExcelToUser = function (buffer) {
                            var blob = new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            (0, internals_1.exportAs)(blob, 'xlsx', options === null || options === void 0 ? void 0 : options.fileName);
                        };
                        if (!!workerFn) return [3 /*break*/, 3];
                        apiRef.current.publishEvent('excelExportStateChange', 'pending');
                        return [4 /*yield*/, getDataAsExcel(options)];
                    case 1:
                        workbook = _d.sent();
                        if (workbook === null) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 2:
                        content = _d.sent();
                        apiRef.current.publishEvent('excelExportStateChange', 'finished');
                        sendExcelToUser(content);
                        return [2 /*return*/];
                    case 3:
                        if (process.env.NODE_ENV !== 'production') {
                            if (exceljsPostProcess) {
                                console.warn([
                                    "MUI X: The exceljsPostProcess option is not supported when a web worker is used.",
                                    'As alternative, pass the callback to the same option in setupExcelExportWebWorker.',
                                ].join('\n'));
                            }
                            if (exceljsPreProcess) {
                                console.warn([
                                    "MUI X: The exceljsPreProcess option is not supported when a web worker is used.",
                                    'As alternative, pass the callback to the same option in setupExcelExportWebWorker.',
                                ].join('\n'));
                            }
                        }
                        worker = workerFn();
                        apiRef.current.publishEvent('excelExportStateChange', 'pending');
                        worker.onmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                sendExcelToUser(event.data);
                                apiRef.current.publishEvent('excelExportStateChange', 'finished');
                                worker.terminate();
                                return [2 /*return*/];
                            });
                        }); };
                        exportedRowIds = getRowsToExport({ apiRef: apiRef });
                        exportedColumns = (0, internals_1.getColumnsToExport)({ apiRef: apiRef, options: options });
                        return [4 /*yield*/, (0, excelSerializer_1.getDataForValueOptionsSheet)(exportedColumns, valueOptionsSheetName, apiRef.current)];
                    case 4:
                        valueOptionsData = _d.sent();
                        serializedColumns = (0, excelSerializer_1.serializeColumns)(exportedColumns, options.columnsStyles || {});
                        apiRef.current.resetColSpan();
                        serializedRows = [];
                        for (i = 0; i < exportedRowIds.length; i += 1) {
                            id = exportedRowIds[i];
                            serializedRow = (0, excelSerializer_1.serializeRowUnsafe)(id, exportedColumns, apiRef, valueOptionsData, {
                                escapeFormulas: (_c = options.escapeFormulas) !== null && _c !== void 0 ? _c : true,
                            });
                            serializedRows.push(serializedRow);
                        }
                        apiRef.current.resetColSpan();
                        columnGroupPaths = exportedColumns.reduce(function (acc, column) {
                            acc[column.field] = apiRef.current.getColumnGroupPath(column.field);
                            return acc;
                        }, {});
                        message = {
                            // workers share the pub-sub channel namespace. Use this property to filter out messages.
                            namespace: 'mui-x-data-grid-export',
                            serializedColumns: serializedColumns,
                            serializedRows: serializedRows,
                            valueOptionsData: valueOptionsData,
                            columnGroupPaths: columnGroupPaths,
                            columnGroupDetails: apiRef.current.getAllGroupDetails(),
                            options: cloneableOptions,
                            valueOptionsSheetName: valueOptionsSheetName,
                        };
                        worker.postMessage(message);
                        return [2 /*return*/];
                }
            });
        });
    }, [apiRef, getDataAsExcel]);
    var excelExportApi = {
        getDataAsExcel: getDataAsExcel,
        exportDataAsExcel: exportDataAsExcel,
    };
    (0, x_data_grid_1.useGridApiMethod)(apiRef, excelExportApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var addExportMenuButtons = React.useCallback(function (initialValue, options) {
        var _a;
        if ((_a = options.excelOptions) === null || _a === void 0 ? void 0 : _a.disableToolbarButton) {
            return initialValue;
        }
        return __spreadArray(__spreadArray([], initialValue, true), [
            {
                component: <components_1.GridExcelExportMenuItem options={options.excelOptions}/>,
                componentName: 'excelExport',
            },
        ], false);
    }, []);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'excelExportStateChange', props.onExcelExportStateChange);
};
exports.useGridExcelExport = useGridExcelExport;
