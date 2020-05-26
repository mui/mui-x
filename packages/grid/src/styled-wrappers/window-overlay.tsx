import React from 'react';
import styled from 'styled-components';
import { DivProps } from './grid-root';

export const Overlay = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-self: center;
  align-items: center;
  z-index: 10;
  
  .content {
    flex: 1;
    display: flex;
    justify-content: center;
  }
`;

export const GridOverlay: React.FC<DivProps> = (props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <Overlay className={'overlay ' + (className || '')} {...rest}>
      <div className={'content'}>{children}</div>
    </Overlay>
  );
};
GridOverlay.displayName = 'GridOverlay';
