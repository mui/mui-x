import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const StyledPanels = styled.div`
  display: flex;
  justify-content: space-evenly;

  .panel-separator {
    flex: 0 1 10px;
  }
  .panel {
    position: relative;
    background-color: rgb(52, 54, 57);
    display: flex;
    color: #e1e1e1;
    flex-direction: column;
    flex: 1;
    height: 36px;
    transition: height 0.2s ease;
    overflow: hidden;

    .panel-content {
      display: none;
      padding: 10px;
    }

    .panel-title {
      display: flex;
      flex-direction: row;
      background-color: #2b2d2f;

      .arrow {
        margin-top: 1px;
        padding: 5px;
        transform: rotate(-90deg);
      }
      h5 {
        margin: 10px 10px 10px 0;
      }
    }

    &.open {
      height: 160px;
      overflow: hidden;

      .arrow {
        transform: rotate(0deg);
      }

      .panel-content {
        display: initial;
      }
    }
    @media screen and (max-width: 600px) {
      &.open {
        height: 200px;
      }
    }
  }
`;

export const Panels: React.FC<DivProps> = props => {
  const { className, children, ...rest } = props;
  return (
    <StyledPanels className={'panels ' + (className || '')} {...rest}>
      {children}
    </StyledPanels>
  );
};
Panels.displayName = 'Panels';

export interface PanelProps {
  title: string;
  isOpen?: boolean;
}
export const Panel: React.FC<PanelProps & DivProps> = props => {
  const { className, children, title, isOpen, ...rest } = props;
  const [isOpenState, setOpenState] = useState<boolean>(isOpen === undefined ? true : isOpen);
  const toggleOpen = () => setOpenState(!isOpenState);

  return (
    <div className={`panel ${isOpenState ? 'open' : ''}` + (className || '')} {...rest}>
      <div className={'panel-title'} onClick={toggleOpen}>
        <ArrowDropDownIcon className={'arrow'} />
        <h5>{title}</h5>
      </div>
      <div className={'panel-content'}>{children}</div>
    </div>
  );
};
Panel.displayName = 'Panel';

export const PanelSeparator: React.FC<DivProps> = props => {
  const { className, children, ...rest } = props;
  return <div className={'panel-separator ' + (className || '')} {...rest}></div>;
};
PanelSeparator.displayName = 'PanelSeparator';
