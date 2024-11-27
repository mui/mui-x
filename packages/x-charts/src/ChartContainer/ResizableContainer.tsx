import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartContainerSize } from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
export const ResizableContainerRoot = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container',
})<{ ownerState: { width?: number; height?: number } }>(({ ownerState }) => ({
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

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
function ResizableContainer(props: { children: React.ReactNode }) {
  const store = useStore();
  const { height, width } = useSelector(store, selectorChartContainerSize);

  return (
    <ResizableContainerRoot
      {...props}
      ownerState={{ width, height }}
      // ref={containerRef}
    >
      {props.children}
    </ResizableContainerRoot>
  );
}

ResizableContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
} as any;

export { ResizableContainer };
