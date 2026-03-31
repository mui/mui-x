import { isLeaf, gridStringOrNumberComparator, } from '@mui/x-data-grid-pro';
import { getDefaultColTypeDef } from '@mui/x-data-grid-pro/internals';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';
import { isGroupingColumn } from '../rowGrouping';
import { defaultGetAggregationPosition } from '../aggregation/gridAggregationUtils';
export const defaultGetPivotDerivedColumns = (column, getLocaleText) => {
    if (column.type === 'date') {
        const field = column.field;
        return [
            {
                // String column type to avoid formatting the value as 2,025 instead of 2025
                field: `${field}-year`,
                headerName: `${column.headerName} ${getLocaleText('pivotYearColumnHeaderName')}`,
                valueGetter: (value, row) => new Date(row[field]).getFullYear(),
            },
            {
                field: `${field}-quarter`,
                headerName: `${column.headerName} ${getLocaleText('pivotQuarterColumnHeaderName')}`,
                valueGetter: (value, row) => `Q${Math.floor(new Date(row[field]).getMonth() / 3) + 1}`,
            },
        ];
    }
    return undefined;
};
export const getInitialColumns = (originalColumns, getPivotDerivedColumns, getLocaleText) => {
    const initialColumns = new Map();
    for (let i = 0; i < originalColumns.length; i += 1) {
        const originalColumn = originalColumns[i];
        const column = { ...getDefaultColTypeDef(originalColumn.type), ...originalColumn };
        const field = column.field;
        if (!isGroupingColumn(field)) {
            initialColumns.set(field, column);
            const derivedColumns = getPivotDerivedColumns?.(column, getLocaleText);
            if (derivedColumns) {
                derivedColumns.forEach((col) => initialColumns.set(col.field, col));
            }
        }
    }
    return initialColumns;
};
const sortColumnGroups = (columnGroups, pivotModelColumns, depth = 0) => {
    if (depth > pivotModelColumns.length - 1) {
        return;
    }
    const sort = pivotModelColumns[depth].sort;
    if (columnGroups.length < 2) {
        if (columnGroups[0]?.children) {
            sortColumnGroups(columnGroups[0].children, pivotModelColumns, depth + 1);
        }
        return;
    }
    columnGroups.sort((a, b) => {
        if (isLeaf(a) || isLeaf(b)) {
            return 0;
        }
        if (a.children) {
            sortColumnGroups(a.children, pivotModelColumns, depth + 1);
        }
        if (b.children) {
            sortColumnGroups(b.children, pivotModelColumns, depth + 1);
        }
        if (sort === undefined) {
            return 0;
        }
        return ((sort === 'asc' ? 1 : -1) *
            gridStringOrNumberComparator(a.rawHeaderName, b.rawHeaderName, {}, {}));
    });
};
export const getPivotForcedProps = (pivotModel, columns, groupingColDef) => {
    const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
    const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
    const visibleValues = pivotModel.values.filter((value) => !value.hidden);
    const columnVisibilityModel = {};
    for (const column of columns.values()) {
        columnVisibilityModel[column.field] = false;
    }
    if (visibleColumns.length === 0) {
        visibleValues.forEach((value) => {
            delete columnVisibilityModel[value.field];
        });
    }
    const groupingColDefOverrides = (params) => ({
        ...(typeof groupingColDef === 'function' ? groupingColDef(params) : groupingColDef || {}),
        ...{
            filterable: false,
            aggregable: false,
            hideable: false,
        },
    });
    return {
        columnVisibilityModel,
        rowGroupingModel: visibleRows.map((row) => row.field),
        getAggregationPosition: defaultGetAggregationPosition,
        groupingColDef: groupingColDefOverrides,
        headerFilters: false,
        disableAggregation: false,
        disableRowGrouping: false,
    };
};
export const createPivotPropsFromRows = ({ rows, columns, pivotModel, pivotingColDef, apiRef, }) => {
    const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
    const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
    const visibleValues = pivotModel.values.filter((value) => !value.hidden);
    let pivotColumns = [];
    const pivotColumnsIncludedInPivotValues = [];
    const initialColumns = new Map();
    for (const column of columns.values()) {
        if (!isGroupingColumn(column.field)) {
            initialColumns.set(column.field, column);
            const pivotValueIndex = visibleValues.findIndex(({ field }) => field === column.field);
            const isVisiblePivotValueField = pivotValueIndex !== -1;
            const columnToAdd = {
                ...column,
                aggregable: false,
                groupable: false,
                hideable: false,
                editable: false,
                disableReorder: true,
            };
            if (isVisiblePivotValueField) {
                // Store columns that are used as pivot values in a temporary array to keep them in the same order as in pivotModel.values, not in the order of the initial columns.
                // `pivotColumnsIncludedInPivotValues` is concatenated to pivotColumns later.
                pivotColumnsIncludedInPivotValues[pivotValueIndex] = columnToAdd;
            }
            else {
                pivotColumns.push(columnToAdd);
            }
        }
    }
    pivotColumns = pivotColumns.concat(pivotColumnsIncludedInPivotValues);
    const getAttributesFromInitialColumn = (field) => {
        const initialColumn = initialColumns.get(field);
        if (!initialColumn) {
            return undefined;
        }
        const attributes = {
            width: initialColumn.width,
            minWidth: initialColumn.minWidth,
            maxWidth: initialColumn.maxWidth,
            valueFormatter: initialColumn.valueFormatter,
            headerName: initialColumn.headerName,
            renderCell: initialColumn.renderCell,
            display: initialColumn.display,
        };
        return attributes;
    };
    const aggregationModel = {};
    const columnGroupingModel = [];
    const columnGroupingModelLookup = new Map();
    let newRows = [];
    if (visibleColumns.length === 0) {
        newRows = rows;
        visibleValues.forEach((pivotValue) => {
            aggregationModel[pivotValue.field] = pivotValue.aggFunc;
        });
    }
    else {
        for (let i = 0; i < rows.length; i += 1) {
            const row = rows[i];
            const newRow = { ...row };
            const columnGroupPath = [];
            for (let j = 0; j < visibleColumns.length; j += 1) {
                const { field: colGroupField } = visibleColumns[j];
                const depth = j;
                const column = initialColumns.get(colGroupField);
                if (!column) {
                    continue;
                }
                const noValueString = '(No value)';
                let colValue = apiRef.current.getRowValue(row, column) ?? noValueString;
                // Handle empty strings to prevent issues with column grouping model
                // https://github.com/mui/mui-x/issues/20552
                if (colValue === '') {
                    colValue = noValueString;
                }
                if (column.type === 'singleSelect') {
                    const singleSelectColumn = column;
                    if (singleSelectColumn.getOptionLabel) {
                        colValue = singleSelectColumn.getOptionLabel(colValue);
                    }
                }
                if (column.type !== 'number') {
                    colValue = String(colValue);
                }
                const formattedHeaderName = apiRef.current.getRowFormattedValue(row, column) || colValue;
                columnGroupPath.push(colValue);
                const groupId = columnGroupPath.join(COLUMN_GROUP_ID_SEPARATOR);
                if (!columnGroupingModelLookup.has(groupId)) {
                    const columnGroup = {
                        groupId,
                        headerName: formattedHeaderName,
                        rawHeaderName: colValue,
                        children: [],
                    };
                    columnGroupingModelLookup.set(groupId, columnGroup);
                    if (depth === 0) {
                        columnGroupingModel.push(columnGroup);
                    }
                    else {
                        const parentGroupId = columnGroupPath.slice(0, -1).join(COLUMN_GROUP_ID_SEPARATOR);
                        const parentGroup = columnGroupingModelLookup.get(parentGroupId);
                        if (parentGroup) {
                            parentGroup.children.push(columnGroup);
                        }
                    }
                }
                const isLastColumnGroupLevel = depth === visibleColumns.length - 1;
                if (isLastColumnGroupLevel) {
                    visibleValues.forEach((pivotValue) => {
                        const valueField = pivotValue.field;
                        const originalColumn = initialColumns.get(valueField);
                        if (!originalColumn) {
                            return;
                        }
                        const valueKey = `${columnGroupPath.join(COLUMN_GROUP_ID_SEPARATOR)}${COLUMN_GROUP_ID_SEPARATOR}${valueField}`;
                        newRow[valueKey] = apiRef.current.getRowValue(row, originalColumn);
                    });
                }
            }
            newRows.push(newRow);
        }
        sortColumnGroups(columnGroupingModel, visibleColumns);
    }
    function createColumns(columnGroups, depth = 0) {
        for (let i = 0; i < columnGroups.length; i += 1) {
            const columnGroup = columnGroups[i];
            if (isLeaf(columnGroup)) {
                continue;
            }
            const isLastColumnGroupLevel = depth === visibleColumns.length - 1;
            if (isLastColumnGroupLevel) {
                if (visibleValues.length === 0) {
                    // If there are no visible values, there are no actual columns added to the data grid, which leads to column groups not being visible.
                    // Adding an empty column to each column group ensures that the column groups are visible.
                    const emptyColumnField = `${columnGroup.groupId}${COLUMN_GROUP_ID_SEPARATOR}empty`;
                    const emptyColumn = {
                        field: emptyColumnField,
                        headerName: '',
                        sortable: false,
                        filterable: false,
                        groupable: false,
                        aggregable: false,
                        hideable: false,
                        disableColumnMenu: true,
                    };
                    pivotColumns.push(emptyColumn);
                    if (columnGroup) {
                        columnGroup.children.push({ field: emptyColumnField });
                    }
                }
                else {
                    visibleValues.forEach((pivotValue) => {
                        const valueField = pivotValue.field;
                        const mapValueKey = `${columnGroup.groupId}${COLUMN_GROUP_ID_SEPARATOR}${valueField}`;
                        const overrides = typeof pivotingColDef === 'function'
                            ? pivotingColDef(valueField, columnGroup.groupId.split(COLUMN_GROUP_ID_SEPARATOR))
                            : pivotingColDef;
                        const column = {
                            headerName: String(valueField),
                            ...getAttributesFromInitialColumn(pivotValue.field),
                            ...overrides,
                            // pivoting values are always numbers
                            type: 'number',
                            field: mapValueKey,
                            aggregable: false,
                            groupable: false,
                            filterable: false,
                            hideable: false,
                            editable: false,
                            disableReorder: true,
                            availableAggregationFunctions: [pivotValue.aggFunc],
                        };
                        pivotColumns.push(column);
                        aggregationModel[mapValueKey] = pivotValue.aggFunc;
                        if (columnGroup) {
                            columnGroup.children.push({ field: mapValueKey });
                        }
                    });
                }
            }
            else {
                createColumns(columnGroup.children, depth + 1);
            }
        }
    }
    createColumns(columnGroupingModel);
    return {
        rows: visibleRows.length > 0 ? newRows : [],
        columns: pivotColumns,
        columnGroupingModel,
        aggregationModel,
    };
};
