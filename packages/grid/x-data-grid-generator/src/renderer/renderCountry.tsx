import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';

interface CountryProps {
  value: {
    code: string;
    label: string;
  };
}

const Country = React.memo(function Country(props: CountryProps) {
  const { value } = props;

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        alignItems: 'center',
        '&  > img': {
          mr: '4px',
          width: '20px',
        },
      }}
    >
      <img
        loading="lazy"
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

export function renderCountry(params: GridRenderCellParams) {
  if (params.rowNode.isAutoGenerated) {
    return '';
  }

  return <Country value={params.value as any} />;
}
