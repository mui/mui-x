import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import Rating from '@mui/material/Rating';

interface RatingValueProps {
  value: number;
}

const RatingValue = React.memo(function RatingValue(props: RatingValueProps) {
  const { value } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: 'text.secondary',
      }}
    >
      <Rating value={value} sx={{ mr: 1 }} readOnly /> {Math.round(Number(value) * 10) / 10}
    </Box>
  );
});

export function renderRating(params: GridRenderCellParams<any, number, any>) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }

  return <RatingValue value={params.value} />;
}
