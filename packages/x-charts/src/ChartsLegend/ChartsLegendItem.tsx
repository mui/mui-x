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
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  classes?: Partial<Pick<ChartsLegendClasses, 'label' | 'mark' | 'series'>>;
}

const RootElement = styled(
  'li',
  {},
)<{ ownerState: ChartsLegendItemProps }>(({ ownerState, theme }) => ({
  display: ownerState.direction === 'horizontal' ? 'inline-flex' : 'flex',

  button: {
    // Reset button styles
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: ownerState.onClick ? 'pointer' : 'unset',

    display: ownerState.direction === 'horizontal' ? 'inline-flex' : 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const { children, mark, onClick, classes } = props;

  const Element = onClick ? 'button' : 'div';

  return (
    <RootElement className={classes?.series} ownerState={props}>
      <Element
        role={onClick ? 'button' : undefined}
        type={onClick ? 'button' : undefined}
        // @ts-expect-error onClick is only attached to a button
        onClick={onClick}
      >
        <ChartsLabelMark classes={{ root: classes?.mark }} {...mark} />
        <ChartsLabel classes={{ root: classes?.label }}>{children}</ChartsLabel>
      </Element>
    </RootElement>
  );
}

export { ChartsLegendItem };
