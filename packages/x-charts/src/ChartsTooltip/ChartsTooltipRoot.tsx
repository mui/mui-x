import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';

/**
 * The root component of the tooltip.
 * @ignore - internal component.
 */
export const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
})(({ theme }) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal,
}));
