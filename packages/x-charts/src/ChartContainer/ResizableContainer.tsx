import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSize } from '../context/SizeProvider';
import type { SizeContextState } from '../context/SizeProvider';
import { useDrawingArea } from '../hooks';

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
export const ResizableContainerRoot = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container',
})<{ ownerState: Partial<Pick<SizeContextState, 'width' | 'height'>> }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '& svg': {
    width: '100%',
    height: '100%',
  },
}));

/**
 * This svg will fill the parent container. And prevent an SVG rendered with size 0.
 *
 * @ignore - internal component.
 */
function SvgSize() {
  const { width, height, left, right, top, bottom } = useDrawingArea();

  const svgView = {
    width: width + left + right,
    height: height + top + bottom,
    x: 0,
    y: 0,
  };

  return <svg viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`} />;
}

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
function ResizableContainer(props: { children: React.ReactNode }) {
  const { inHeight, inWidth, hasIntrinsicSize, containerRef } = useSize();

  return (
    <ResizableContainerRoot
      {...props}
      ownerState={{ width: inWidth, height: inHeight }}
      ref={containerRef}
    >
      {hasIntrinsicSize ? props.children : <SvgSize />}
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
