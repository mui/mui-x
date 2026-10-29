import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import type { GridFilterFormColumnInputProps } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function AutocompleteColumnInput(props: GridFilterFormColumnInputProps) {
  const { columns, value, onChange, disabled, className } = props;
  const apiRef = useGridApiContext();
  const selectedColumn =
    columns.find((column) => column.field === value) ?? columns[0];

  return (
    <Autocomplete
      disableClearable
      className={className}
      sx={{ width: 200 }}
      size="small"
      disabled={disabled}
      options={columns}
      value={selectedColumn}
      getOptionLabel={(column) => column.headerName || column.field}
      isOptionEqualToValue={(option, selected) => option.field === selected.field}
      onChange={(event, column) => onChange(column.field)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelColumn')}
        />
      )}
    />
  );
}

export default function CustomFilterColumnInput() {
  // @focus-start @padding 1
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        slots={{ filterFormColumnInput: AutocompleteColumnInput }}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [{ field: 'commodity', operator: 'contains', value: 'rice' }],
            },
          },
        }}
      />
    </div>
  );
  // @focus-end
}
