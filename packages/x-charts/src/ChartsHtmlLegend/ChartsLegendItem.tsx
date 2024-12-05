import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChartsLabel, { ChartsLabelProps } from '../ChartsLabel/ChartsLabel';
import ChartsLabelMark, { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { ChartsLegendClasses } from './chartsLegendClasses';

interface ChartsLegendItemProps extends Omit<ChartsLabelProps, 'classes'> {
  mark: ChartsLabelMarkProps;
  gap?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  classes?: Partial<Pick<ChartsLegendClasses, 'label' | 'mark' | 'series'>>;
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
  const { children, mark, gap, onClick, labelStyle, classes } = props;

  return (
    <RootDiv className={classes?.series} onClick={onClick} ownerState={{ gap }}>
      <ChartsLabelMark classes={{ root: classes?.mark }} {...mark} />
      <ChartsLabel classes={{ root: classes?.label }} labelStyle={labelStyle}>
        {children}
      </ChartsLabel>
    </RootDiv>
  );
}

export { ChartsLegendItem };
