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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeColumn = exports.serializeRowUnsafe = void 0;
exports.serializeColumns = serializeColumns;
exports.getDataForValueOptionsSheet = getDataForValueOptionsSheet;
exports.buildExcel = buildExcel;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid/internals");
var warning_1 = require("@mui/x-internals/warning");
var utils_1 = require("./utils");
var getFormattedValueOptions = function (colDef, row, valueOptions, api, callback) {
    if (!colDef.valueOptions) {
        return;
    }
    var valueFormatter = colDef.valueFormatter;
    for (var i = 0; i < valueOptions.length; i += 1) {
        var option = valueOptions[i];
        var value = void 0;
        if (valueFormatter) {
            if (typeof option === 'object') {
                value = option.label;
            }
            else {
                value = String(colDef.valueFormatter(option, row, colDef, { current: api }));
            }
        }
        else {
            value = typeof option === 'object' ? option.label : option;
        }
        callback(value, i);
    }
};
var commaRegex = /,/g;
var commaReplacement = 'CHAR(44)';
/**
 * FIXME: This function mutates the colspan info, but colspan info assumes that the columns
 * passed to it are always consistent. In this case, the exported columns may differ from the
 * actual rendered columns.
 * The caller of this function MUST call `resetColSpan()` before and after usage.
 */
var serializeRowUnsafe = function (id, columns, apiRef, defaultValueOptionsFormulae, options) {
    var serializedRow = {};
    var dataValidation = {};
    var mergedCells = [];
    var row = apiRef.current.getRow(id);
    var rowNode = apiRef.current.getRowNode(id);
    if (!row || !rowNode) {
        throw new Error("No row with id #".concat(id, " found"));
    }
    var outlineLevel = rowNode.depth;
    var hasColSpan = (0, internals_1.gridHasColSpanSelector)(apiRef);
    if (hasColSpan) {
        // `colSpan` is only calculated for rendered rows, so we need to calculate it during export for every row
        apiRef.current.calculateColSpan(id, 0, columns.length, columns);
    }
    columns.forEach(function (column, colIndex) {
        var colSpanInfo = hasColSpan
            ? apiRef.current.unstable_getCellColSpanInfo(id, colIndex)
            : undefined;
        if (colSpanInfo && colSpanInfo.spannedByColSpan) {
            return;
        }
        if (colSpanInfo && colSpanInfo.cellProps.colSpan > 1) {
            mergedCells.push({
                leftIndex: colIndex + 1,
                rightIndex: colIndex + colSpanInfo.cellProps.colSpan,
            });
        }
        var cellValue;
        switch (column.type) {
            case 'singleSelect': {
                var castColumn = column;
                if (typeof castColumn.valueOptions === 'function') {
                    // If value option depends on the row, set specific options to the cell
                    // This dataValidation is buggy with LibreOffice and does not allow to have coma
                    var valueOptions_1 = castColumn.valueOptions({
                        id: id,
                        row: row,
                        field: column.field,
                    });
                    var formulae_1 = '"';
                    getFormattedValueOptions(castColumn, row, valueOptions_1, apiRef.current, function (value, index) {
                        var formatted = value.toString().replace(commaRegex, commaReplacement);
                        formulae_1 += formatted;
                        if (index < valueOptions_1.length - 1) {
                            formulae_1 += ',';
                        }
                    });
                    formulae_1 += '"';
                    dataValidation[castColumn.field] = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [formulae_1],
                    };
                }
                else {
                    var address = defaultValueOptionsFormulae[column.field].address;
                    // If value option is defined for the column, refer to another sheet
                    dataValidation[castColumn.field] = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [address],
                    };
                }
                var formattedValue = apiRef.current.getRowFormattedValue(row, castColumn);
                if (process.env.NODE_ENV !== 'production') {
                    if (String(formattedValue) === '[object Object]') {
                        (0, warning_1.warnOnce)([
                            'MUI X: When the value of a field is an object or a `renderCell` is provided, the Excel export might not display the value correctly.',
                            'You can provide a `valueFormatter` with a string representation to be used.',
                        ]);
                    }
                }
                if ((0, internals_1.isObject)(formattedValue)) {
                    serializedRow[castColumn.field] = formattedValue === null || formattedValue === void 0 ? void 0 : formattedValue.label;
                }
                else {
                    serializedRow[castColumn.field] = formattedValue;
                }
                break;
            }
            case 'boolean':
            case 'number':
                cellValue = apiRef.current.getRowValue(row, column);
                break;
            case 'date':
            case 'dateTime': {
                // Excel does not do any timezone conversion, so we create a date using UTC instead of local timezone
                // Solution from: https://github.com/exceljs/exceljs/issues/486#issuecomment-432557582
                // About Date.UTC(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#exemples
                var value = apiRef.current.getRowValue(row, column);
                // value may be `undefined` in auto-generated grouping rows
                if (!value) {
                    break;
                }
                var utcDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds()));
                serializedRow[column.field] = utcDate;
                break;
            }
            case 'actions':
                break;
            default:
                cellValue = apiRef.current.getRowFormattedValue(row, column);
                if (process.env.NODE_ENV !== 'production') {
                    if (String(cellValue) === '[object Object]') {
                        (0, warning_1.warnOnce)([
                            'MUI X: When the value of a field is an object or a `renderCell` is provided, the Excel export might not display the value correctly.',
                            'You can provide a `valueFormatter` with a string representation to be used.',
                        ]);
                    }
                }
                break;
        }
        if (typeof cellValue === 'string' && options.escapeFormulas) {
            // See https://owasp.org/www-community/attacks/CSV_Injection
            if (['=', '+', '-', '@', '\t', '\r'].includes(cellValue[0])) {
                cellValue = "'".concat(cellValue);
            }
        }
        if (typeof cellValue !== 'undefined') {
            serializedRow[column.field] = cellValue;
        }
    });
    return {
        row: serializedRow,
        dataValidation: dataValidation,
        outlineLevel: outlineLevel,
        mergedCells: mergedCells,
    };
};
exports.serializeRowUnsafe = serializeRowUnsafe;
var defaultColumnsStyles = (_a = {},
    _a[x_data_grid_pro_1.GRID_DATE_COL_DEF.type] = { numFmt: 'dd.mm.yyyy' },
    _a[x_data_grid_pro_1.GRID_DATETIME_COL_DEF.type] = { numFmt: 'dd.mm.yyyy hh:mm' },
    _a);
