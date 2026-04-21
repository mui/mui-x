import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const RadialAxisLabel = styled(Typography, {
  slot: 'internal',
  shouldForwardProp: (prop) => prop !== 'verticalAlign' && prop !== 'horizontalAlign',
})<{
  verticalAlign: 'start' | 'middle' | 'end';
  horizontalAlign: 'start' | 'middle' | 'end';
}>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: 0.5,
  whiteSpace: 'nowrap',
  translate: 'var(--dx, -50%) var(--dy, -50%)',

  variants: [
    // Add opaque background when centered to improve readability
    {
      props: { verticalAlign: 'middle', horizontalAlign: 'middle' },
      style: { backgroundColor: (theme.vars ?? theme).palette.background.paper },
    },

    // Handle the vertical alignment
    {
      props: { verticalAlign: 'start' },
      style: { '--dy': '0' },
    },
    {
      props: { verticalAlign: 'middle' },
      style: { '--dy': '-50%' },
    },
    {
      props: { verticalAlign: 'end' },
      style: { '--dy': '-100%' },
    },

    // Handle the horizontal alignment
    {
      props: { horizontalAlign: 'start' },
      style: { '--dx': '0' },
    },

    {
      props: { horizontalAlign: 'middle' },
      style: { '--dx': '-50%' },
    },

    {
      props: { horizontalAlign: 'end' },
      style: { '--dx': '-100%' },
    },
  ],
}));
