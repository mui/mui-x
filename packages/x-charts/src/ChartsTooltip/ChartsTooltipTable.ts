import Box from '@mui/system/Box';
import { styled } from '@mui/material/styles';
import { chartsTooltipClasses } from './chartsTooltipClasses';

export const ChartsTooltipPaper = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Container',
})(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  transition: theme.transitions.create('box-shadow'),
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

export const ChartsTooltipTable = styled('table', {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})(({ theme }) => ({
  borderSpacing: 0,
  '& thead td': {
    borderBottom: `solid ${(theme.vars || theme).palette.divider} 1px`,
  },
}));

export const ChartsTooltipRow = styled('tr', {
  name: 'MuiChartsTooltip',
  slot: 'Row',
})(({ theme }) => ({
  'tr:first-of-type& td': {
    paddingTop: theme.spacing(1),
  },
  'tr:last-of-type& td': {
    paddingBottom: theme.spacing(1),
  },
}));

export const ChartsTooltipCell = styled('td', {
  name: 'MuiChartsTooltip',
  slot: 'Cell',
})(({ theme }) => ({
  verticalAlign: 'middle',
  color: (theme.vars || theme).palette.text.secondary,

  [`&.${chartsTooltipClasses.labelCell}`]: {
    paddingLeft: theme.spacing(1),
  },
  [`&.${chartsTooltipClasses.valueCell}`]: {
    paddingLeft: theme.spacing(4),
    color: (theme.vars || theme).palette.text.primary,
  },

  'td:first-of-type&': {
    paddingLeft: theme.spacing(2),
  },
  'td:last-of-type&': {
    paddingRight: theme.spacing(2),
  },
}));

export const ChartsTooltipMark = styled(Box, {
  name: 'MuiChartsTooltip',
  slot: 'Mark',
})<{ ownerState: { color: string } }>(({ theme, ownerState }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%',
  backgroundColor: ownerState.color,
  borderColor: (theme.vars || theme).palette.background.paper,
  border: `solid ${(theme.vars || theme).palette.background.paper} ${theme.spacing(0.25)}`,
  boxSizing: 'content-box',
}));
