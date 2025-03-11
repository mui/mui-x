import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { CountryIsoOption } from '../services/static-data';

interface CountryProps {
  value: CountryIsoOption;
}

// Used to avoid the flagcdn.com rate limit in CI
function LaosFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 600 900">
      <path fill="#ce1126" d="M0 0h600v400H0z" />
      <path fill="#002868" d="M0 100h600v200H0z" />
      <circle r="80" cy="200" cx="300" fill="#fff" />
    </svg>
  );
}

declare const DISABLE_CHANCE_RANDOM: any;
const useSvgFlag = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;

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
      {useSvgFlag ? (
        <LaosFlag />
      ) : (
        <img
          loading="lazy"
          width="20"
          src={`https://flagcdn.com/w20/${value.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`}
          alt=""
        />
      )}
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value.label}
      </Box>
    </Box>
  );
});

export function renderCountry(params: GridRenderCellParams<CountryIsoOption, any, any>) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }

  return <Country value={params.value} />;
}
