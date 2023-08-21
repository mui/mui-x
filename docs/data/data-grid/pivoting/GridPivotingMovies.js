import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
  Unstable_GridPivotModelEditor as GridPivotModelEditor,
} from '@mui/x-data-grid-premium';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function GridPivotingMovies() {
  const apiRef = useGridApiRef();

  const data = useMovieData();
  const [pivotModel, setPivotModel] = React.useState({
    rows: ['company'],
    columns: ['year', 'director'],
    values: [
      { field: 'gross', aggFunc: 'sum' },
      { field: 'imdbRating', aggFunc: 'avg' },
    ],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: data.rows,
    columns: data.columns,
    pivotModel,
  });

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch checked={isPivot} onChange={(e) => setIsPivot(e.target.checked)} />
        }
        label="Pivot"
      />
      {isPivot && (
        <GridPivotModelEditor
          columns={data.columns}
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
        />
      )}

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
