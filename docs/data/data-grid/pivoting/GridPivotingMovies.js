import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
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
      ],
    };
  }, [movieData]);
  const [pivotModel, setPivotModel] = React.useState({
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

  const [isPivotMode, setIsPivotMode] = React.useState(false);
  const [pivotSettingsOpen, setPivotSettingsOpen] = React.useState(true);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 650, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
          pivotMode={isPivotMode}
          onPivotModeChange={setIsPivotMode}
          pivotPanelOpen={pivotSettingsOpen}
          onPivotPanelOpenChange={setPivotSettingsOpen}
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
