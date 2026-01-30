'use client';
import {
  // This is coming from x-charts but would be in this package for simplicity
  ChartsTooltip as MaterialChartsTooltip,
  type ChartsTooltipProps,
} from '@mui/x-charts/ChartsTooltip';

function ChartsTooltip(props: ChartsTooltipProps) {
  return <MaterialChartsTooltip {...props} />;
}

export { ChartsTooltip };
