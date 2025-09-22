import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingGroupingValueSetter() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columnsWithComposer = React.useMemo(
    () => [
      ...data.columns,
      {
        field: 'composer',
        headerName: 'Composer',
        valueGetter: (value) => value?.name,
        groupingValueSetter: (value, row) => {
          return {
            ...row,
            composer: {
              ...row.composer,
              name: value,
            },
          };
        },
        width: 200,
      },
      {
        field: 'decade',
        headerName: 'Decade',
        valueGetter: (_, row) => (row.year ? Math.floor(row.year / 10) * 10 : null),
        groupingValueSetter: (value, row) => ({
          ...row,
          // Since converting to decade is a lossy operation, directly using the decade value should be sufficient here
          year: value,
        }),
        valueFormatter: (value) => (value ? `${value.toString().slice(-2)}'s` : ''),
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
        rowReordering
      />
    </div>
  );
}
