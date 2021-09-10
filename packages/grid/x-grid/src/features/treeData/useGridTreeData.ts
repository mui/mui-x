/**
 * Only available in DataGridPro
 */
import {useGridApiEventHandler} from "../../../../_modules_/grid/hooks/root/useGridApiEventHandler";
import {GridApiRef, GridComponentProps, GridEvents } from "../../../../_modules_/grid";

export const useGridTreeData = (apiRef: GridApiRef, props: Pick<GridComponentProps, 'treeData'>) => {
    useGridApiEventHandler(apiRef, GridEvents.rowsSet, console.log)
}