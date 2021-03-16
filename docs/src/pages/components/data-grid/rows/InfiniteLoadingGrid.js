import * as React from 'react';
import { XGrid, GridOverlay } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import LinearProgress from '@material-ui/core/LinearProgress';

const MAX_ROW_LENGTH = 500;

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
  const [loading, setLoading] = React.useState(false);
  const timeout = React.useRef(null);
  const { data, setRowLength } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
  });

  const loadServerRows = (newRowLength) => {
    clearTimeout(timeout.current);
    setLoading(true);

    timeout.current = setTimeout(() => {
      setRowLength(newRowLength);
      setLoading(false);
      // Simulate network throttle
    }, Math.random() * 500 + 100);
  };

  const handleOnRowsScrollEnd = (params) => {
    const newRowLength = params.virtualRowsCount + params.viewportPageSize;

    if (newRowLength <= MAX_ROW_LENGTH) {
      loadServerRows(newRowLength);
    }
  };

  React.useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

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
