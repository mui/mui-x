import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
  GridPivotModel,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function GridPivotingMovies() {
  const apiRef = useGridApiRef();

  const movieData = useMovieData();
  const data = React.useMemo(() => {
    return {
      ...movieData,
      columns: [
        ...movieData.columns.map((col) => ({ ...col, editable: true })),
        { field: 'imdbRating', headerName: 'Rating', type: 'number' },
      ] as GridColDef[],
    };
  }, [movieData]);
  const [pivotModel, setPivotModel] = React.useState<GridPivotModel>({
    rows: [{ field: 'company' }],
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

  const [isPivotMode, setIsPivotMode] = React.useState(true);
  const [pivotSettingsOpen, setPivotSettingsOpen] = React.useState(false);

  const pivotParams = unstable_useGridPivoting({
    apiRef,
    pivotModel,
    onPivotModelChange: setPivotModel,
    pivotMode: isPivotMode,
    onPivotModeChange: setIsPivotMode,
    pivotSettingsOpen,
    onPivotSettingsOpenChange: setPivotSettingsOpen,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 650, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          pivotParams={pivotParams}
          apiRef={apiRef}
          showToolbar
          columnGroupHeaderHeight={36}
          sx={{
            '& .MuiDataGrid-columnHeader--filledGroup': {
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                overflow: 'visible',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                position: 'sticky',
                left: 8,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
