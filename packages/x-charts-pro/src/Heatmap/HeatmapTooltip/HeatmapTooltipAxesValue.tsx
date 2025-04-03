'use client';
import { styled } from '@mui/material/styles';

/**
 * @ignore - internal component.
 */
export const HeatmapTooltipAxesValue = styled('caption', {
  name: 'MuiChartsHeatmapTooltip',
  slot: 'AxesValue',
})(({ theme }) => ({
  textAlign: 'start',
  whiteSpace: 'nowrap',
  padding: theme.spacing(0.5, 1.5),
  color: (theme.vars || theme).palette.text.secondary,
  borderBottom: `solid ${(theme.vars || theme).palette.divider} 1px`,
  [`& span`]: {
    marginRight: theme.spacing(1.5),
  },
}));
