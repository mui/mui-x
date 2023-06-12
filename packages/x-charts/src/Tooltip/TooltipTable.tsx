import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const TooltipPaper = styled(Paper, {
  name: 'MuiTooltip',
  slot: 'Table',
})(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
}));

export const TooltipTable = styled('table', {
  name: 'MuiTooltip',
  slot: 'Table',
})(() => ({}));

export const TooltipCell = styled('td', {
  name: 'MuiTooltip',
  slot: 'Cell',
})(({ theme }) => ({
  padding: `${theme.spacing(0.25)} ${theme.spacing(0.5)}`,
  verticalAlign: 'baseline',
}));

export const TooltipMark = styled('div', {
  name: 'MuiTooltip',
  slot: 'Mark',
})<{ ownerState: { color: string } }>(({ theme, ownerState }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '50%',
  backgroundColor: ownerState.color,
}));
