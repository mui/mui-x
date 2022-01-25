import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  GridColumns,
  gridColumnVisibilityModelSelector,
  GridEvents,
  GridRowGroupingModel,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const useKeepGroupingColumnsHidden = (
  apiRef: GridApiRef,
  columns: GridColumns,
  initialModel: GridRowGroupingModel,
  leafField?: string,
) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      const columnVisibilityModel = {
        ...gridColumnVisibilityModelSelector(apiRef.current.state),
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

export default function RowGroupingSortingSingleGroupingColDef() {
  const data = useMovieData();
  const [mainGroupingCriteria, setMainGroupingCriteria] =
    React.useState<string>('undefined');

  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <FormControl fullWidth>
        <InputLabel
          htmlFor="main-grouping-criteria"
          id="ain-grouping-criteria-label"
        >
          Main Grouping Criteria
        </InputLabel>
        <Select
          label="Main Grouping Criteria"
          onChange={(e) => setMainGroupingCriteria(e.target.value)}
          value={mainGroupingCriteria}
          id="main-grouping-criteria"
          labelId="main-grouping-criteria-label"
        >
          <MenuItem value="undefined">Default behavior</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="director">Director</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
          disableSelectionOnClick
          defaultGroupingExpansionDepth={-1}
          initialState={{
            rowGrouping: {
              model: INITIAL_GROUPING_COLUMN_MODEL,
            },
          }}
          rowGroupingColumnMode="single"
          groupingColDef={{
            mainGroupingCriteria:
              mainGroupingCriteria === 'undefined'
                ? undefined
                : mainGroupingCriteria,
          }}
          experimentalFeatures={{
            rowGrouping: true,
          }}
        />
      </div>
    </Stack>
  );
}
