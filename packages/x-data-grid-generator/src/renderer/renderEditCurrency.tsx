'use client';
import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { CURRENCY_OPTIONS } from '../services/static-data';
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

function EditCurrency(props: GridRenderEditCellParams<any, string>) {
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

  const handleChange = createAutocompleteChangeHandler<string>((val) => val.toUpperCase());

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={handleAutocompleteWrapperKeyDown} style={{ height: '100%', width: '100%' }}>
      <StyledAutocomplete<string, false, true, false>
        value={value}
        onChange={handleChange}
        options={CURRENCY_OPTIONS}
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

export function renderEditCurrency(params: GridRenderEditCellParams<any, string>) {
  return <EditCurrency {...params} />;
}
