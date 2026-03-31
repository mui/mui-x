import { warnOnce } from '@mui/x-internals/warning';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../../colDef';
function sanitizeCellValue(value, csvOptions) {
    if (value === null || value === undefined) {
        return '';
    }
    const valueStr = typeof value === 'string' ? value : `${value}`;
    if (csvOptions.shouldAppendQuotes || csvOptions.escapeFormulas) {
        const escapedValue = valueStr.replace(/"/g, '""');
        if (csvOptions.escapeFormulas) {
            // See https://owasp.org/www-community/attacks/CSV_Injection
            if (['=', '+', '-', '@', '\t', '\r'].includes(escapedValue[0])) {
                return `"'${escapedValue}"`;
            }
        }
        // Make sure value containing delimiter or line break won't be split into multiple cells
        if ([csvOptions.delimiter, '\n', '\r', '"'].some((delimiter) => valueStr.includes(delimiter))) {
            return `"${escapedValue}"`;
        }
        return escapedValue;
    }
    return valueStr;
}
export const serializeCellValue = (cellParams, options) => {
    const { csvOptions, ignoreValueFormatter } = options;
    let value;
    if (ignoreValueFormatter) {
        const columnType = cellParams.colDef.type;
        if (columnType === 'number') {
            value = String(cellParams.value);
        }
        else if (columnType === 'date' || columnType === 'dateTime') {
            value = cellParams.value?.toISOString();
        }
        else if (typeof cellParams.value?.toString === 'function') {
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
class CSVRow {
    options;
    rowString = '';
    isEmpty = true;
    constructor(options) {
        this.options = options;
    }
    addValue(value) {
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
    }
    getRowString() {
        return this.rowString;
    }
}
const serializeRow = ({ id, columns, getCellParams, csvOptions, ignoreValueFormatter, }) => {
    const row = new CSVRow({ csvOptions });
    columns.forEach((column) => {
        const cellParams = getCellParams(id, column.field);
        if (String(cellParams.formattedValue) === '[object Object]') {
            warnOnce([
                'MUI X: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
                'You can provide a `valueFormatter` with a string representation to be used.',
            ]);
        }
        row.addValue(serializeCellValue(cellParams, {
            ignoreValueFormatter,
            csvOptions,
        }));
    });
    return row.getRowString();
};
export function buildCSV(options) {
    const { columns, rowIds, csvOptions, ignoreValueFormatter, apiRef } = options;
    const CSVBody = rowIds
        .reduce((acc, id) => `${acc}${serializeRow({
        id,
        columns,
        getCellParams: apiRef.current.getCellParams,
        ignoreValueFormatter,
        csvOptions,
    })}\r\n`, '')
        .trim();
    if (!csvOptions.includeHeaders) {
        return CSVBody;
    }
    const filteredColumns = columns.filter((column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field);
    const headerRows = [];
    if (csvOptions.includeColumnGroupsHeaders) {
        const columnGroupLookup = apiRef.current.getAllGroupDetails();
        let maxColumnGroupsDepth = 0;
        const columnGroupPathsLookup = filteredColumns.reduce((acc, column) => {
            const columnGroupPath = apiRef.current.getColumnGroupPath(column.field);
            acc[column.field] = columnGroupPath;
            maxColumnGroupsDepth = Math.max(maxColumnGroupsDepth, columnGroupPath.length);
            return acc;
        }, {});
        for (let i = 0; i < maxColumnGroupsDepth; i += 1) {
            const headerGroupRow = new CSVRow({
                csvOptions,
                sanitizeCellValue,
            });
            headerRows.push(headerGroupRow);
            filteredColumns.forEach((column) => {
                const columnGroupId = (columnGroupPathsLookup[column.field] || [])[i];
                const columnGroup = columnGroupLookup[columnGroupId];
                headerGroupRow.addValue(columnGroup ? columnGroup.headerName || columnGroup.groupId : '');
            });
        }
    }
    const mainHeaderRow = new CSVRow({
        csvOptions,
        sanitizeCellValue,
    });
    filteredColumns.forEach((column) => {
        mainHeaderRow.addValue(column.headerName || column.field);
    });
    headerRows.push(mainHeaderRow);
    const CSVHead = `${headerRows.map((row) => row.getRowString()).join('\r\n')}\r\n`;
    return `${CSVHead}${CSVBody}`.trim();
}
