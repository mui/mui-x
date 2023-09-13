import * as React from 'react';
import { Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import {
  DataGridPro,
  GridApiPro,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnAutosizing() {
  const apiRef = useGridApiRef<GridApiPro>();

  const { data: originalData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });

  const data = { ...originalData };
  const outlierIndex = data.rows.findIndex(
    (row) => row.commodity === 'Frozen Concentrated Orange Juice',
  );
  if (outlierIndex !== 0 && outlierIndex !== -1) {
    const rows = data.rows.slice();
    const row = rows[0];
    rows[0] = rows[outlierIndex];
    rows[outlierIndex] = row;
    data.rows = rows;
  }

  const [includeHeaders, setIncludeHeaders] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders,
  );
  const [excludeOutliers, setExcludeOutliers] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.excludeOutliers,
  );
  const [outliersFactor, setOutliersFactor] = React.useState(
    String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor),
  );

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
                columns: data.columns.slice(1, 2),
                includeHeaders,
                excludeOutliers,
                outliersFactor: Number.isNaN(parseFloat(outliersFactor))
                  ? 1
                  : parseFloat(outliersFactor),
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
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro apiRef={apiRef} density="compact" {...data} />
      </div>
    </div>
  );
}
