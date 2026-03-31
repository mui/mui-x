'use client';
import * as React from 'react';
import { useGridEvent, useGridSelector, gridSortModelSelector, gridFilterModelSelector, gridRenderContextSelector, useGridEventPriority, } from '@mui/x-data-grid';
import { getVisibleRows } from '@mui/x-data-grid/internals';
import { findSkeletonRowsSection } from './utils';
/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridLazyLoader = (privateApiRef, props) => {
    const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
    const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
    const renderedRowsIntervalCache = React.useRef({
        firstRowToRender: 0,
        lastRowToRender: 0,
    });
    const isDisabled = props.rowsLoadingMode !== 'server';
    const handleRenderedRowsIntervalChange = React.useCallback((params) => {
        if (isDisabled) {
            return;
        }
        const fetchRowsParams = {
            firstRowToRender: params.firstRowIndex,
            lastRowToRender: params.lastRowIndex,
            sortModel,
            filterModel,
        };
        if (renderedRowsIntervalCache.current.firstRowToRender === params.firstRowIndex &&
            renderedRowsIntervalCache.current.lastRowToRender === params.lastRowIndex) {
            return;
        }
        renderedRowsIntervalCache.current = {
            firstRowToRender: params.firstRowIndex,
            lastRowToRender: params.lastRowIndex,
        };
        if (sortModel.length === 0 && filterModel.items.length === 0) {
            const currentVisibleRows = getVisibleRows(privateApiRef, {
                pagination: props.pagination,
                paginationMode: props.paginationMode,
            });
            const skeletonRowsSection = findSkeletonRowsSection({
                apiRef: privateApiRef,
                visibleRows: currentVisibleRows.rows,
                range: {
                    firstRowIndex: params.firstRowIndex,
                    lastRowIndex: params.lastRowIndex,
                },
            });
            if (!skeletonRowsSection) {
                return;
            }
            fetchRowsParams.firstRowToRender = skeletonRowsSection.firstRowIndex;
            fetchRowsParams.lastRowToRender = skeletonRowsSection.lastRowIndex;
        }
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, props.pagination, props.paginationMode, sortModel, filterModel]);
    const handleGridSortModelChange = React.useCallback((newSortModel) => {
        if (isDisabled) {
            return;
        }
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
        const renderContext = gridRenderContextSelector(privateApiRef);
        const fetchRowsParams = {
            firstRowToRender: renderContext.firstRowIndex,
            lastRowToRender: renderContext.lastRowIndex,
            sortModel: newSortModel,
            filterModel,
        };
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, filterModel]);
    const handleGridFilterModelChange = React.useCallback((newFilterModel) => {
        if (isDisabled) {
            return;
        }
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
        const renderContext = gridRenderContextSelector(privateApiRef);
        const fetchRowsParams = {
            firstRowToRender: renderContext.firstRowIndex,
            lastRowToRender: renderContext.lastRowIndex,
            sortModel,
            filterModel: newFilterModel,
        };
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, sortModel]);
    useGridEvent(privateApiRef, 'renderedRowsIntervalChange', handleRenderedRowsIntervalChange);
    useGridEvent(privateApiRef, 'sortModelChange', handleGridSortModelChange);
    useGridEvent(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
    useGridEventPriority(privateApiRef, 'fetchRows', props.onFetchRows);
};
