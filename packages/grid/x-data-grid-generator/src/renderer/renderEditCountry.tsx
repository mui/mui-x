import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { COUNTRY_ISO_OPTIONS } from '../services/static-data';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  [`& .${autocompleteClasses.inputRoot}`]: {
    ...theme.typography.body2,
    padding: '1px 0',
    height: '100%',
    '& input': {
      padding: '0 16px',
      height: '100%',
    },
  },
}));

function EditCountry(props: GridRenderEditCellParams) {
  const { id, value, api, field } = props;

  const handleChange = React.useCallback(
    (event, newValue) => {
      api.setEditCellValue({ id, field, value: newValue }, event);
      if (!event.key) {
        api.commitCellChange({ id, field });
        api.setCellMode(id, field, 'view');
      }
    },
    [api, field, id],
  );

  return (
    <StyledAutocomplete
      value={value as any}
      onChange={handleChange}
      options={COUNTRY_ISO_OPTIONS}
      getOptionLabel={(option: any) => option.label}
      autoHighlight
      fullWidth
      open
      disableClearable
      renderOption={(optionProps, option: any) => (
        <Box
          component="li"
          sx={{
            '& > span': {
              mr: '10px',
              fontSize: '18px',
            },
          }}
          {...optionProps}
        >
          <span>{countryToFlag(option.code)}</span>
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <InputBase
          autoFocus
          fullWidth
          id={params.id}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          {...params.InputProps}
        />
      )}
    />
  );
}

export function renderEditCountry(params: GridRenderEditCellParams) {
  return <EditCountry {...params} />;
}
