import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, keyframes } from '@mui/system';

export interface GridShadowScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const reveal = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const detectScroll = keyframes({ 'from, to': { '--scrollable': '" "' } });

const ShadowScrollArea = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ShadowScrollArea',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  animation: detectScroll,
  animationTimeline: '--scroll-timeline',
  animationFillMode: 'none',
  boxSizing: 'border-box',
  overflow: 'auto',
  scrollTimeline: '--scroll-timeline block',
  '&::before, &::after': {
    content: '""',
    flexShrink: 0,
    display: 'block',
    position: 'sticky',
    left: 0,
    width: '100%',
    height: '4px',
    animation: `${reveal} linear both`,
    animationTimeline: '--scroll-timeline',
    // Custom property toggle trick:
    // - Detects if the element is scrollable
    // - https://css-tricks.com/the-css-custom-property-toggle-trick/
    '--visibility-scrollable': 'var(--scrollable) visible',
    '--visibility-not-scrollable': 'hidden',
    visibility: 'var(--visibility-scrollable, var(--visibility-not-scrollable))',
  },
  '&::before': {
    top: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0, transparent 100%)',
    animationRange: '0 4px',
  },
  '&::after': {
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.05) 0, transparent 100%)',
    animationDirection: 'reverse',
    animationRange: 'calc(100% - 4px) 100%',
  },
});

/**
 * Adds scroll shadows above and below content in a scrollable container.
 */
function GridShadowScrollArea(props: GridShadowScrollAreaProps) {
  const { children, ...rest } = props;
  return <ShadowScrollArea {...rest}>{children}</ShadowScrollArea>;
}

GridShadowScrollArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
} as any;

export { GridShadowScrollArea };
