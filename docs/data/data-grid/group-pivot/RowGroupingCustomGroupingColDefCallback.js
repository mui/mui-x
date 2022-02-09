import * as React from 'react';
import {
  DataGridPro,
  gridColumnVisibilityModelSelector,
  GridEvents,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      const columnVisibilityModel = {
        ...gridColumnVisibilityModelSelector(apiRef),
      };

      newModel.forEach((field) => {
        if (!prevModel.current.includes(field)) {
          columnVisibilityModel[field] = false;
        }
      });
      prevModel.current.forEach((field) => {
        if (!newModel.includes(field)) {
          columnVisibilityModel[field] = true;
        }
      });
      apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      prevModel.current = newModel;
    });
  }, [apiRef]);

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

export default function RowGroupingCustomGroupingColDefCallback() {
  const data = useMovieData();
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = React.useState(
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

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
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
          disableSelectionOnClick
          rowGroupingModel={rowGroupingModel}
          groupingColDef={(params) =>
            params.fields.includes('director')
              ? {
                  headerName: 'Director',
                }
              : {}
          }
          experimentalFeatures={{
            rowGrouping: true,
          }}
        />
      </Box>
    </div>
  );
}
