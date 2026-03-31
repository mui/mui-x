import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    return React.useMemo(() => {
        const slots = {
            rowReorderCellContainer: ['rowReorderCellContainer'],
            columnHeaderReorder: ['columnHeaderReorder'],
        };
        return composeClasses(slots, getDataGridUtilityClass, classes);
    }, [classes]);
};
export const useGridRowReorderPreProcessors = (privateApiRef, props) => {
    const ownerState = { classes: props.classes };
    const classes = useUtilityClasses(ownerState);
    const updateReorderColumn = React.useCallback((columnsState) => {
        const reorderColumn = {
            ...GRID_REORDER_COL_DEF,
            cellClassName: classes.rowReorderCellContainer,
            headerClassName: classes.columnHeaderReorder,
            headerName: privateApiRef.current.getLocaleText('rowReorderingHeaderName'),
        };
        const shouldHaveReorderColumn = props.rowReordering;
        const hasReorderColumn = columnsState.lookup[reorderColumn.field] != null;
        if (shouldHaveReorderColumn && !hasReorderColumn) {
            columnsState.lookup[reorderColumn.field] = reorderColumn;
            columnsState.orderedFields = [reorderColumn.field, ...columnsState.orderedFields];
        }
        else if (!shouldHaveReorderColumn && hasReorderColumn) {
            delete columnsState.lookup[reorderColumn.field];
            columnsState.orderedFields = columnsState.orderedFields.filter((field) => field !== reorderColumn.field);
        }
        else if (shouldHaveReorderColumn && hasReorderColumn) {
            columnsState.lookup[reorderColumn.field] = {
                ...reorderColumn,
                ...columnsState.lookup[reorderColumn.field],
            };
            // If the column is not in the columns array (not a custom reorder column), move it to the beginning of the column order
            if (!props.columns.some((col) => col.field === GRID_REORDER_COL_DEF.field)) {
                columnsState.orderedFields = [
                    reorderColumn.field,
                    ...columnsState.orderedFields.filter((field) => field !== reorderColumn.field),
                ];
            }
        }
        return columnsState;
    }, [privateApiRef, classes, props.columns, props.rowReordering]);
    useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateReorderColumn);
};
