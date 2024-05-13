import { GridRowId } from '@mui/x-data-grid';

export interface GridServerSideDataInternalCache {
  groupKeys: any[];
}

export interface GridServerSideDataState {
  loading: Record<GridRowId, boolean>;
  errors: Record<GridRowId, any>;
}
