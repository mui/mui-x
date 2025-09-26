import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const countries = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'China',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Italy',
  'Japan',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Poland',
  'Portugal',
  'Russia',
  'South Africa',
  'South Korea',
  'Spain',
  'Switzerland',
  'United Kingdom',
  'United States',
];

function AutocompleteEditCell(props: GridRenderEditCellParams) {
  const { id, field, value, error } = props;
  const apiRef = useGridApiContext();

  const handleChange: NonNullable<
    AutocompleteProps<any, any, any, any>['onChange']
  > = React.useCallback(
    async (_: React.SyntheticEvent, newValue, reason) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue,
      });

      if (reason !== 'clear') {
        // stop editing mode for actions other than clearing the value
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

const rows = [
  { id: 1, country: countries[0] },
  { id: 2, country: countries[1] },
  { id: 3, country: countries[2] },
  { id: 4, country: countries[3] },
  { id: 5, country: countries[4] },
];

const columns: GridColDef[] = [
  {
    field: 'country',
    headerName: 'Country',
    width: 200,
    editable: true,
    renderEditCell: (params) => <AutocompleteEditCell {...params} />,
  },
];

export default function AutocompleteEditing() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
