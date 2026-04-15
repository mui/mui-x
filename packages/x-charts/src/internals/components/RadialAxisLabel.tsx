import { styled } from '@mui/material/styles';

export const RadialAxisLabel = styled('span', {
  slot: 'internal',
  shouldForwardProp: (prop) => prop !== 'verticalAlign' && prop !== 'horizontalAlign',
})<{
  verticalAlign: 'start' | 'middle' | 'end';
  horizontalAlign: 'start' | 'middle' | 'end';
}>(({ theme }) => ({
  position: 'fixed',
  fontSize: 12,
  lineHeight: 1,
  padding: '2px 4px',
  borderRadius: 2,
  whiteSpace: 'nowrap',
  translate: 'var(--dx, -50%) var(--dy, -50%)',
  color: theme.palette.text.primary,

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
