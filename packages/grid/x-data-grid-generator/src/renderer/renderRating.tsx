import * as React from 'react';
import Box from '@mui/material/Box';
import { GridCellParams } from '@mui/x-data-grid-pro';
import Rating from '@mui/material/Rating';

interface RatingValueProps {
  name: string;
  value: number;
}

const RatingValue = React.memo(function RatingValue(props: RatingValueProps) {
  const { name, value } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: 'text.secondary',
      }}
    >
      <Rating name={name} value={value} sx={{ mr: 1 }} readOnly />{' '}
      {Math.round(Number(value) * 10) / 10}
    </Box>
  );
});

export function renderRating(params: GridCellParams) {
  return <RatingValue value={Number(params.value)} name={params.row.id.toString()} />;
}
