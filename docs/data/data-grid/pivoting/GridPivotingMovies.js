import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const pivotModel = {
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
};

export default function GridPivotingMovies() {
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          initialState={{
            pivoting: {
              enabled: true,
              model: pivotModel,
              panelOpen: false,
            },
          }}
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
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </div>
    </div>
  );
}
