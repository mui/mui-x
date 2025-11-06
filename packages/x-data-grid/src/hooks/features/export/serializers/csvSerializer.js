"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCellValue = void 0;
exports.buildCSV = buildCSV;
var warning_1 = require("@mui/x-internals/warning");
var colDef_1 = require("../../../../colDef");
function sanitizeCellValue(value, csvOptions) {
    if (value === null || value === undefined) {
        return '';
    }
    var valueStr = typeof value === 'string' ? value : "".concat(value);
    if (csvOptions.shouldAppendQuotes || csvOptions.escapeFormulas) {
        var escapedValue = valueStr.replace(/"/g, '""');
        if (csvOptions.escapeFormulas) {
            // See https://owasp.org/www-community/attacks/CSV_Injection
            if (['=', '+', '-', '@', '\t', '\r'].includes(escapedValue[0])) {
                return "\"'".concat(escapedValue, "\"");
            }
        }
        // Make sure value containing delimiter or line break won't be split into multiple cells
        if ([csvOptions.delimiter, '\n', '\r', '"'].some(function (delimiter) { return valueStr.includes(delimiter); })) {
            return "\"".concat(escapedValue, "\"");
        }
        return escapedValue;
    }
    return valueStr;
}
var serializeCellValue = function (cellParams, options) {
    var _a, _b;
    var csvOptions = options.csvOptions, ignoreValueFormatter = options.ignoreValueFormatter;
    var value;
    if (ignoreValueFormatter) {
        var columnType = cellParams.colDef.type;
        if (columnType === 'number') {
            value = String(cellParams.value);
        }
        else if (columnType === 'date' || columnType === 'dateTime') {
            value = (_a = cellParams.value) === null || _a === void 0 ? void 0 : _a.toISOString();
        }
        else if (typeof ((_b = cellParams.value) === null || _b === void 0 ? void 0 : _b.toString) === 'function') {
            value = cellParams.value.toString();
        }
        else {
            value = cellParams.value;
        }
    }
    else {
        value = cellParams.formattedValue;
    }
    return sanitizeCellValue(value, csvOptions);
};
exports.serializeCellValue = serializeCellValue;
var CSVRow = /** @class */ (function () {
    function CSVRow(options) {
        this.rowString = '';
        this.isEmpty = true;
        this.options = options;
    }
    CSVRow.prototype.addValue = function (value) {
        if (!this.isEmpty) {
            this.rowString += this.options.csvOptions.delimiter;
        }
        if (typeof this.options.sanitizeCellValue === 'function') {
            this.rowString += this.options.sanitizeCellValue(value, this.options.csvOptions);
        }
        else {
            this.rowString += value;
        }
        this.isEmpty = false;
    };
    CSVRow.prototype.getRowString = function () {
        return this.rowString;
    };
    return CSVRow;
}());
var serializeRow = function (_a) {
    var id = _a.id, columns = _a.columns, getCellParams = _a.getCellParams, csvOptions = _a.csvOptions, ignoreValueFormatter = _a.ignoreValueFormatter;
    var row = new CSVRow({ csvOptions: csvOptions });
    columns.forEach(function (column) {
        var cellParams = getCellParams(id, column.field);
        if (process.env.NODE_ENV !== 'production') {
            if (String(cellParams.formattedValue) === '[object Object]') {
                (0, warning_1.warnOnce)([
                    'MUI X: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
                    'You can provide a `valueFormatter` with a string representation to be used.',
                ]);
            }
        }
        row.addValue((0, exports.serializeCellValue)(cellParams, {
            ignoreValueFormatter: ignoreValueFormatter,
            csvOptions: csvOptions,
        }));
    });
    return row.getRowString();
};
function buildCSV(options) {
    var columns = options.columns, rowIds = options.rowIds, csvOptions = options.csvOptions, ignoreValueFormatter = options.ignoreValueFormatter, apiRef = options.apiRef;
    var CSVBody = rowIds
        .reduce(function (acc, id) {
        return "".concat(acc).concat(serializeRow({
            id: id,
            columns: columns,
            getCellParams: apiRef.current.getCellParams,
            ignoreValueFormatter: ignoreValueFormatter,
            csvOptions: csvOptions,
        }), "\r\n");
    }, '')
        .trim();
    if (!csvOptions.includeHeaders) {
        return CSVBody;
    }
    var filteredColumns = columns.filter(function (column) { return column.field !== colDef_1.GRID_CHECKBOX_SELECTION_COL_DEF.field; });
    var headerRows = [];
    if (csvOptions.includeColumnGroupsHeaders) {
        var columnGroupLookup_1 = apiRef.current.getAllGroupDetails();
        var maxColumnGroupsDepth_1 = 0;
        var columnGroupPathsLookup_1 = filteredColumns.reduce(function (acc, column) {
            var columnGroupPath = apiRef.current.getColumnGroupPath(column.field);
            acc[column.field] = columnGroupPath;
            maxColumnGroupsDepth_1 = Math.max(maxColumnGroupsDepth_1, columnGroupPath.length);
            return acc;
        }, {});
        var _loop_1 = function (i) {
            var headerGroupRow = new CSVRow({
                csvOptions: csvOptions,
                sanitizeCellValue: sanitizeCellValue,
            });
            headerRows.push(headerGroupRow);
            filteredColumns.forEach(function (column) {
                var columnGroupId = (columnGroupPathsLookup_1[column.field] || [])[i];
                var columnGroup = columnGroupLookup_1[columnGroupId];
                headerGroupRow.addValue(columnGroup ? columnGroup.headerName || columnGroup.groupId : '');
            });
        };
        for (var i = 0; i < maxColumnGroupsDepth_1; i += 1) {
            _loop_1(i);
        }
    }
    var mainHeaderRow = new CSVRow({
        csvOptions: csvOptions,
        sanitizeCellValue: sanitizeCellValue,
    });
    filteredColumns.forEach(function (column) {
        mainHeaderRow.addValue(column.headerName || column.field);
    });
    headerRows.push(mainHeaderRow);
    var CSVHead = "".concat(headerRows.map(function (row) { return row.getRowString(); }).join('\r\n'), "\r\n");
    return "".concat(CSVHead).concat(CSVBody).trim();
}
