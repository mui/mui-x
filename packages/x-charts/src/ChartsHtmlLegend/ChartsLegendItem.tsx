import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  ChartsLabel,
  ChartsLabelProps,
  ChartsLabelMark,
  ChartsLabelMarkProps,
} from '../ChartsLabel';
import { ChartsLegendClasses } from './chartsLegendClasses';

interface ChartsLegendItemProps extends Omit<ChartsLabelProps, 'classes'> {
  mark: ChartsLabelMarkProps;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  classes?: Partial<Pick<ChartsLegendClasses, 'label' | 'mark' | 'series'>>;
}

const RootDiv = styled(
  'div',
  {},
)(({ onClick, theme }) => ({
  cursor: onClick ? 'pointer' : 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const { children, mark, onClick, classes } = props;

  return (
    <RootDiv className={classes?.series} onClick={onClick}>
      <ChartsLabelMark classes={{ root: classes?.mark }} {...mark} />
      <ChartsLabel classes={{ root: classes?.label }}>{children}</ChartsLabel>
    </RootDiv>
  );
}

export { ChartsLegendItem };
