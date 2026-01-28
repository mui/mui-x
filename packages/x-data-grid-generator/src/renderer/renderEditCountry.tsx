'use client';
import * as React from 'react';
import type { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { COUNTRY_ISO_OPTIONS, type CountryIsoOption } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';

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

function EditCountry(props: GridRenderEditCellParams<CountryIsoOption>) {
  const { id, value, field, hasFocus } = props;

  const {
    open,
    setOpen,
    inputRef,
    shouldAutoOpen,
    handleAutocompleteInputKeyDown,
    handleAutocompleteWrapperKeyDown,
    createAutocompleteChangeHandler,
  } = useEditDropdownState({ id, field, hasFocus });

  const handleChange = createAutocompleteChangeHandler<CountryIsoOption>();

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={handleAutocompleteWrapperKeyDown} style={{ height: '100%', width: '100%' }}>
      <StyledAutocomplete<CountryIsoOption, false, true, false>
        value={value}
        onChange={handleChange}
        options={COUNTRY_ISO_OPTIONS}
        getOptionLabel={(option: any) => option.label}
        autoHighlight
        fullWidth
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
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
            key={option.code}
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
            autoFocus={shouldAutoOpen}
            fullWidth
            id={params.id}
            inputRef={inputRef}
            onKeyDown={handleAutocompleteInputKeyDown}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
            {...params.InputProps}
          />
        )}
      />
    </div>
  );
}

export function renderEditCountry(params: GridRenderEditCellParams<CountryIsoOption>) {
  return <EditCountry {...params} />;
}
