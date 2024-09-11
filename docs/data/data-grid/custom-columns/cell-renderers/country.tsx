import * as React from 'react';
import {
  GridRenderCellParams,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export interface CountryIsoOption {
  value: string;
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export const COUNTRY_ISO_OPTIONS: CountryIsoOption[] = [
  { value: 'DE', code: 'DE', label: 'Germany', phone: '49' },
  { value: 'ES', code: 'ES', label: 'Spain', phone: '34' },
  { value: 'FR', code: 'FR', label: 'France', phone: '33' },
  { value: 'GB', code: 'GB', label: 'United Kingdom', phone: '44' },
];

interface CountryProps {
  value: CountryIsoOption;
}

const Country = React.memo(function Country(props: CountryProps) {
  const { value } = props;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '&  > img': {
          mr: 0.5,
          flexShrink: 0,
          width: '20px',
        },
      }}
    >
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/w20/${value.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`}
        alt=""
      />
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value.label}
      </Box>
    </Box>
  );
});

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
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<CountryIsoOption, false, true, false>['onChange']>
  >(
    async (event, newValue) => {
      await apiRef.current.setEditCellValue({ id, field, value: newValue }, event);
      apiRef.current.stopCellEditMode({ id, field });
    },
    [apiRef, field, id],
  );

  return (
    <StyledAutocomplete<CountryIsoOption, false, true, false>
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

export function renderCountry(
  params: GridRenderCellParams<CountryIsoOption, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return <Country value={params.value} />;
}

export function renderEditCountry(
  params: GridRenderEditCellParams<CountryIsoOption>,
) {
  return <EditCountry {...params} />;
}
