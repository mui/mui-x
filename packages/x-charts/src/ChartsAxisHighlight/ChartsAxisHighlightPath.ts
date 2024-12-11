'use client';
import { styled } from '@mui/material/styles';
import { ChartsAxisHighlightType } from './ChartsAxisHighlight.types';

export const ChartsAxisHighlightPath = styled('path', {
  name: 'MuiChartsAxisHighlight',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: { axisHighlight: ChartsAxisHighlightType } }>(({ theme }) => ({
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
        strokeDasharray: '5 2',
        stroke: '#ffffff',
        ...theme.applyStyles('light', {
          stroke: '#000000',
        }),
      },
    },
  ],
}));
