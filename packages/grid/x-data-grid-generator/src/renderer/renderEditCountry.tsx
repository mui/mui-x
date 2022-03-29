import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { COUNTRY_ISO_OPTIONS, CountryIsoOption } from '../services/static-data';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  height: '100%',
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

function EditCountry(props: GridRenderEditCellParams<CountryIsoOption>) {
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
      value={value}
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
            '& > img': {
              mr: 1.5,
              flexShrink: 0,
            },
          }}
          {...optionProps}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
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

export function renderEditCountry(params: GridRenderEditCellParams<CountryIsoOption>) {
  return <EditCountry {...params} />;
}
