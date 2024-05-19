import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsResponse,
} from '@mui/x-data-grid-pro';
import CircularProgress from '@mui/material/CircularProgress';
import { lighten, darken, alpha, styled, Theme } from '@mui/material/styles';
import { useDemoDataSource } from '@mui/x-data-grid-generator';

function getBorderColor(theme: Theme) {
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

function getBorderRadius(theme: Theme) {
  const radius = theme.shape.borderRadius;
  return typeof radius === 'number' ? `${radius}px` : radius;
}

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

const dataSource: GridDataSource = {
  getRows: async (params) => {
    const urlParams = new URLSearchParams({
      paginationModel: encodeURIComponent(JSON.stringify(params.paginationModel)),
      filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
      sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
      groupKeys: encodeURIComponent(JSON.stringify(params.groupKeys)),
    });
    const serverResponse = await fetch(
      `https://mui.com/x/api/x-grid?${urlParams.toString()}`,
    );
    const getRowsResponse = (await serverResponse.json()) as GridGetRowsResponse;
    return {
      rows: getRowsResponse.rows,
      rowCount: getRowsResponse.rowCount,
    };
  },
};

const Div = styled('div')(({ theme }) => ({
  height: 400,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${getBorderColor(theme)}`,
  borderRadius: getBorderRadius(theme),
}));

function LoadingSlate() {
  return (
    <Div>
      <CircularProgress />
    </Div>
  );
}

function ServerSideDataGrid() {
  const {
    loading: serverConfiguring,
    columns,
    initialState,
  } = useDemoDataSource(dataSetOptions, serverOptions);

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  if (serverConfiguring) {
    return <LoadingSlate />;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default ServerSideDataGrid;
