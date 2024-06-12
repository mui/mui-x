import { styled } from '@mui/material/styles';
import type { ResponsiveChartContainerProps } from './ResponsiveChartContainer';

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
export const ResizableContainer = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container',
})<{ ownerState: Pick<ResponsiveChartContainerProps, 'width' | 'height'> }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&>svg': {
    width: '100%',
    height: '100%',
  },
}));
