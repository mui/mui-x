import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingGroupingValueGetter() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columnsWithComposer = React.useMemo(
    () => [
      ...data.columns,
      {
        field: 'composer',
        headerName: 'Composer',
        valueGetter: (value) => value.name,
        groupingValueGetter: (value) => value.name,
        width: 200,
      },
      {
        field: 'decade',
        headerName: 'Decade',
        valueGetter: (value, row) => Math.floor(row.year / 10) * 10,
        groupingValueGetter: (value, row) => Math.floor(row.year / 10) * 10,
        renderCell: (params) => {
          if (params.value == null) {
            return '';
          }

          return `${params.value.toString().slice(-2)}'s`;
        },
      },
    ],
    [data.columns],
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['composer', 'decade'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columnsWithComposer}
        apiRef={apiRef}
        initialState={initialState}
      />
    </div>
  );
}
