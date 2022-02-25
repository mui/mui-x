import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import clsx from 'clsx';

export default function RowMarginGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    maxColumns: 6,
  });

  const getRowSpacing = React.useCallback((params) => {
    return {
      top: params.isFirstVisible ? 0 : 5,
      bottom: params.isLastVisible ? 0 : 5,
    };
  }, []);

  const getRowClassName = React.useCallback((params) => {
    return clsx({
      first: params.isFirstVisible,
      last: params.isLastVisible,
    });
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        getRowSpacing={getRowSpacing}
        getRowClassName={getRowClassName}
        sx={{
          '& .MuiDataGrid-virtualScrollerRenderZone': {
            display: 'flex', // Prevents margin collapsing
            flexDirection: 'column',
          },
          '& .MuiDataGrid-row': {
            mt: '5px',
            mb: '5px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#efefef'),
            '&.first': {
              mt: 0,
            },
            '&.last': {
              mb: 0,
            },
          },
        }}
      />
    </div>
  );
}
