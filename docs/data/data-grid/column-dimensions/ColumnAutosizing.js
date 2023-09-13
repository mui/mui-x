import * as React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
  Stack,
  TextField,
} from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro, DEFAULT_GRID_AUTOSIZE_OPTIONS } from '@mui/x-data-grid-pro';
import { randomRating, randomTraderName } from '@mui/x-data-grid-generator';

function renderRating(params) {
  return <Rating readOnly value={params.value} />;
}

function useData(length) {
  return React.useMemo(() => {
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

    const columns = [
      { field: 'id', headerName: 'Brand ID' },
      { field: 'brand', headerName: 'Brand name' },
      { field: 'rep', headerName: 'Representative' },
      { field: 'rating', headerName: 'Rating', renderCell: renderRating },
    ];

    return { rows, columns };
  }, []);
}

export default function ColumnAutosizing() {
  const apiRef = useGridApiRef();
  const data = useData(100);

  const [includeHeaders, setIncludeHeaders] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders,
  );
  const [excludeOutliers, setExcludeOutliers] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.excludeOutliers,
  );
  const [outliersFactor, setOutliersFactor] = React.useState(
    String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor),
  );
  const [expand, setExpand] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);

  return (
    <div style={{ width: '100%' }}>
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{ marginBottom: '1em' }}
      >
        <div>
          <Button
            variant="outlined"
            onClick={() =>
              apiRef.current.autosizeColumns({
                includeHeaders,
                excludeOutliers,
                outliersFactor: Number.isNaN(parseFloat(outliersFactor))
                  ? 1
                  : parseFloat(outliersFactor),
                expand,
              })
            }
          >
            Autosize columns
          </Button>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeHeaders}
              onChange={(ev) => setIncludeHeaders(ev.target.checked)}
            />
          }
          label="Include headers"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={excludeOutliers}
              onChange={(ev) => setExcludeOutliers(ev.target.checked)}
            />
          }
          label="Exclude outliers"
        />
        <TextField
          label="Outliers factor"
          value={outliersFactor}
          onChange={(ev) => setOutliersFactor(ev.target.value)}
          sx={{ width: '12ch' }}
        />
        <FormControlLabel
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
        <DataGridPro apiRef={apiRef} density="compact" {...data} />
      </div>
    </div>
  );
}
