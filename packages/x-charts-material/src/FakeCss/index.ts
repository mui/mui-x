import { styled } from '@mui/material';

export const FakeCss = styled('div')(({ theme }) => ({
  '--Primary-color': theme.palette.primary.main,

  '--PieChart-arc-stroke': theme.palette.background.paper,

  '--FocusIndicator-color': 'var(--Primary-color)',
}));
