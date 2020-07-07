import * as React from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LeftArrow from '@material-ui/icons/KeyboardArrowLeft';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';
import styled, { css } from 'styled-components';

export interface SplitterHandlerProps {
  onMouseDown: () => void;
  invertHandler?: boolean;
  direction: 'vertical' | 'horizontal';
  displayHandler: 'none' | 'show' | 'fade';
}

const SplitterHandlerWrapper = styled.div<Pick<SplitterHandlerProps, 'direction'>>`
  ${({ direction }) => (direction === 'horizontal' ? 'width: 100%;' : 'height: 100%')};
  cursor: ${({ direction }) => (direction === 'horizontal' ? 'row-resize' : 'col-resize')};
  box-sizing: border-box;
  ${({ direction }) => (direction === 'horizontal' ? 'border-bottom' : 'border-right')}: 1px solid
    #c1c1c1;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  flex-direction: ${({ direction }) => (direction === 'horizontal' ? 'column' : 'row')};
`;

const SplitterHandlerButton = styled.div<
  Pick<SplitterHandlerProps, 'invertHandler' | 'direction' | 'displayHandler'>
>`
  display: ${p =>
    p.displayHandler === 'show' || p.displayHandler === 'fade' ? 'inline-flex' : 'none'};
  justify-content: center;
  background-color: #e0e0e0;
  position: absolute;
  border: 1px solid #c1c1c1;
  ${p =>
    p.displayHandler === 'fade' &&
    css`
      transition: opacity 0.25s;
      opacity: 0;
      &:hover {
        opacity: 1;
      }
    `}

  ${p =>
    p.direction === 'horizontal'
      ? css`
          width: 50px;
          max-height: 10px;
          top: ${p.invertHandler ? '-11px' : '1px'};
          ${p.invertHandler ? 'border-bottom: none' : 'border-top: none'};
          border-top-left-radius: ${p.invertHandler ? '5px' : '0px'};
          border-top-right-radius: ${p.invertHandler ? '5px' : '0px'};
          border-bottom-left-radius: ${p.invertHandler ? '0px' : '5px'};
          border-bottom-right-radius: ${p.invertHandler ? '0px' : '5px'};
        `
      : css`
          width: 10px;
          height: 50px;
          left: ${p.invertHandler ? '-11px' : '1px'};
          flex-direction: column;
          ${p.invertHandler ? 'border-right: none' : 'border-left: none'};
          border-top-left-radius: ${p.invertHandler ? '5px' : '0px'};
          border-top-right-radius: ${p.invertHandler ? '0px' : '5px'};
          border-bottom-left-radius: ${p.invertHandler ? '5px' : '0px'};
          border-bottom-right-radius: ${p.invertHandler ? '0px' : '5px'};
        `}
`;

const SmallExpandLessIcon = styled(ExpandLessIcon)`
  font-size: 1.1rem;
  margin-top: -3px;
`;
const SmallExpandMoreIcon = styled(ExpandMoreIcon)`
  font-size: 1.1rem;
  margin-top: -3px;
`;
const SmallLeftArrowIcon = styled(LeftArrow)`
  font-size: 1.1rem;
  margin-left: -3px;
`;
const SmallRightArrowIcon = styled(RightArrow)`
  font-size: 1.1rem;
  margin-left: -3px;
`;

const HandlerIcon = ({
  invert,
  direction,
}: {
  invert?: boolean;
  direction: 'horizontal' | 'vertical';
}) => {
  if (direction === 'horizontal') {
    return invert ? <SmallExpandLessIcon /> : <SmallExpandMoreIcon />;
  } else {
    return invert ? <SmallLeftArrowIcon /> : <SmallRightArrowIcon />;
  }
};

export const SplitterHandler: React.FC<SplitterHandlerProps> = ({
  onMouseDown,
  invertHandler,
  direction,
  displayHandler,
}) => (
  <SplitterHandlerWrapper
    className={'splitter-handler-wrapper'}
    onMouseDown={onMouseDown}
    onTouchStart={onMouseDown}
    direction={direction}
  >
    <SplitterHandlerButton
      className={'splitter-handler-button'}
      invertHandler={invertHandler}
      direction={direction}
      displayHandler={displayHandler}
    >
      <HandlerIcon invert={invertHandler} direction={direction} />
    </SplitterHandlerButton>
  </SplitterHandlerWrapper>
);
