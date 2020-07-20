import * as React from 'react';
import styled from 'styled-components';
import { DivProps } from './grid-root';

export const Overlay = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 15px;
  align-self: center;
  align-items: center;
  z-index: 10;

  .content {
    flex: 1;
    display: flex;
    justify-content: center;
  }
`;

export function GridOverlay(props: DivProps) {
  const { className, children, ...other } = props;
  return (
    <Overlay className={`overlay ${className || ''}`} {...other}>
      <div className="content">{children}</div>
    </Overlay>
  );
}
GridOverlay.displayName = 'GridOverlay';
