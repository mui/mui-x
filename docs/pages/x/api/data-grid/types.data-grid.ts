// POC entry — see sibling charts/types.gauge.ts for the approach.
// NOTE: without the upstream memoization fix to formatInlineTypeAsHast
// this file will crash the webpack loader with a WASM OOM at ~100s.
// See the `diagnose-oom` commit message on this branch for the analysis.
import { DataGrid } from '@mui/x-data-grid';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesDataGrid = createTypes(import.meta.url, DataGrid);
