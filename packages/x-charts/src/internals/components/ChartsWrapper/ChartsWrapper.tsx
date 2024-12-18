import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Direction, LegendPosition } from '../../../ChartsLegend';

interface ChartsWrapperProps {
  // eslint-disable-next-line react/no-unused-prop-types
  legendPosition?: LegendPosition;
  // eslint-disable-next-line react/no-unused-prop-types
  legendDirection?: Direction;
  children: React.ReactNode;
}

const getDirection = (direction?: Direction, position?: LegendPosition) => {
  if (direction === 'vertical') {
    if (position?.horizontal === 'left') {
      return 'row';
    }

    return 'row-reverse';
  }

  if (position?.vertical === 'bottom') {
    return 'column-reverse';
  }

  return 'column';
};

const getAlign = (direction?: Direction, position?: LegendPosition) => {
  if (direction === 'vertical') {
    if (position?.vertical === 'top') {
      return 'flex-start';
    }

    if (position?.vertical === 'bottom') {
      return 'flex-end';
    }
  }

  if (direction === 'horizontal') {
    if (position?.horizontal === 'left') {
      return 'flex-start';
    }

    if (position?.horizontal === 'right') {
      return 'flex-end';
    }
  }

  return 'center';
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsWrapperProps }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: getDirection(ownerState.legendDirection, ownerState.legendPosition),
  flex: 1,
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  alignItems: getAlign(ownerState.legendDirection, ownerState.legendPosition),
}));

/**
 * @ignore - internal component.
 *
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props: ChartsWrapperProps) {
  const { children } = props;

  return <Root ownerState={props}>{children}</Root>;
}

export { ChartsWrapper };
