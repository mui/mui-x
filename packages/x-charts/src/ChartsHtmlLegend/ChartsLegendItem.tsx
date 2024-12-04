import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChartsLabel, { ChartsLabelProps } from '../ChartsLabel/ChartsLabel';
import ChartsLabelMark, { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';

export interface ChartsLegendItemProps extends ChartsLabelProps {
  mark: ChartsLabelMarkProps;
  gap: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const RootDiv = styled(
  'div',
  {},
)<{ ownerState: Pick<ChartsLegendItemProps, 'gap'> }>(({ ownerState, onClick }) => ({
  cursor: onClick ? 'pointer' : 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: ownerState.gap,
}));

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const { children, mark, gap, onClick } = props;

  return (
    <RootDiv onClick={onClick} ownerState={{ gap }}>
      <ChartsLabelMark {...mark} />
      <ChartsLabel>{children}</ChartsLabel>
    </RootDiv>
  );
}

export { ChartsLegendItem };
