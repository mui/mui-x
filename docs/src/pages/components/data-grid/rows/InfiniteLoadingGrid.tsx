import * as React from 'react';
import { XGrid, GridOverlay } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import LinearProgress from '@material-ui/core/LinearProgress';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function InfiniteLoadingGrid() {
  const [rowLengthSize, setRowLengthSize] = React.useState(20);
  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: rowLengthSize,
    maxColumns: 6,
  });

  const handleOnRowsScrollEnd = (params) => {
    const newRowLength = rowLengthSize + params.viewportPageSize;
    setRowLengthSize(newRowLength);
    setRowLength(newRowLength);
    loadNewData();
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        loading={loading}
        hideFooterPagination
        onRowsScrollEnd={handleOnRowsScrollEnd}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
}
