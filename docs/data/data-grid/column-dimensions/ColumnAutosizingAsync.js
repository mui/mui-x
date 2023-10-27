import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro, DEFAULT_GRID_AUTOSIZE_OPTIONS } from '@mui/x-data-grid-pro';
import { randomRating, randomTraderName } from '@mui/x-data-grid-generator';
import * as ReactDOM from 'react-dom';

const columns = [
  { field: 'id', headerName: 'Brand ID' },
  { field: 'brand', headerName: 'Brand name' },
  { field: 'rep', headerName: 'Representative' },
  { field: 'rating', headerName: 'Rating', renderCell: renderRating },
];

function renderRating(params) {
  return <Rating readOnly value={params.value} />;
}

function getFakeData(length) {
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
        brand: names[id % names.length],
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

  const [includeHeaders, setIncludeHeaders] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders,
  );
  const [includeOutliers, setExcludeOutliers] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeOutliers,
  );
  const [outliersFactor, setOutliersFactor] = React.useState(
    String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor),
  );
  const [expand, setExpand] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);

  const autosizeOptions = React.useMemo(
    () => ({
      includeHeaders,
      includeOutliers,
      outliersFactor: Number.isNaN(parseFloat(outliersFactor))
        ? 1
        : parseFloat(outliersFactor),
      expand,
    }),
    [expand, includeHeaders, includeOutliers, outliersFactor],
  );

  const fetchData = React.useCallback(() => {
    setIsLoading(true);
    getFakeData(100)
      .then((data) => {
        return ReactDOM.flushSync(() => {
          setIsLoading(false);
          apiRef.current.updateRows(data.rows);
        });
      })
      .then(() => apiRef.current.autosizeColumns(autosizeOptions));
  }, [apiRef, autosizeOptions]);

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
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={includeHeaders}
              onChange={(ev) => setIncludeHeaders(ev.target.checked)}
            />
          }
          label="Include headers"
        />
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={includeOutliers}
              onChange={(event) => setExcludeOutliers(event.target.checked)}
            />
          }
          label="Include outliers"
        />
        <TextField
          size="small"
          label="Outliers factor"
          value={outliersFactor}
          onChange={(ev) => setOutliersFactor(ev.target.value)}
          sx={{ width: '12ch' }}
        />
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={expand}
              onChange={(ev) => setExpand(ev.target.checked)}
            />
          }
          label="Expand"
        />
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          apiRef={apiRef}
          density="compact"
          columns={columns}
          rows={rows}
          loading={isLoading}
          autosizeOptions={autosizeOptions}
        />
      </div>
    </div>
  );
}
