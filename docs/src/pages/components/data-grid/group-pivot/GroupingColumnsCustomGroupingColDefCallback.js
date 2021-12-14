import * as React from 'react';
import { DataGridPro, GridEvents, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(
      GridEvents.groupingColumnsModelChange,
      (newModel) => {
        apiRef.current.updateColumns([
          ...newModel
            .filter((field) => !prevModel.current.includes(field))
            .map((field) => ({ field, hide: true })),
          ...prevModel.current
            .filter((field) => !newModel.includes(field))
            .map((field) => ({ field, hide: false })),
        ]);

        prevModel.current = initialModel;
      },
    );
  }, [apiRef, initialModel]);

  return React.useMemo(
    () =>
      columns.map((colDef) =>
        initialModel.includes(colDef.field) ||
        (leafField && colDef.field === leafField)
          ? { ...colDef, hide: true }
          : colDef,
      ),
    [columns, initialModel, leafField],
  );
};

export default function GroupingColumnsCustomGroupingColDefCallback() {
  const data = useMovieData();
  const apiRef = useGridApiRef();
  const [groupingColumnsModel, setGroupingColumnsModel] = React.useState(
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const groupingColumnsModelStr = groupingColumnsModel.join('-');

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
          onClick={() => setGroupingColumnsModel(['company'])}
          variant="outlined"
          color={groupingColumnsModelStr === 'company' ? 'primary' : undefined}
        />
        <Chip
          label="Group by company and director"
          onClick={() => setGroupingColumnsModel(['company', 'director'])}
          variant="outlined"
          color={
            groupingColumnsModelStr === 'company-director' ? 'primary' : undefined
          }
        />
      </Stack>
      <Box sx={{ height: 400 }}>
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
          disableSelectionOnClick
          groupingColumnsModel={groupingColumnsModel}
          groupingColDef={(params) =>
            params.fields.includes('director')
              ? {
                  headerName: 'Director',
                }
              : {}
          }
          experimentalFeatures={{
            groupingColumns: true,
          }}
        />
      </Box>
    </div>
  );
}
