import { GridRowData } from '../../../models/gridRows';

interface GridTreeDataRow {
  value: GridRowData;
  children: GridTreeDataRow[];
}

export interface GridTreeDataState {
  rows: GridTreeDataRow[];
}
