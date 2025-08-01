import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData, Movie } from '@mui/x-data-grid-generator';

export default function RowGroupingGroupingValueSetter() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columnsWithComposer = React.useMemo(
    () => [
      ...data.columns,
      {
        field: 'composer',
        headerName: 'Composer',
        valueGetter: (value: { name: string }) => value.name,
        groupingValueGetter: (value: { name: string }) => value.name,
        groupingValueSetter: (value, row) => {
          return {
            ...row,
            composer: { name: value },
          };
        },
        width: 200,
      } as GridColDef<Movie, string>,
      {
        field: 'decade',
        headerName: 'Decade',
        valueGetter: (value, row) => Math.floor(row.year / 10) * 10,
        groupingValueGetter: (value, row) => Math.floor(row.year / 10) * 10,
        groupingValueSetter: (value, row) => ({
          ...row,
          // Since converting to decade is a lossy operation, directly using the decade value should be sufficient here
          year: value,
        }),
        renderCell: (params) => {
          if (params.value == null) {
            return '';
          }

          return `${params.value.toString().slice(-2)}'s`;
        },
      } as GridColDef<Movie, number>,
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
        rowReordering
      />
    </div>
  );
}
