import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { CountryIsoOption } from '../services/static-data';

interface CountryProps {
  value: CountryIsoOption;
}

declare const DISABLE_CHANCE_RANDOM: any;
const useStaticFlag = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;

const laosFlagURI =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj48cGF0aCBmaWxsPSIjY2UxMTI2IiBkPSJNMCAwaDkwMHY2MDBIMHoiIC8+PHBhdGggZmlsbD0iIzAwMjg2OCIgZD0iTTAgMTUwaDkwMHYzMDBIMHoiIC8+PGNpcmNsZSByPSIxMjAiIGN5PSIzMDAiIGN4PSI0NTAiIGZpbGw9IiNmZmYiIC8+PC9zdmc+';

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
          useStaticFlag ? laosFlagURI : `https://flagcdn.com/w20/${value.code.toLowerCase()}.png`
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

  return <Country value={params.value} />;
}
