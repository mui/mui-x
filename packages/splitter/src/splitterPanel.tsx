import React from 'react';
import styled from 'styled-components';

export interface SplitterPanelProps {
  position: 'top' | 'bottom';
  size: number;
  direction: 'vertical' | 'horizontal';
}

const SplitterPanelWrapper = styled.div`
  overflow: auto;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  position: relative;
`;

export const SplitterPanel: React.FC<SplitterPanelProps> = ({ direction, position, size, children }) => (
  <SplitterPanelWrapper
    className={`splitter-panel splitter-panel-${position}`}
    style={direction === 'horizontal' ? { height: `${size}px` } : { width: `${size}px` }}
  >
    {children}
  </SplitterPanelWrapper>
);
