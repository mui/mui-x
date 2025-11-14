import { styled } from '@mui/material';

export const FakeCss = styled('div')(({ theme }) => ({
  '& .ChartsSurface-root': {
    height: 'var(--chart-surface-height, 100%)',
    width: 'var(--chart-surface-width, 100%)',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    /* This prevents default touch actions when using the svg on mobile devices.
       For example, prevent page scroll & zoom. */
    touchAction: 'pan-y',
    userSelect: 'none',
    gridArea: 'chart',
  },

  '& .ChartsSurface-root:focus': {
    outline: 'none', // By default don't show focus on the SVG container
  },

  '& .ChartsSurface-root:focus-visible': {
    /* Show focus outline on the SVG container only when using keyboard navigation */
    outline: 'var(--mui-palette-text-primary) solid 2px',
  },

  "& .ChartsSurface-root:focus-visible[data-has-focused-item='true']": {
    /* But not if the chart has a focused children item */
    outline: 'none',
  },

  "& .ChartsSurface-root [data-focused='true']": {
    outline: 'var(--mui-palette-text-primary) solid 2px',
  },

  // @media doesn't work
  '@media (prefers-color-scheme: dark)': {},

  '--Primary-color': 'orange',

  '--PieChart-arc-stroke': 'white',
  ...theme.applyStyles('dark', {
    '--PieChart-arc-stroke': 'black',
  }),

  '--FocusIndicator-color': 'var(--Primary-color)',
}));
