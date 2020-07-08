import { RowData, RowId, RowModel, Rows } from '../rows';

export interface RowApi {
  getRowModels: () => Rows;
  getRowsCount: () => number;
  getAllRowIds: () => RowId[];
  setRowModels: (rows: Rows) => void;
  updateRowModels: (updates: Partial<RowModel>[]) => void;
  updateRowData: (updates: RowData[]) => void;
  getRowIdFromRowIndex: (index: number) => RowId;
  getRowIndexFromId: (id: RowId) => number;
  getRowFromId: (id: RowId) => RowModel;
}
