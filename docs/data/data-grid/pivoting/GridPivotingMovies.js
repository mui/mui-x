import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
} from '@mui/x-data-grid-premium';
import { unstable_useId as useId } from '@mui/utils';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function GridPivotingMovies() {
  const apiRef = useGridApiRef();

  const data = useMovieData();

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: data.rows,
    columns: data.columns,
    pivotModel: {
      rows: ['company'],
      columns: ['year'],
      values: [
        { field: 'gross', aggFunc: 'sum' },
        { field: 'rating', aggFunc: 'avg' },
      ],
    },
  });

  const inputId = useId();

  return (
    <div style={{ width: '100%' }}>
      <input
        id={inputId}
        type="checkbox"
        checked={isPivot}
        onChange={(e) => setIsPivot(e.target.checked)}
      />
      <label htmlFor={inputId}>Pivot</label>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          key={isPivot.toString()}
          {...props}
          apiRef={apiRef}
          experimentalFeatures={{ columnGrouping: true }}
        />
      </div>
    </div>
  );
}
