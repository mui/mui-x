import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChartsLabel, { ChartsLabelProps } from '../ChartsLabel/ChartsLabel';
import ChartsLabelMark, { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';

interface ChartsLegendItemProps extends ChartsLabelProps {
  mark: ChartsLabelMarkProps;
  gap?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const RootDiv = styled(
  'div',
  {},
)<{ ownerState: Pick<ChartsLegendItemProps, 'gap'> }>(({ ownerState, onClick, theme }) => ({
  cursor: onClick ? 'pointer' : 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: ownerState.gap ?? theme.spacing(1),
}));

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const { children, mark, gap, onClick, labelStyle } = props;

  return (
    <RootDiv onClick={onClick} ownerState={{ gap }}>
      <ChartsLabelMark {...mark} />
      <ChartsLabel labelStyle={labelStyle}>{children}</ChartsLabel>
    </RootDiv>
  );
}

export { ChartsLegendItem };
