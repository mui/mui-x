import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';

export function CustomItemTooltip() {
  const tooltipData = useItemTooltip();

  if (!tooltipData) {
    // No data to display
    return null;
  }

  return (
    <ChartsTooltipContainer trigger="item">
      <Paper
        elevation={0}
        sx={{
          m: 1,
          p: 1.5,
          border: 'solid',
          borderWidth: 2,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center">
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: tooltipData.color,
            }}
          />
          <Typography sx={{ ml: 2 }} fontWeight="light">
            {tooltipData.label}
          </Typography>
          <Typography sx={{ ml: 2 }}>{tooltipData.formattedValue}</Typography>
        </Stack>
      </Paper>
    </ChartsTooltipContainer>
  );
}
