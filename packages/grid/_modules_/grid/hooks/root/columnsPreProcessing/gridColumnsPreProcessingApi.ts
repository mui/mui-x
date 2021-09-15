import { GridColumns } from '../../../models/colDef/gridColDef';

export type GridColumnsPreProcessing = (columns: GridColumns) => GridColumns;

export interface GridColumnsPreProcessingApi {
  registerColumnPreProcessing: (
    processingName: string,
    columnsPreProcessing: GridColumnsPreProcessing | null,
  ) => void;
  applyAllColumnPreProcessing: GridColumnsPreProcessing;
}
