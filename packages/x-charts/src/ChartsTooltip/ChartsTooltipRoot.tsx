import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';

export const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
})(({ theme }) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal,
}));
