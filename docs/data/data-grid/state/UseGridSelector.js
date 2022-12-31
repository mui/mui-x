import * as React from 'react';
import {
  DataGrid,
  gridPaginationModelSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';

const PAGE_SIZE = 10;

function Toolbar() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
      color="primary"
      count={pageCount}
      page={paginationModel.page + 1}
      onChange={(event, value) =>
        apiRef.current.setPaginationModel({ page: value - 1, pageSize: PAGE_SIZE })
      }
    />
  );
}

export default function UseGridSelector() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pagination
        hideFooter
        components={{
          Toolbar,
        }}
      />
    </div>
  );
}
