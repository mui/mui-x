import * as React from 'react';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomInt,
  randomRating,
  randomTraderName,
} from '@mui/x-data-grid-generator';
import * as ReactDOM from 'react-dom';
import { GridData } from 'docsx/data/data-grid/virtualization/ColumnVirtualizationGrid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Brand ID' },
  { field: 'brand', headerName: 'Brand name' },
  { field: 'rep', headerName: 'Representative' },
  {
    field: 'rating',
    headerName: 'Rating',
    renderCell: renderRating,
    display: 'flex',
  },
];

function renderRating(params: any) {
  return <Rating readOnly value={params.value} />;
}

function getFakeData(length: number): Promise<{ rows: GridData['rows'] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const names = [
        'Nike',
        'Adidas',
        'Puma',
        'Reebok',
        'Fila',
        'Lululemon Athletica Clothing',
        'Varley',
      ];
      const rows = Array.from({ length }).map((_, id) => ({
        id,
        brand: names[randomInt(0, names.length - 1)],
        rep: randomTraderName(),
        rating: randomRating(),
      }));

      resolve({ rows });
    }, 1000);
  });
}

export default function ColumnAutosizingAsync() {
  const apiRef = useGridApiRef();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rows] = React.useState([]);

  const fetchData = React.useCallback(() => {
    setIsLoading(true);
    getFakeData(100)
      .then((data) => {
        ReactDOM.flushSync(() => {
          setIsLoading(false);
          apiRef.current.updateRows(data.rows);
        });
      })
      // `sleep`/`setTimeout` is required because `.updateRows` is an
      // async function throttled to avoid choking on frequent changes.
      .then(() => sleep(0))
      .then(() =>
        apiRef.current.autosizeColumns({
          includeHeaders: true,
          includeOutliers: true,
        }),
      );
  }, [apiRef]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ width: '100%' }}>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ mb: 1 }}
        useFlexGap
        flexWrap="wrap"
      >
        <Button variant="outlined" onClick={fetchData}>
          Refetch data
        </Button>
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          apiRef={apiRef}
          density="compact"
          columns={columns}
          rows={rows}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
