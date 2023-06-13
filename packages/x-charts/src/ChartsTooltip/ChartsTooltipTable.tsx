import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const ChartsTooltipPaper = styled(Paper, {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
}));

export const ChartsTooltipTable = styled('table', {
  name: 'MuiChartsTooltip',
  slot: 'Table',
})(() => ({}));

export const ChartsTooltipCell = styled('td', {
  name: 'MuiChartsTooltip',
  slot: 'Cell',
})(({ theme }) => ({
  padding: `${theme.spacing(0.25)} ${theme.spacing(0.5)}`,
  verticalAlign: 'baseline',
}));

export const ChartsTooltipMark = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Mark',
})<{ ownerState: { color: string } }>(({ theme, ownerState }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%',
  backgroundColor: ownerState.color,
}));
