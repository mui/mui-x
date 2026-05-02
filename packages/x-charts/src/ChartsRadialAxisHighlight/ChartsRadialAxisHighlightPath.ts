'use client';
import { styled } from '@mui/material/styles';

export type ChartsRadialAxisHighlightPathType = 'line' | 'band';

export const ChartsRadialAxisHighlightPath = styled('path', {
  name: 'MuiChartsRadialAxisHighlight',
  slot: 'Root',
})<{ ownerState: { axisHighlight: ChartsRadialAxisHighlightPathType } }>(({ theme }) => ({
  pointerEvents: 'none',
  variants: [
    {
      props: {
        axisHighlight: 'band',
      },
      style: {
        fill: 'white',
        fillOpacity: 0.1,
        ...theme.applyStyles('light', {
          fill: 'gray',
        }),
      },
    },
    {
      props: {
        axisHighlight: 'line',
      },
      style: {
        fill: 'none',
        strokeDasharray: '5 2',
        stroke: '#ffffff',
        ...theme.applyStyles('light', {
          stroke: '#000000',
        }),
      },
    },
  ],
}));

export const ChartsRadialAxisHighlightCircle = styled('circle', {
  name: 'MuiChartsRadialAxisHighlight',
  slot: 'Root',
})<{ ownerState: { axisHighlight: ChartsRadialAxisHighlightPathType } }>(({ theme }) => ({
  pointerEvents: 'none',
  variants: [
    {
      props: {
        axisHighlight: 'band',
      },
      style: {
        fill: 'white',
        fillOpacity: 0.1,
        ...theme.applyStyles('light', {
          fill: 'gray',
        }),
      },
    },
    {
      props: {
        axisHighlight: 'line',
      },
      style: {
        fill: 'none',
        strokeDasharray: '5 2',
        stroke: '#ffffff',
        ...theme.applyStyles('light', {
          stroke: '#000000',
        }),
      },
    },
  ],
}));