var serializeColumn = function (column, columnsStyles) {
    var _a;
    var field = column.field, type = column.type;
    return {
        key: field,
        headerText: (_a = column.headerName) !== null && _a !== void 0 ? _a : column.field,
        // Excel width must stay between 0 and 255 (https://support.microsoft.com/en-us/office/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46)
        // From the example of column width behavior (https://docs.microsoft.com/en-US/office/troubleshoot/excel/determine-column-widths#example-of-column-width-behavior)
        // a value of 10 corresponds to 75px. This is an approximation, because column width depends on the font-size
        width: Math.min(255, column.width ? column.width / 7.5 : 8.43),
        style: __assign(__assign({}, (type && (defaultColumnsStyles === null || defaultColumnsStyles === void 0 ? void 0 : defaultColumnsStyles[type]))), columnsStyles === null || columnsStyles === void 0 ? void 0 : columnsStyles[field]),
    };
};
exports.serializeColumn = serializeColumn;
function serializeColumns(columns, styles) {
    return columns.map(function (column) { return (0, exports.serializeColumn)(column, styles); });
}
function getDataForValueOptionsSheet(columns, valueOptionsSheetName, api) {
    return __awaiter(this, void 0, void 0, function () {
        var excelJS, workbook, worksheet, record, worksheetColumns, _loop_1, i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, utils_1.getExcelJs)()];
                case 1:
                    excelJS = _b.sent();
                    workbook = new excelJS.Workbook();
                    worksheet = workbook.addWorksheet('Sheet1');
                    record = {};
                    worksheetColumns = [];
                    _loop_1 = function (i) {
                        var column = columns[i];
                        var isCandidateColumn = (0, internals_1.isSingleSelectColDef)(column) && Array.isArray(column.valueOptions);
                        if (!isCandidateColumn) {
                            return "continue";
                        }
                        worksheetColumns.push({ key: column.field });
                        worksheet.columns = worksheetColumns;
                        var header = (_a = column.headerName) !== null && _a !== void 0 ? _a : column.field;
                        var values = [header];
                        getFormattedValueOptions(column, {}, column.valueOptions, api, function (value) {
                            values.push(value);
                        });
                        var letter = worksheet.getColumn(column.field).letter;
                        var address = "".concat(valueOptionsSheetName, "!$").concat(letter, "$2:$").concat(letter, "$").concat(values.length);
                        record[column.field] = { values: values, address: address };
                    };
                    for (i = 0; i < columns.length; i += 1) {
                        _loop_1(i);
                    }
                    return [2 /*return*/, record];
            }
        });
    });
}
function buildExcel(options, apiRef) {
    return __awaiter(this, void 0, void 0, function () {
        var columns, rowIds, includeHeaders, includeColumnGroupsHeaders, _a, valueOptionsSheetName, exceljsPreProcess, exceljsPostProcess, _b, columnsStyles, excelJS, workbook, worksheet, serializedColumns, columnGroupPaths, valueOptionsData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    columns = options.columns, rowIds = options.rowIds, includeHeaders = options.includeHeaders, includeColumnGroupsHeaders = options.includeColumnGroupsHeaders, _a = options.valueOptionsSheetName, valueOptionsSheetName = _a === void 0 ? 'Options' : _a, exceljsPreProcess = options.exceljsPreProcess, exceljsPostProcess = options.exceljsPostProcess, _b = options.columnsStyles, columnsStyles = _b === void 0 ? {} : _b;
                    return [4 /*yield*/, (0, utils_1.getExcelJs)()];
                case 1:
                    excelJS = _c.sent();
                    workbook = new excelJS.Workbook();
                    worksheet = workbook.addWorksheet('Sheet1');
                    serializedColumns = serializeColumns(columns, columnsStyles);
                    worksheet.columns = serializedColumns;
                    if (!exceljsPreProcess) return [3 /*break*/, 3];
                    return [4 /*yield*/, exceljsPreProcess({
                            workbook: workbook,
                            worksheet: worksheet,
                        })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    if (includeColumnGroupsHeaders) {
                        columnGroupPaths = columns.reduce(function (acc, column) {
                            acc[column.field] = apiRef.current.getColumnGroupPath(column.field);
                            return acc;
                        }, {});
                        (0, utils_1.addColumnGroupingHeaders)(worksheet, serializedColumns, columnGroupPaths, apiRef.current.getAllGroupDetails());
                    }
                    if (includeHeaders) {
                        worksheet.addRow(columns.map(function (column) { var _a; return (_a = column.headerName) !== null && _a !== void 0 ? _a : column.field; }));
                    }
                    return [4 /*yield*/, getDataForValueOptionsSheet(columns, valueOptionsSheetName, apiRef.current)];
                case 4:
                    valueOptionsData = _c.sent();
                    (0, utils_1.createValueOptionsSheetIfNeeded)(valueOptionsData, valueOptionsSheetName, workbook);
                    apiRef.current.resetColSpan();
                    rowIds.forEach(function (id) {
                        var serializedRow = (0, exports.serializeRowUnsafe)(id, columns, apiRef, valueOptionsData, options);
                        (0, utils_1.addSerializedRowToWorksheet)(serializedRow, worksheet);
                    });
                    apiRef.current.resetColSpan();
                    if (!exceljsPostProcess) return [3 /*break*/, 6];
                    return [4 /*yield*/, exceljsPostProcess({
                            workbook: workbook,
                            worksheet: worksheet,
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/, workbook];
            }
        });
    });
}
