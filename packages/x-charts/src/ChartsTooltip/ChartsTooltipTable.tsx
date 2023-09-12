import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from './tooltipClasses';

export const ChartsTooltipPaper = styled(Paper, {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})({});

export const ChartsTooltipTable = styled('table', {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})(({ theme }) => ({
  borderSpacing: 0,
  '& thead td': {
    borderBottom: `solid ${theme.palette.divider} 1px`,
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
  color: theme.palette.text.secondary,

  [`&.${tooltipClasses.labelCell}`]: {
    paddingLeft: theme.spacing(1),
  },
  [`&.${tooltipClasses.valueCell}`]: {
    paddingLeft: theme.spacing(4),
    color: theme.palette.text.primary,
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
  borderColor: theme.palette.background.paper,
  border: `solid ${theme.palette.background.paper} ${theme.spacing(0.25)}`,
  boxSizing: 'content-box',
}));
