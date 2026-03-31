'use client';
import * as React from 'react';
import { gridColumnVisibilityModelSelector, } from '@mui/x-data-grid-pro';
const updateColumnVisibilityModel = (columnVisibilityModel, rowGroupingModel, prevRowGroupingModel) => {
    const newColumnVisibilityModel = { ...columnVisibilityModel };
    rowGroupingModel?.forEach((field) => {
        if (!prevRowGroupingModel?.includes(field)) {
            newColumnVisibilityModel[field] = false;
        }
    });
    prevRowGroupingModel?.forEach((field) => {
        if (!rowGroupingModel?.includes(field)) {
            newColumnVisibilityModel[field] = true;
        }
    });
    return newColumnVisibilityModel;
};
/**
 * Automatically hide columns when added to the row grouping model and stop hiding them when they are removed.
 * Handles both the `props.initialState.rowGrouping.model` and `props.rowGroupingModel`
 * Does not work when used with the `hide` property of `GridColDef`
 */
export const useKeepGroupedColumnsHidden = (props) => {
    const initialProps = React.useRef(props);
    const rowGroupingModel = React.useRef(props.rowGroupingModel ?? props.initialState?.rowGrouping?.model);
    React.useEffect(() => {
        props.apiRef.current?.subscribeEvent('rowGroupingModelChange', (newModel) => {
            const columnVisibilityModel = updateColumnVisibilityModel(gridColumnVisibilityModelSelector(props.apiRef), newModel, rowGroupingModel.current);
            props.apiRef.current?.setColumnVisibilityModel(columnVisibilityModel);
            rowGroupingModel.current = newModel;
        });
    }, [props.apiRef]);
    return React.useMemo(() => {
        const invariantInitialState = initialProps.current.initialState;
        const columnVisibilityModel = updateColumnVisibilityModel(invariantInitialState?.columns?.columnVisibilityModel, rowGroupingModel.current, undefined);
        return {
            ...invariantInitialState,
            columns: {
                ...invariantInitialState?.columns,
                columnVisibilityModel,
            },
        };
    }, []);
};
