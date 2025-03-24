import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { chartsTooltipClasses } from './chartsTooltipClasses';

/**
 * @ignore - internal component.
 */
export const ChartsTooltipPaper = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Container',
  overridesResolver: (props, styles) => styles.paper,
})(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  borderRadius: (theme.vars || theme).shape?.borderRadius,
  border: `solid ${(theme.vars || theme).palette.divider} 1px`,
}));

/**
 * @ignore - internal component.
 */
export const ChartsTooltipTable = styled('table', {
  name: 'MuiChartsTooltip',
  slot: 'Table',
  overridesResolver: (props, styles) => styles.table,
})(({ theme }) => ({
  borderSpacing: 0,
  '& caption': {
    borderBottom: `solid ${(theme.vars || theme).palette.divider} 1px`,
    padding: theme.spacing(0.5, 1.5),
    textAlign: 'start',
    whiteSpace: 'nowrap',
    '& span': {
      marginRight: theme.spacing(1.5),
    },
  },
}));

/**
 * @ignore - internal component.
 */
export const ChartsTooltipRow = styled('tr', {
  name: 'MuiChartsTooltip',
  slot: 'Row',
  overridesResolver: (props, styles) => styles.row,
})(({ theme }) => ({
  'tr:first-of-type& td': {
    paddingTop: theme.spacing(0.5),
  },
  'tr:last-of-type& td': {
    paddingBottom: theme.spacing(0.5),
  },
}));

/**
 * @ignore - internal component.
 */
export const ChartsTooltipCell = styled(Typography, {
  name: 'MuiChartsTooltip',
  slot: 'Cell',
  shouldForwardProp: () => true,
})<{
  component?: React.ElementType;
}>(({ theme }) => ({
  verticalAlign: 'middle',
  color: (theme.vars || theme).palette.text.secondary,
  [`&.${chartsTooltipClasses.labelCell}`]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1.5),
    fontWeight: theme.typography.fontWeightRegular,
  },

  [`&.${chartsTooltipClasses.valueCell}, &.${chartsTooltipClasses.axisValueCell}`]: {
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  [`&.${chartsTooltipClasses.valueCell}`]: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  'td:first-of-type&': {
    paddingLeft: theme.spacing(1.5),
  },
  'td:last-of-type&': {
    paddingRight: theme.spacing(1.5),
  },
}));
