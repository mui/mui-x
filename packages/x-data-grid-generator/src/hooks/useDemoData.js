'use client';
import * as React from 'react';
import { LRUCache } from 'lru-cache';
import { getRealGridData } from '../services/real-data-service';
import { getCommodityColumns } from '../columns/commodities.columns';
import { getEmployeeColumns } from '../columns/employees.columns';
import asyncWorker from '../services/asyncWorker';
import { addTreeDataOptionsToDemoData, } from '../services/tree-data-generator';
const dataCache = new LRUCache({
    max: 10,
    ttl: 60 * 5 * 1e3, // 5 minutes
});
// Generate fake data from a seed.
// It's about x20 faster than getRealData.
export async function extrapolateSeed(rowLength, data) {
    return new Promise((resolve) => {
        const seed = data.rows;
        const rows = data.rows.slice();
        const tasks = { current: rowLength - seed.length };
        function work() {
            const row = {};
            for (let j = 0; j < data.columns.length; j += 1) {
                const column = data.columns[j];
                const index = Math.round(Math.random() * (seed.length - 1));
                if (column.field === 'id') {
                    row.id = `id-${tasks.current + seed.length}`;
                }
                else {
                    row[column.field] = seed[index][column.field];
                }
            }
            rows.push(row);
            tasks.current -= 1;
        }
        asyncWorker({
            work,
            done: () => resolve({ ...data, rows }),
            tasks,
        });
    });
}
export const deepFreeze = (object) => {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);
    // Freeze properties before freezing self
    for (const name of propNames) {
        const value = object[name];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
};
export const getColumnsFromOptions = (options) => {
    let columns = options.dataSet === 'Commodity' ? getCommodityColumns(options.editable) : getEmployeeColumns();
    if (options.visibleFields) {
        columns = columns.map((col) => ({ ...col, hide: !options.visibleFields?.includes(col.field) }));
    }
    if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
    }
    return columns;
};
export const getInitialState = (options, columns) => {
    const columnVisibilityModel = {};
    columns.forEach((col) => {
        if (col.hide) {
            columnVisibilityModel[col.field] = false;
        }
    });
    const groupingField = options.treeData?.groupingField;
    if (groupingField) {
        columnVisibilityModel[groupingField] = false;
    }
    return { columns: { columnVisibilityModel } };
};
export const useDemoData = (options) => {
    const [rowLength, setRowLength] = React.useState(options.rowLength);
    const [index, setIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const columns = React.useMemo(() => {
        return getColumnsFromOptions({
            dataSet: options.dataSet,
            editable: options.editable,
            maxColumns: options.maxColumns,
            visibleFields: options.visibleFields,
        });
    }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);
    const [data, setData] = React.useState(() => {
        return addTreeDataOptionsToDemoData({
            columns,
            rows: [],
            initialState: getInitialState(options, columns),
        }, options.treeData);
    });
    React.useEffect(() => {
        const cacheKey = `${options.dataSet}-${rowLength}-${index}-${options.maxColumns}-treeData:${(options.treeData?.maxDepth || 1) > 1 ? 'true' : 'false'}`;
        // Cache to allow fast switch between the JavaScript and TypeScript version
        // of the demos.
        if (dataCache.has(cacheKey)) {
            const newData = dataCache.get(cacheKey);
            setData(newData);
            setLoading(false);
            return undefined;
        }
        let active = true;
        (async () => {
            setLoading(true);
            let newData;
            if (rowLength > 1000) {
                newData = await getRealGridData(1000, columns);
                newData = await extrapolateSeed(rowLength, newData);
            }
            else {
                newData = await getRealGridData(rowLength, columns);
            }
            if (!active) {
                return;
            }
            newData = addTreeDataOptionsToDemoData(newData, {
                maxDepth: options.treeData?.maxDepth,
                groupingField: options.treeData?.groupingField,
                averageChildren: options.treeData?.averageChildren,
            });
            // It's quite slow. No need for it in production.
            if (process.env.NODE_ENV !== 'production') {
                deepFreeze(newData);
            }
            dataCache.set(cacheKey, newData);
            setData(newData);
            setLoading(false);
        })();
        return () => {
            active = false;
        };
    }, [
        rowLength,
        options.dataSet,
        options.maxColumns,
        options.treeData?.maxDepth,
        options.treeData?.groupingField,
        options.treeData?.averageChildren,
        index,
        columns,
    ]);
    return {
        data,
        loading,
        setRowLength,
        loadNewData: () => {
            setIndex((oldIndex) => oldIndex + 1);
        },
    };
};
