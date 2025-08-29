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
    () =>
      data.columns.map((column) => {
        if (column.field === 'year') {
          return {
            field: 'year',
            headerName: 'Year',
            type: 'number',
            groupingValueGetter: (value) => {
              const yearDecade = Math.floor(value / 10) * 10;
              return `${yearDecade.toString().slice(-2)}'s`;
            },
            valueFormatter: (value) => (value ? `${value}` : ''),
            availableAggregationFunctions: ['max', 'min'],
          };
        }
        return column;
      }),
    [data.columns],
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['year'],
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
