import { styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { chartsTooltipClasses } from './chartsTooltipClasses';

/**
 * @ignore - internal component.
 */
export const ChartsTooltipPaper = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Container',
})(({ theme }) => ({
  boxShadow: theme.shadows[1],
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  transition: theme.transitions.create('box-shadow'),
  borderRadius: theme.shape.borderRadius,
}));

/**
 * @ignore - internal component.
 */
export const ChartsTooltipTable = styled('table', {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})(({ theme }) => ({
  borderSpacing: 0,
  '& thead td': {
    borderBottom: `solid ${(theme.vars || theme).palette.divider} 1px`,
  },
}));

/**
 * @ignore - internal component.
 */
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

/**
 * @ignore - internal component.
 */
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

/**
 * @ignore - internal component.
 */
export const ChartsTooltipMark = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Mark',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'color',
})<{ color: string }>(({ theme, color }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%',
  boxShadow: theme.shadows[1],
  backgroundColor: color,
  borderColor: (theme.vars || theme).palette.background.paper,
  border: `solid ${(theme.vars || theme).palette.background.paper} ${theme.spacing(0.25)}`,
  boxSizing: 'content-box',
}));
