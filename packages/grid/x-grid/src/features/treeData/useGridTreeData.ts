import * as React from 'react'
import {useGridApiEventHandler} from "../../../../_modules_/grid/hooks/root/useGridApiEventHandler";
import {
    GridApiRef,
    GridComponentProps,
    GridEvents,
    gridRowsLookupSelector,
} from "../../../../_modules_/grid";

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (apiRef: GridApiRef, props: Pick<GridComponentProps, 'treeData'>) => {
    const getDataPath = React.useCallback((data) => [], [])

    const handleRowsSet = React.useCallback(() => {
        const rowsLookup = gridRowsLookupSelector(apiRef.current.state)

        console.log(rowsLookup)
    }, [apiRef])

    useGridApiEventHandler(apiRef, GridEvents.rowsSet, handleRowsSet)
}