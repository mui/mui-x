import { GridColumns} from "../../../models/colDef/gridColDef";

export type GridColumnsPreProcessing = (columns: GridColumns) => GridColumns;
export type GridColumnsPreProcessingCleanup = () => void

export interface GridColumnsPreProcessingApi {
    registerColumnPreProcessing: (columnsPreProcessing: GridColumnsPreProcessing) => GridColumnsPreProcessingCleanup,
    applyAllColumnPreProcessing: GridColumnsPreProcessing
}