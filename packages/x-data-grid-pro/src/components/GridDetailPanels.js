'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowIdsSelector, } from '../hooks/features/detailPanel';
import { GridDetailPanel } from './GridDetailPanel';
import { gridDetailPanelRawHeightCacheSelector } from '../hooks/features/detailPanel/gridDetailPanelSelector';
const useUtilityClasses = () => {
    const slots = {
        detailPanel: ['detailPanel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, {});
};
export function GridDetailPanels(props) {
    const rootProps = useGridRootProps();
    if (!rootProps.getDetailPanelContent) {
        return null;
    }
    return React.createElement(GridDetailPanelsImpl, props);
}
function GridDetailPanelsImpl(_) {
    const apiRef = useGridPrivateApiContext();
    const classes = useUtilityClasses();
    const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
    const detailPanelsContent = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
    const detailPanelsHeights = useGridSelector(apiRef, gridDetailPanelRawHeightCacheSelector);
    const getDetailPanel = React.useCallback((rowId) => {
        const content = detailPanelsContent[rowId];
        // Check if the id exists in the current page
        const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
        const exists = rowIndex !== undefined;
        if (!React.isValidElement(content) || !exists) {
            return null;
        }
        const heightCache = detailPanelsHeights[rowId];
        const height = heightCache.autoHeight ? 'auto' : heightCache.height;
        return (_jsx(GridDetailPanel, { rowId: rowId, height: height, className: classes.detailPanel, children: content }, `panel-${rowId}`));
    }, [apiRef, classes.detailPanel, detailPanelsHeights, detailPanelsContent]);
    React.useEffect(() => {
        const map = new Map();
        for (const rowId of expandedRowIds) {
            map.set(rowId, getDetailPanel(rowId));
        }
        apiRef.current.virtualizer.api.setPanels(map);
    }, [expandedRowIds, apiRef, getDetailPanel]);
    return null;
}
