import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

import { useDemoData } from '@mui/x-data-grid-generator';

function AutocompleteColumnInput(props) {
  const { columns, value, onChange, disabled, className } = props;
  const apiRef = useGridApiContext();
  const selectedColumn = columns.find((column) => column.field === value) ?? null;

  return (
    <Autocomplete
      className={className}
      sx={{ width: 200 }}
      size="small"
      disabled={disabled}
      options={columns}
      value={selectedColumn}
      getOptionLabel={(column) => column.headerName || column.field}
      isOptionEqualToValue={(option, selected) => option.field === selected.field}
      onChange={(event, column) => {
        if (column) {
          onChange(column.field);
        }
      }}
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
}
