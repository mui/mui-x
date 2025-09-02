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
import { chartsToolbarClasses } from '../Toolbar';

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

const getJustifyItems = (position?: Position) => {
  if (position?.horizontal === 'start') {
    return 'start';
  }
  if (position?.horizontal === 'end') {
    return 'end';
  }
  return 'center';
};

const getAlignItems = (position?: Position) => {
  if (position?.vertical === 'top') {
    return 'flex-start';
  }
  if (position?.vertical === 'bottom') {
    return 'flex-end';
  }
  return 'center';
};

const getGridTemplateAreasWithToolBar = (direction?: Direction, position?: Position) => {
  if (direction === 'vertical') {
    if (position?.horizontal === 'start') {
      return `"toolbar toolbar"
              "legend chart"`;
    }
    return `"toolbar toolbar"
            "chart legend"`;
  }

  if (position?.vertical === 'bottom') {
    return `"toolbar"
            "chart"
            "legend"`;
  }
  return `"toolbar"
          "legend"
          "chart"`;
};

const getGridTemplateAreasWithoutToolBar = (direction?: Direction, position?: Position) => {
  if (direction === 'vertical') {
    if (position?.horizontal === 'start') {
      return `"legend chart"`;
    }
    return `"chart legend"`;
  }

  if (position?.vertical === 'bottom') {
    return `"chart"
            "legend"`;
  }
  return `"legend"
          "chart"`;
};

const getTemplateColumns = (direction?: Direction, position?: Position) => {
  if (direction === 'vertical') {
    if (position?.horizontal === 'start') {
      return 'auto 1fr';
    }

    return '1fr auto';
  }

  return '100%';
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'extendVertically',
})<{ ownerState: ChartsWrapperProps; extendVertically: boolean }>(({ ownerState }) => ({
  variants: [
    {
      props: { extendVertically: true },
      style: {
        height: '100%',
      },
    },
  ],
  flex: 1,
  display: 'grid',
  gridTemplateColumns: getTemplateColumns(ownerState.legendDirection, ownerState.legendPosition),
  gridTemplateRows: ownerState.legendDirection === 'vertical' ? 'auto 1fr' : 'auto auto 1fr',
  [`&:has(.${chartsToolbarClasses.root})`]: {
    gridTemplateAreas: getGridTemplateAreasWithToolBar(
      ownerState.legendDirection,
      ownerState.legendPosition,
    ),
  },
  [`&:not(:has(.${chartsToolbarClasses.root}))`]: {
    gridTemplateAreas: getGridTemplateAreasWithoutToolBar(
      ownerState.legendDirection,
      ownerState.legendPosition,
    ),
  },
  justifyContent: 'center',
  justifyItems: getJustifyItems(ownerState.legendPosition),
  alignItems: getAlignItems(ownerState.legendPosition),
  [`& > .${chartsToolbarClasses.root}`]: {
    justifySelf: 'center',
  },
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
