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
exports.useGridCsvExport = void 0;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var exportAs_1 = require("../../../utils/exportAs");
var csvSerializer_1 = require("./serializers/csvSerializer");
var utils_1 = require("./utils");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var toolbar_1 = require("../../../components/toolbar");
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
var useGridCsvExport = function (apiRef, props) {
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridCsvExport');
    var ignoreValueFormatterProp = props.ignoreValueFormatterDuringExport;
    var ignoreValueFormatter = (typeof ignoreValueFormatterProp === 'object'
        ? ignoreValueFormatterProp === null || ignoreValueFormatterProp === void 0 ? void 0 : ignoreValueFormatterProp.csvExport
        : ignoreValueFormatterProp) || false;
    var getDataAsCsv = React.useCallback(function (options) {
        var _a, _b, _c, _d, _e;
        if (options === void 0) { options = {}; }
        logger.debug("Get data as CSV");
        var exportedColumns = (0, utils_1.getColumnsToExport)({
            apiRef: apiRef,
            options: options,
        });
        var getRowsToExport = (_a = options.getRowsToExport) !== null && _a !== void 0 ? _a : utils_1.defaultGetRowsToExport;
        var exportedRowIds = getRowsToExport({ apiRef: apiRef });
        return (0, csvSerializer_1.buildCSV)({
            columns: exportedColumns,
            rowIds: exportedRowIds,
            csvOptions: {
                delimiter: options.delimiter || ',',
                shouldAppendQuotes: (_b = options.shouldAppendQuotes) !== null && _b !== void 0 ? _b : true,
                includeHeaders: (_c = options.includeHeaders) !== null && _c !== void 0 ? _c : true,
                includeColumnGroupsHeaders: (_d = options.includeColumnGroupsHeaders) !== null && _d !== void 0 ? _d : true,
                escapeFormulas: (_e = options.escapeFormulas) !== null && _e !== void 0 ? _e : true,
            },
            ignoreValueFormatter: ignoreValueFormatter,
            apiRef: apiRef,
        });
    }, [logger, apiRef, ignoreValueFormatter]);
    var exportDataAsCsv = React.useCallback(function (options) {
        logger.debug("Export data as CSV");
        var csv = getDataAsCsv(options);
        var blob = new Blob([(options === null || options === void 0 ? void 0 : options.utf8WithBom) ? new Uint8Array([0xef, 0xbb, 0xbf]) : '', csv], {
            type: 'text/csv',
        });
        (0, exportAs_1.exportAs)(blob, 'csv', options === null || options === void 0 ? void 0 : options.fileName);
    }, [logger, getDataAsCsv]);
    var csvExportApi = {
        getDataAsCsv: getDataAsCsv,
        exportDataAsCsv: exportDataAsCsv,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, csvExportApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var addExportMenuButtons = React.useCallback(function (initialValue, options) {
        var _a;
        if ((_a = options.csvOptions) === null || _a === void 0 ? void 0 : _a.disableToolbarButton) {
            return initialValue;
        }
        return __spreadArray(__spreadArray([], initialValue, true), [
            {
                component: <toolbar_1.GridCsvExportMenuItem options={options.csvOptions}/>,
                componentName: 'csvExport',
            },
        ], false);
    }, []);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
};
exports.useGridCsvExport = useGridCsvExport;
