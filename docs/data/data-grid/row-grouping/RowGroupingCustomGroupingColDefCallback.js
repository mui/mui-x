import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

export default function RowGroupingCustomGroupingColDefCallback() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const [rowGroupingModel, setRowGroupingModel] = React.useState([
    'company',
    'director',
  ]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    rowGroupingModel,
  });

  const rowGroupingModelStr = rowGroupingModel.join('-');

  return (
    <div style={{ width: '100%' }}>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
        <Chip
          label="Group by company"
          onClick={() => setRowGroupingModel(['company'])}
          variant="outlined"
          color={rowGroupingModelStr === 'company' ? 'primary' : undefined}
        />
        <Chip
          label="Group by company and director"
          onClick={() => setRowGroupingModel(['company', 'director'])}
          variant="outlined"
          color={rowGroupingModelStr === 'company-director' ? 'primary' : undefined}
        />
      </Stack>
      <Box sx={{ height: 400 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableRowSelectionOnClick
          rowGroupingModel={rowGroupingModel}
          initialState={initialState}
          groupingColDef={(params) => {
            const override = {};
            if (params.fields.includes('director')) {
              return {
                headerName: 'Director',
                valueFormatter: (value, row) => {
                  const rowId = apiRef.current.getRowId(row);
                  const rowNode = apiRef.current.getRowNode(rowId);
                  if (
                    rowNode?.type === 'group' &&
                    rowNode?.groupingField === 'director'
                  ) {
                    return `by ${rowNode.groupingKey ?? ''}`;
                  }
                  return undefined;
                },
              };
            }

            return override;
          }}
        />
      </Box>
    </div>
  );
}
