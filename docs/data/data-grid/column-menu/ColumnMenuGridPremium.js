import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef = {
  leafField: 'title',
};

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
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        groupingColDef={groupingColDef}
        initialState={initialState}
      />
    </div>
  );
}
