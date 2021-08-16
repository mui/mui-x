import * as React from 'react';
import { XGrid, GridOverlay } from '@mui/x-data-grid-pro';
import {
  useDemoData,
  getRealData,
  getCommodityColumns,
} from '@mui/x-data-grid-generator';
import LinearProgress from '@material-ui/core/LinearProgress';

const MAX_ROW_LENGTH = 500;

async function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

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
  const [loadedRows, setLoadedRows] = React.useState<any>([]);
  const mounted = React.useRef(true);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
  });

  const loadServerRows = async (newRowLength) => {
    setLoading(true);
    const newData = await getRealData(newRowLength, getCommodityColumns());
    // Simulate network throttle
    await sleep(Math.random() * 500 + 100);

    if (mounted.current) {
      setLoading(false);
      setLoadedRows(loadedRows.concat(newData.rows));
    }
  };

  const handleOnRowsScrollEnd = (params) => {
    if (loadedRows.length <= MAX_ROW_LENGTH) {
      loadServerRows(params.viewportPageSize);
    }
  };

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        rows={data.rows.concat(loadedRows)}
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
