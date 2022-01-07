import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined' && isoCode
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

interface CountryProps {
  value: {
    code: string;
    label: string;
  };
}

const Country = React.memo(function Country(props: CountryProps) {
  const { value } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        component="span"
        sx={{
          mr: '4px',
          height: '32px',
          width: '32px',
          fontSize: '28px',
        }}
      >
        {value.code && countryToFlag(value.code)}
      </Box>
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value.label}
      </Box>
    </Box>
  );
});

export function renderCountry(params: GridRenderCellParams) {
  return <Country value={params.value as any} />;
}
