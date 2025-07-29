import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { useChartRootRef } from '../hooks/useChartRootRef';
import { Direction } from '../ChartsLegend';
import { Position } from '../models';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartPropsSize } from '../internals/plugins/corePlugins/useChartDimensions';

export interface ChartsWrapperProps {
  /**
   * The position of the legend.
   * @default { horizontal: 'center', vertical: 'bottom' }
   */
  // eslint-disable-next-line react/no-unused-prop-types
  legendPosition?: Position;
  /**
   * The direction of the legend.
   * @default 'horizontal'
   */
  // eslint-disable-next-line react/no-unused-prop-types
  legendDirection?: Direction;
  /**
   * If `true`, the chart wrapper set `height: 100%`.
   * @default `false` if the `height` prop is set. And `true` otherwise.
   */
  extendVertically?: boolean;
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
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'extendVertically',
})<{ ownerState: ChartsWrapperProps; extendVertically: boolean }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: getDirection(ownerState.legendDirection, ownerState.legendPosition),
  flex: 1,
  justifyContent: 'center',
  alignItems: getAlign(ownerState.legendDirection, ownerState.legendPosition),
  variants: [
    {
      props: { extendVertically: true },
      style: {
        height: '100%',
      },
    },
  ],
}));

/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props: ChartsWrapperProps) {
  const { children, sx, extendVertically } = props;
  const chartRootRef = useChartRootRef();

  const store = useStore();
  const { height: propsHeight } = useSelector(store, selectorChartPropsSize);

  return (
    <Root
      ref={chartRootRef}
      ownerState={props}
      sx={sx}
      extendVertically={extendVertically ?? propsHeight === undefined}
    >
      {children}
    </Root>
  );
}

ChartsWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * If `true`, the chart wrapper set `height: 100%`.
   * @default `false` if the `height` prop is set. And `true` otherwise.
   */
  extendVertically: PropTypes.bool,
  /**
   * The direction of the legend.
   * @default 'horizontal'
   */
  legendDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * The position of the legend.
   * @default { horizontal: 'center', vertical: 'bottom' }
   */
  legendPosition: PropTypes.shape({
    horizontal: PropTypes.oneOf(['center', 'end', 'start']),
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']),
  }),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsWrapper };
