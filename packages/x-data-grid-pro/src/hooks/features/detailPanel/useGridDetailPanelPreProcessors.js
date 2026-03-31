import * as React from 'react';
import { gridClasses } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, } from './gridDetailPanelToggleColDef';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';
export const useGridDetailPanelPreProcessors = (privateApiRef, props) => {
    const addToggleColumn = React.useCallback((columnsState) => {
        const detailPanelToggleColumn = {
            ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
            headerName: privateApiRef.current.getLocaleText('detailPanelToggle'),
        };
        const shouldHaveToggleColumn = !!props.getDetailPanelContent;
        const hasToggleColumn = columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] != null;
        if (shouldHaveToggleColumn && !hasToggleColumn) {
            columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] = detailPanelToggleColumn;
            columnsState.orderedFields = [
                GRID_DETAIL_PANEL_TOGGLE_FIELD,
                ...columnsState.orderedFields,
            ];
        }
        else if (!shouldHaveToggleColumn && hasToggleColumn) {
            delete columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD];
            columnsState.orderedFields = columnsState.orderedFields.filter((field) => field !== GRID_DETAIL_PANEL_TOGGLE_FIELD);
        }
        else if (shouldHaveToggleColumn && hasToggleColumn) {
            columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] = {
                ...detailPanelToggleColumn,
                ...columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD],
            };
            // If the column is not in the columns array (not a custom detail panel toggle column), move it to the beginning of the column order
            if (!props.columns.some((col) => col.field === GRID_DETAIL_PANEL_TOGGLE_FIELD)) {
                columnsState.orderedFields = [
                    GRID_DETAIL_PANEL_TOGGLE_FIELD,
                    ...columnsState.orderedFields.filter((field) => field !== GRID_DETAIL_PANEL_TOGGLE_FIELD),
                ];
            }
        }
        return columnsState;
    }, [privateApiRef, props.columns, props.getDetailPanelContent]);
    const addExpandedClassToRow = React.useCallback((classes, id) => {
        if (props.getDetailPanelContent == null) {
            return classes;
        }
        const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(privateApiRef);
        if (!expandedRowIds.has(id)) {
            return classes;
        }
        return [...classes, gridClasses['row--detailPanelExpanded']];
    }, [privateApiRef, props.getDetailPanelContent]);
    useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', addToggleColumn);
    useGridRegisterPipeProcessor(privateApiRef, 'rowClassName', addExpandedClassToRow);
};
