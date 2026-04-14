import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesDataGrid = createTypes(import.meta.url, DataGrid);
