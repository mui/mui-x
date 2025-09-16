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
   * If `true`, the legend is not rendered.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  hideLegend: boolean;
  /**
   * If `true`, the chart wrapper set `height: 100%`.
   * @default `false` if the `height` prop is set. And `true` otherwise.
   */
  extendVertically?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const getJustifyItems = (position: Position | undefined) => {
  if (position?.horizontal === 'start') {
    return 'start';
  }
  if (position?.horizontal === 'end') {
    return 'end';
  }
  return 'center';
};

const getAlignItems = (position: Position | undefined) => {
  if (position?.vertical === 'top') {
    return 'flex-start';
  }
  if (position?.vertical === 'bottom') {
    return 'flex-end';
  }
  return 'center';
};

const addToolbar = (template: string) => {
  return `"toolbar"
          ${template}`;
};

const getGridTemplateAreas = (
  hideLegend: boolean,
  direction: Direction | undefined,
  position: Position | undefined,
) => {
  if (hideLegend) {
    return `"chart"`;
  }
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

const getTemplateColumns = (
  hideLegend: boolean,
  direction: Direction | undefined,
  position: Position | undefined,
  width: number | undefined,
) => {
  if (direction === 'vertical') {
    if (hideLegend) {
      return '1fr';
    }
    if (position?.horizontal === 'start') {
      return 'auto 1fr';
    }

    return `${width ? 'auto' : '1fr'} auto`;
  }

  return '100%';
};

const getTemplateRows = (hideLegend: boolean, direction: Direction | undefined) => {
  if (direction === 'vertical') {
    if (hideLegend) {
      return 'auto';
    }
    return 'auto 1fr';
  }
  return 'auto 1fr';
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'extendVertically' && prop !== 'width',
})<{ ownerState: ChartsWrapperProps; extendVertically: boolean; width?: number }>(
  ({ ownerState, width }) => ({
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
    gridTemplateColumns: getTemplateColumns(
      ownerState.hideLegend,
      ownerState.legendDirection,
      ownerState.legendPosition,
      width,
    ),
    gridTemplateRows: getTemplateRows(ownerState.hideLegend, ownerState.legendDirection),
    [`&:has(.${chartsToolbarClasses.root})`]: {
      gridTemplateAreas: addToolbar(
        getGridTemplateAreas(
          ownerState.hideLegend,
          ownerState.legendDirection,
          ownerState.legendPosition,
        ),
      ),
    },
    [`&:not(:has(.${chartsToolbarClasses.root}))`]: {
      gridTemplateAreas: getGridTemplateAreas(
        ownerState.hideLegend,
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
  }),
);

/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props: ChartsWrapperProps) {
  const { children, sx, extendVertically } = props;
  const chartRootRef = useChartRootRef();

  const store = useStore();
  const { width: propsWidth, height: propsHeight } = useSelector(store, selectorChartPropsSize);

  return (
    <Root
      ref={chartRootRef}
      ownerState={props}
      sx={sx}
      extendVertically={extendVertically ?? propsHeight === undefined}
      width={propsWidth}
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
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool.isRequired,
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
