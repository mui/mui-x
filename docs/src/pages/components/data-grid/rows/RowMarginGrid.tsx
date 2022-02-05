import * as React from 'react';
import {
  DataGrid,
  GridRowSpacingParams,
  GridRowClassNameParams,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import clsx from 'clsx';

export default function RowMarginGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    maxColumns: 6,
  });

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 5,
      bottom: params.isLastVisible ? 0 : 5,
    };
  }, []);

  const getRowClassName = React.useCallback((params: GridRowClassNameParams) => {
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
            bgcolor: '#efefef',
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
