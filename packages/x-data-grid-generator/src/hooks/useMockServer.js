'use client';
import * as React from 'react';
import { LRUCache } from 'lru-cache';
import { getGridDefaultColumnTypes, } from '@mui/x-data-grid-premium';
import { extrapolateSeed, deepFreeze } from './useDemoData';
import { getCommodityColumns } from '../columns/commodities.columns';
import { getEmployeeColumns } from '../columns/employees.columns';
import { getRealGridData } from '../services/real-data-service';
import { addTreeDataOptionsToDemoData, } from '../services/tree-data-generator';
import { loadServerRows, processTreeDataRows, processRowGroupingRows, processPivotingRows, DEFAULT_SERVER_OPTIONS, } from './serverUtils';
import { randomInt } from '../services';
import { getMovieRows, getMovieColumns } from './useMovieData';
const dataCache = new LRUCache({
    max: 10,
    ttl: 60 * 5 * 1e3, // 5 minutes
});
export const BASE_URL = 'https://mui.com/x/api/data-grid';
const GET_DEFAULT_DATASET_OPTIONS = {
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
};
const getColumnsFromOptions = (options) => {
    let columns;
    switch (options.dataSet) {
        case 'Commodity':
            columns = getCommodityColumns(options.editable);
            break;
        case 'Employee':
            columns = getEmployeeColumns();
            break;
        case 'Movies':
            columns = getMovieColumns();
            break;
        default:
            throw new Error('MUI X: Unknown dataset');
    }
    if (options.visibleFields) {
        columns = columns.map((col) => ({ ...col, hide: !options.visibleFields?.includes(col.field) }));
    }
    if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
    }
    if (options.derivedColumns) {
        columns = columns.reduce((acc, col) => {
            acc.push(col);
            if (col.type === 'date' || col.type === 'dateTime') {
                acc.push({
                    type: 'date',
                    field: `${col.field}-year`,
                    generateData: (row) => new Date(row[col.field].getFullYear(), 0, 1),
                    editable: false,
                    derivedFrom: col.field,
                });
                acc.push({
                    type: 'date',
                    field: `${col.field}-month`,
                    generateData: (row) => new Date(row[col.field].getFullYear(), row[col.field].getMonth(), 1),
                    editable: false,
                    derivedFrom: col.field,
                });
            }
            return acc;
        }, []);
    }
    return columns;
};
function decodeParams(url) {
    const params = new URL(url).searchParams;
    const decodedParams = {};
    const array = Array.from(params.entries());
    for (const [key, value] of array) {
        try {
            decodedParams[key] = JSON.parse(value);
        }
        catch {
            decodedParams[key] = value;
        }
    }
    return decodedParams;
}
const getInitialState = (columns, groupingField) => {
    const columnVisibilityModel = {};
    columns.forEach((col) => {
        if (col.hide) {
            columnVisibilityModel[col.field] = false;
        }
    });
    if (groupingField) {
        columnVisibilityModel[groupingField] = false;
    }
    return { columns: { columnVisibilityModel } };
};
const defaultColDef = getGridDefaultColumnTypes();
function sendEmptyResponse() {
    return new Promise((resolve) => {
        resolve({ rows: [], rowCount: 0 });
    });
}
export const useMockServer = (dataSetOptions, serverOptions, shouldRequestsFail, nestedPagination) => {
    const dataRef = React.useRef(null);
    const [isDataReady, setDataReady] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const shouldRequestsFailRef = React.useRef(shouldRequestsFail ?? false);
    React.useEffect(() => {
        if (shouldRequestsFail !== undefined) {
            shouldRequestsFailRef.current = shouldRequestsFail;
        }
    }, [shouldRequestsFail]);
    const options = { ...GET_DEFAULT_DATASET_OPTIONS, ...dataSetOptions };
    const isTreeData = options.treeData?.groupingField != null;
    const columns = React.useMemo(() => {
        return getColumnsFromOptions({
            dataSet: options.dataSet,
            editable: options.editable,
            maxColumns: options.maxColumns,
            visibleFields: options.visibleFields,
            derivedColumns: options.derivedColumns,
        });
    }, [
        options.dataSet,
        options.editable,
        options.maxColumns,
        options.visibleFields,
        options.derivedColumns,
    ]);
    const initialState = React.useMemo(() => getInitialState(columns, options.treeData?.groupingField), [columns, options.treeData?.groupingField]);
    const columnsWithDerivedColDef = React.useMemo(() => columns.map((column) => ({
        ...defaultColDef[column.type || 'string'],
        ...column,
    })), [columns]);
    const columnsWithDefaultColDef = React.useMemo(() => columnsWithDerivedColDef.filter((column) => !column.derivedFrom), [columnsWithDerivedColDef]);
    const getGroupKey = React.useMemo(() => {
        if (isTreeData) {
            return (row) => row[options.treeData.groupingField];
        }
        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.treeData?.groupingField, isTreeData]);
    const getChildrenCount = React.useMemo(() => {
        if (isTreeData) {
            return (row) => row.descendantCount;
        }
        return undefined;
    }, [isTreeData]);
    React.useEffect(() => {
        const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;
        // Cache to allow fast switch between the JavaScript and TypeScript version
        // of the demos.
        if (dataCache.has(cacheKey)) {
            const newData = dataCache.get(cacheKey);
            dataRef.current = newData;
            setDataReady(true);
            return undefined;
        }
        if (options.dataSet === 'Movies') {
            const rowsData = { rows: getMovieRows(), columns };
            dataRef.current = rowsData;
            setDataReady(true);
            dataCache.set(cacheKey, rowsData);
            return undefined;
        }
        let active = true;
        (async () => {
            let rowData;
            const rowLength = options.rowLength;
            if (rowLength > 1000 && !options.derivedColumns) {
                rowData = await getRealGridData(1000, columns);
                rowData = await extrapolateSeed(rowLength, rowData);
            }
            else {
                rowData = await getRealGridData(rowLength, columns);
            }
            if (!active) {
                return;
            }
            if (isTreeData) {
                rowData = addTreeDataOptionsToDemoData(rowData, {
                    maxDepth: options.treeData?.maxDepth,
                    groupingField: options.treeData?.groupingField,
                    averageChildren: options.treeData?.averageChildren,
                });
            }
            if (process.env.NODE_ENV !== 'production') {
                deepFreeze(rowData);
            }
            dataCache.set(cacheKey, rowData);
            dataRef.current = rowData;
            setDataReady(true);
        })();
        return () => {
            active = false;
        };
    }, [
        columns,
        isTreeData,
        options.rowLength,
        options.treeData?.maxDepth,
        options.treeData?.groupingField,
        options.treeData?.averageChildren,
        options.dataSet,
        options.maxColumns,
        options.derivedColumns,
        index,
    ]);
    const fetchRows = React.useCallback(async (requestUrl) => {
        let dataDelay = 0;
        const waitInterval = 10;
        const waitTimeout = 500 * waitInterval; // 5 seconds
        // wait until data is ready
        while (dataRef.current === null) {
            // prevent infinite loop with a timeout
            if (dataDelay > waitTimeout) {
                return sendEmptyResponse();
            }
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => {
                setTimeout(resolve, waitInterval);
            });
            dataDelay += waitInterval;
        }
        if (!requestUrl) {
            return sendEmptyResponse();
        }
        const params = decodeParams(requestUrl);
        const verbose = serverOptions?.verbose ?? true;
        // eslint-disable-next-line no-console
        const print = console.info;
        if (verbose) {
            print('MUI X: DATASOURCE REQUEST', params);
        }
        let getRowsResponse;
        const serverOptionsWithDefault = {
            minDelay: serverOptions?.minDelay ?? DEFAULT_SERVER_OPTIONS.minDelay,
            maxDelay: serverOptions?.maxDelay ?? DEFAULT_SERVER_OPTIONS.maxDelay,
            useCursorPagination: serverOptions?.useCursorPagination ?? DEFAULT_SERVER_OPTIONS.useCursorPagination,
        };
        if (shouldRequestsFailRef.current) {
            // substract the delay made by waiting for data to be ready
            const minDelay = Math.max(0, serverOptionsWithDefault.minDelay - dataDelay);
            const maxDelay = Math.max(0, serverOptionsWithDefault.maxDelay - dataDelay);
            const delay = randomInt(minDelay, maxDelay);
            return new Promise((_, reject) => {
                if (verbose) {
                    print('MUI X: DATASOURCE REQUEST FAILURE', params);
                }
                setTimeout(() => reject(new Error('MUI X: Could not fetch the data')), delay);
            });
        }
        if (isTreeData) {
            const { rows, rootRowCount, aggregateRow } = await processTreeDataRows(dataRef.current?.rows ?? [], params, serverOptionsWithDefault, columnsWithDefaultColDef, nestedPagination ?? false);
            getRowsResponse = {
                rows: rows.slice().map((row) => ({ ...row, path: undefined })),
                rowCount: rootRowCount,
                ...(aggregateRow ? { aggregateRow } : {}),
            };
        }
        else if (typeof params.pivotModel === 'object' &&
            params.pivotModel.columns &&
            params.pivotModel.rows &&
            params.pivotModel.values) {
            const { rows, rootRowCount, pivotColumns, aggregateRow } = await processPivotingRows(dataRef.current?.rows ?? [], params, serverOptionsWithDefault, columnsWithDerivedColDef);
            getRowsResponse = {
                rows: rows.slice(),
                rowCount: rootRowCount,
                pivotColumns,
                aggregateRow,
            };
        }
        else if (params.groupFields && params.groupFields.length > 0) {
            const { rows, rootRowCount, aggregateRow } = await processRowGroupingRows(dataRef.current?.rows ?? [], params, serverOptionsWithDefault, columnsWithDefaultColDef);
            getRowsResponse = {
                rows: rows.slice().map((row) => ({ ...row, path: undefined })),
                rowCount: rootRowCount,
                ...(aggregateRow ? { aggregateRow } : {}),
            };
        }
        else {
            const { returnedRows, nextCursor, totalRowCount, aggregateRow } = await loadServerRows(dataRef.current?.rows ?? [], { ...params, ...params.paginationModel }, serverOptionsWithDefault, columnsWithDefaultColDef);
            getRowsResponse = {
                rows: returnedRows,
                rowCount: totalRowCount,
                pageInfo: { nextCursor },
                ...(aggregateRow ? { aggregateRow } : {}),
            };
        }
        return new Promise((resolve) => {
            if (verbose) {
                print('MUI X: DATASOURCE RESPONSE', params, getRowsResponse);
            }
            resolve(getRowsResponse);
        });
    }, [
        dataRef,
        serverOptions?.verbose,
        serverOptions?.minDelay,
        serverOptions?.maxDelay,
        serverOptions?.useCursorPagination,
        isTreeData,
        columnsWithDefaultColDef,
        columnsWithDerivedColDef,
        nestedPagination,
    ]);
    const editRow = React.useCallback(async (rowId, updatedRow) => {
        return new Promise((resolve, reject) => {
            const minDelay = serverOptions?.minDelay ?? DEFAULT_SERVER_OPTIONS.minDelay;
            const maxDelay = serverOptions?.maxDelay ?? DEFAULT_SERVER_OPTIONS.maxDelay;
            const delay = randomInt(minDelay, maxDelay);
            const verbose = serverOptions?.verbose ?? true;
            // eslint-disable-next-line no-console
            const print = console.info;
            if (verbose) {
                print('MUI X: DATASOURCE EDIT ROW REQUEST', { rowId, updatedRow });
            }
            if (shouldRequestsFailRef.current) {
                setTimeout(() => reject(new Error(`MUI X: Could not update the row with the id ${rowId}`)), delay);
                if (verbose) {
                    print('MUI X: DATASOURCE EDIT ROW FAILURE', { rowId, updatedRow });
                }
                return;
            }
            const newRows = [...(dataRef.current?.rows || [])];
            const rowIndex = newRows.findIndex((row) => row.id === rowId) ?? -1;
            if (rowIndex === -1) {
                return;
            }
            // keep the path from the original row if the updated row's path is `undefined`
            newRows[rowIndex] = { ...updatedRow, path: updatedRow.path || newRows[rowIndex].path };
            const newData = { ...dataRef.current, rows: newRows };
            const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;
            dataCache.set(cacheKey, newData);
            setTimeout(() => {
                if (verbose) {
                    print('MUI X: DATASOURCE EDIT ROW SUCCESS', { rowId, updatedRow });
                }
                resolve(updatedRow);
            }, delay);
            dataRef.current = newData;
        });
    }, [
        index,
        options.dataSet,
        options.maxColumns,
        options.rowLength,
        serverOptions?.maxDelay,
        serverOptions?.minDelay,
        serverOptions?.verbose,
    ]);
    return {
        columns: columnsWithDefaultColDef,
        initialState: options.dataSet === 'Movies' ? {} : initialState,
        getGroupKey,
        getChildrenCount,
        fetchRows,
        editRow,
        loadNewData: () => {
            setIndex((oldIndex) => oldIndex + 1);
        },
        isReady: isDataReady,
    };
};
