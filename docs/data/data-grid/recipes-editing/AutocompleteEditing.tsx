import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import Autocomplete, { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const countries = [
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'Argentina',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Poland',
  'Russia',
  'China',
  'Japan',
  'South Korea',
  'India',
  'Australia',
  'New Zealand',
  'South Africa',
  'Egypt',
];

function AutocompleteEditCell(props: GridRenderEditCellParams) {
  const { id, field, value, error } = props;
  const apiRef = useGridApiContext();

  const handleChange = React.useCallback(
    async (
      _: React.SyntheticEvent,
      newValue: string,
      reason: AutocompleteChangeReason,
    ) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue,
      });

      if (reason !== 'clear') {
        apiRef.current.stopCellEditMode({ id, field });
      }
    },
    [id, field, apiRef],
  );

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      options={countries}
      openOnFocus
      fullWidth
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          // Prevent closing edit mode prematurely
          event.stopPropagation();
        }
        if (event.key === 'Escape') {
          apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          slotProps={{
            input: {
              ...params.InputProps,
              autoFocus: true,
            },
          }}
        />
      )}
      sx={{
        fontSize: 'inherit',
        '& .MuiFormControl-root': {
          height: '100%',
        },
        '& .MuiOutlinedInput-root': {
          fontSize: 'inherit',
          paddingLeft: '9px',
          paddingTop: 0,
          paddingBottom: '1px', // to account for the editing cell 1px
        },
        '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
          paddingLeft: 0,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          display: 'none',
        },
      }}
      slotProps={{
        listbox: {
          sx: {
            fontSize: '0.875rem',
          },
        },
      }}
    />
  );
}

const initialRows = [
  { id: 1, country: countries[0] },
  { id: 2, country: countries[1] },
  { id: 3, country: countries[2] },
  { id: 4, country: countries[3] },
  { id: 5, country: countries[4] },
];

export default function AutocompleteEditing() {
  const [rows, setRows] = React.useState(initialRows);

  const columns: GridColDef[] = [
    {
      field: 'country',
      headerName: 'Country',
      width: 200,
      editable: true,
      renderEditCell: (params) => <AutocompleteEditCell {...params} />,
    },
  ];

  const processRowUpdate = React.useCallback((newRow: any) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
    );
    return newRow;
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} processRowUpdate={processRowUpdate} />
    </Box>
  );
}
