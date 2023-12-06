import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  DataGridPro,
  gridFilterModelSelector,
  useGridSelector,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const getDefaultFilter = (field) => ({ field, operator: 'is' });

function AdminFilter(props) {
  const { colDef } = props;
  const apiRef = useGridApiContext();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const currentFieldFilters = React.useMemo(
    () => filterModel.items?.filter(({ field }) => field === colDef.field),
    [colDef.field, filterModel.items],
  );

  const handleChange = React.useCallback(
    (event) => {
      if (!event.target.value) {
        if (currentFieldFilters[0]) {
          apiRef.current.deleteFilterItem(currentFieldFilters[0]);
        }
        return;
      }
      apiRef.current.upsertFilterItem({
        ...(currentFieldFilters[0] || getDefaultFilter(colDef.field)),
        value: event.target.value,
      });
    },
    [apiRef, colDef.field, currentFieldFilters],
  );

  const value = currentFieldFilters[0]?.value ?? '';
  const label = !value ? 'Filter' : 'Is admin';

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
      <InputLabel id="select-is-admin-label">{label}</InputLabel>
      <Select
        labelId="select-is-admin-label"
        id="select-is-admin"
        value={value}
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function CustomHeaderFilterSingleDataGridPro() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: ['name', 'website', 'phone', 'isAdmin', 'salary'],
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'isAdmin') {
          return {
            ...colDef,
            width: 200,
            renderHeaderFilter: (params) => <AdminFilter {...params} />,
          };
        }
        if (colDef.field === 'phone') {
          // no header filter for `phone` field
          return { ...colDef, renderHeaderFilter: () => null };
        }
        return colDef;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} columns={columns} disableColumnFilter headerFilters />
    </div>
  );
}
