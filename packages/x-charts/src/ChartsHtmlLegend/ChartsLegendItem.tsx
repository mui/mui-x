import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  ChartsLabel,
  ChartsLabelProps,
  ChartsLabelMark,
  ChartsLabelMarkProps,
} from '../ChartsLabel';
import { ChartsLegendClasses } from './chartsLegendClasses';
import { Direction } from './direction';

interface ChartsLegendItemProps extends Omit<ChartsLabelProps, 'classes'> {
  mark: ChartsLabelMarkProps;
  direction?: Direction;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  classes?: Partial<Pick<ChartsLegendClasses, 'label' | 'mark' | 'series'>>;
}

const RootElement = styled(
  'li',
  {},
)<{ ownerState: Pick<ChartsLegendItemProps, 'direction'> }>(({ ownerState, onClick, theme }) => ({
  cursor: onClick ? 'pointer' : 'unset',
  display: ownerState.direction === 'row' ? 'inline-flex' : 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const { children, mark, onClick, direction, classes } = props;

  return (
    <RootElement
      className={classes?.series}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      ownerState={{ direction }}
    >
      <ChartsLabelMark classes={{ root: classes?.mark }} {...mark} />
      <ChartsLabel classes={{ root: classes?.label }}>{children}</ChartsLabel>
    </RootElement>
  );
}

export { ChartsLegendItem };
