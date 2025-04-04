import * as React from 'react';
import { styled, keyframes } from '@mui/system';

export interface GridShadowScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const reveal = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const detectScroll = keyframes({ 'from, to': { '--scrollable': '" "' } });

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const ShadowScrollArea = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ShadowScrollArea',
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${detectScroll};
  animation-timeline: --scroll-timeline;
  animation-fill-mode: none;
  box-sizing: border-box;
  overflow: auto;
  scroll-timeline: --scroll-timeline block;

  &::before,
  &::after {
    content: '';
    flex-shrink: 0;
    display: block;
    position: sticky;
    left: 0;
    width: 100%;
    height: 4px;
    animation: ${reveal} linear both;
    animation-timeline: --scroll-timeline;

    // Custom property toggle trick:
    // - Detects if the element is scrollable
    // - https://css-tricks.com/the-css-custom-property-toggle-trick/
    --visibility-scrollable: var(--scrollable) visible;
    --visibility-not-scrollable: hidden;
    visibility: var(--visibility-scrollable, var(--visibility-not-scrollable));
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0, transparent 100%);
    animation-range: 0 4px;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.05) 0, transparent 100%);
    animation-direction: reverse;
    animation-range: calc(100% - 4px) 100%;
  }
`;

/**
 * Adds scroll shadows above and below content in a scrollable container.
 */
export function GridShadowScrollArea(props: GridShadowScrollAreaProps) {
  const { children, ...rest } = props;
  return <ShadowScrollArea {...rest}>{children}</ShadowScrollArea>;
}
