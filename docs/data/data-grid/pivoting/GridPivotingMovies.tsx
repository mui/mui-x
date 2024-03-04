import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
  Unstable_GridPivotModel as PivotModel,
  GridColDef,
  GridToolbar,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function GridPivotingMovies() {
  const apiRef = useGridApiRef();

  const movieData = useMovieData();
  const data = React.useMemo(() => {
    return {
      ...movieData,
      columns: [
        ...movieData.columns,
        { field: 'imdbRating', headerName: 'Rating', type: 'number' },
      ] as GridColDef[],
    };
  }, [movieData]);
  const [pivotModel, setPivotModel] = React.useState<PivotModel>({
    rows: ['company'],
    columns: [
      { field: 'year', sort: 'desc' },
      { field: 'cinematicUniverse', sort: 'asc' },
      { field: 'director', sort: 'asc' },
    ],
    values: [
      { field: 'gross', aggFunc: 'sum' },
      { field: 'imdbRating', aggFunc: 'avg' },
    ],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: data.rows,
    columns: data.columns,
    pivotModel,
    apiRef,
    initialIsPivot: true,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: isPivot ? undefined : 400, width: '100%' }}>
        <DataGridPremium
          key={isPivot.toString()}
          {...props}
          apiRef={apiRef}
          autoHeight={isPivot}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            pivotPanel: {
              pivotModel,
              initialColumns: data.columns,
              onPivotModelChange: setPivotModel,
              pivotMode: isPivot,
              onPivotModeChange: setIsPivot,
            },
          }}
        />
      </div>
    </div>
  );
}
