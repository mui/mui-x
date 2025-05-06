import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef = (params) =>
  params.fields.includes('director')
    ? {
        leafField: 'title',
        mainGroupingCriteria: 'director',
      }
    : {};

export default function RowGroupingSortingMultipleGroupingColDef() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        disableRowSelectionOnClick
        defaultGroupingExpansionDepth={-1}
        initialState={initialState}
        rowGroupingColumnMode="multiple"
        groupingColDef={groupingColDef}
      />
    </div>
  );
}
