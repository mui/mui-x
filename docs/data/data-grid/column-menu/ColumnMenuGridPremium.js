import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function ColumnMenuGridPremium() {
  const apiRef = useGridApiRef();
  const data = useMovieData();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      aggregation: {
        model: {
          gross: 'avg',
        },
      },
      columns: {
        columnVisibilityModel: {
          cinematicUniverse: false,
          title: false,
        },
      },
      rowGrouping: {
        model: ['company'],
      },
      sorting: {
        sortModel: [{ field: 'year', sort: 'desc' }],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        groupingColDef={{
          leafField: 'title',
        }}
        initialState={initialState}
      />
    </div>
  );
}
