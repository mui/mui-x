import * as React from 'react';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-premium';
import Autocomplete, { autocompleteClasses, AutocompleteProps } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { CURRENCY_OPTIONS } from '../services/static-data';

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
})) as typeof Autocomplete;

function EditCurrency(props: GridRenderEditCellParams<any, string>) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<string, false, true, false>['onChange']>
  >(
    async (event, newValue) => {
      await apiRef.current.setEditCellValue({ id, field, value: newValue.toUpperCase() }, event);
      apiRef.current.stopCellEditMode({ id, field });
    },
    [apiRef, field, id],
  );

  return (
    <StyledAutocomplete<string, false, true, false>
      value={value}
      onChange={handleChange}
      options={CURRENCY_OPTIONS}
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
            src={`https://flagcdn.com/w20/${option.slice(0, -1).toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.slice(0, -1).toLowerCase()}.png 2x`}
            alt=""
          />
          {option}
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

export function renderEditCurrency(params: GridRenderEditCellParams<any, string>) {
  return <EditCurrency {...params} />;
}
