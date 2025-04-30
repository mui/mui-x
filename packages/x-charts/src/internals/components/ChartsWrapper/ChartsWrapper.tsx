import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { useChartRootRef } from '../../../hooks/useChartRootRef';
import { Direction } from '../../../ChartsLegend';
import { Position } from '../../../models';

export interface ChartsWrapperProps {
  // eslint-disable-next-line react/no-unused-prop-types
  legendPosition?: Position;
  // eslint-disable-next-line react/no-unused-prop-types
  legendDirection?: Direction;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const getDirection = (direction?: Direction, position?: Position) => {
  if (direction === 'vertical') {
    if (position?.horizontal === 'start') {
      return 'row';
    }

    return 'row-reverse';
  }

  if (position?.vertical === 'bottom') {
    return 'column-reverse';
  }

  return 'column';
};

const getAlign = (direction?: Direction, position?: Position) => {
  if (direction === 'vertical') {
    if (position?.vertical === 'top') {
      return 'flex-start';
    }

    if (position?.vertical === 'bottom') {
      return 'flex-end';
    }
  }

  if (direction === 'horizontal') {
    if (position?.horizontal === 'start') {
      return 'flex-start';
    }

    if (position?.horizontal === 'end') {
      return 'flex-end';
    }
  }

  return 'center';
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
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
  const chartRootRef = useChartRootRef();

  return (
    <Root ref={chartRootRef} ownerState={props} sx={sx}>
      {children}
    </Root>
  );
}

export { ChartsWrapper };
