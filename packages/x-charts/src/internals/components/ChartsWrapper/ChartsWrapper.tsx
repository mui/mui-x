import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { Direction, LegendPosition } from '../../../ChartsLegend';

export interface ChartsWrapperProps {
  // eslint-disable-next-line react/no-unused-prop-types
  legendPosition?: LegendPosition;
  // eslint-disable-next-line react/no-unused-prop-types
  legendDirection?: Direction;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
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
  alignItems: getAlign(ownerState.legendDirection, ownerState.legendPosition),
}));

/**
 * @ignore - internal component.
 *
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props: ChartsWrapperProps) {
  const { children, sx } = props;

  return (
    <Root ownerState={props} sx={sx}>
      {children}
    </Root>
  );
}

export { ChartsWrapper };
