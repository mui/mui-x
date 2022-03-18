import * as React from 'react';
import {
  DataGridPro,
  gridPageSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';

const Toolbar = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
};

export default function UseGridSelector() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        pagination
        pageSize={10}
        hideFooter
        components={{
          Toolbar,
        }}
      />
    </div>
  );
}
