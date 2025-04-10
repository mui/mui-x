import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { CountryIsoOption } from '../services/static-data';

interface CountryProps {
  value: CountryIsoOption;
}

declare const DISABLE_CHANCE_RANDOM: any;
const useStaticFlag = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;

const laosFlag = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <path fill="#ce1126" d="M0 0h900v600H0z" />
  <path fill="#002868" d="M0 150h900v300H0z" />
  <circle r="120" cy="300" cx="450" fill="#fff" />
</svg>
`;

const staticFlagURI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(laosFlag)}`;

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
        src={
          useStaticFlag ? staticFlagURI : `https://flagcdn.com/w20/${value.code.toLowerCase()}.png`
        }
        srcSet={
          useStaticFlag ? undefined : `https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`
        }
        alt=""
      />

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

  if (params.rowNode.type === 'group') {
    return params.value;
  }

  return <Country value={params.value} />;
}
