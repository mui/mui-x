import * as React from 'react';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

function customCheckbox(theme) {
  return {
    '& .MuiCheckbox-root svg': {
      width: 16,
      height: 16,
      backgroundColor: 'transparent',
      border: '1px solid #d9d9d9',
      borderRadius: 2,
      ...theme.applyStyles('dark', {
        borderColor: 'rgb(67, 67, 67)',
      }),
    },
    '& .MuiCheckbox-root svg path': {
      display: 'none',
    },
    '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
    },
    '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
      position: 'absolute',
      display: 'table',
      border: '2px solid #fff',
      borderTop: 0,
      borderLeft: 0,
      transform: 'rotate(45deg) translate(-50%,-50%)',
      opacity: 1,
      transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
      content: '""',
      top: '50%',
      left: '39%',
      width: 5.71428571,
      height: 9.14285714,
    },
    '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
      width: 8,
      height: 8,
      backgroundColor: '#1890ff',
      transform: 'none',
      top: '39%',
      border: 0,
    },
  };
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color: 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: '#1d1d1d',
    ...theme.applyStyles('light', {
      backgroundColor: '#fafafa',
    }),
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderRightColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderBottomColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.65)',
    ...theme.applyStyles('light', {
      color: 'rgba(0,0,0,.85)',
    }),
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
  ...customCheckbox(theme),
  ...theme.applyStyles('light', {
    color: 'rgba(0,0,0,.85)',
  }),
}));

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const PAGE_SIZE = 5;

export default function AntDesignGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StyledDataGrid
        checkboxSelection
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[PAGE_SIZE]}
        slots={{
          pagination: CustomPagination,
        }}
        {...data}
      />
    </div>
  );
}
