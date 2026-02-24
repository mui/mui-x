'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { styled, type SxProps, type Theme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { useChartRootRef } from '../hooks/useChartRootRef';
import { type Direction } from '../ChartsLegend';
import { type Position } from '../models';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartPropsHeight,
  selectorChartPropsWidth,
} from '../internals/plugins/corePlugins/useChartDimensions';
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
   * @default false
   */
  // eslint-disable-next-line react/no-unused-prop-types
  hideLegend?: boolean;
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

const getGridTemplateAreas = (
  hideLegend: boolean | undefined,
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
  hideLegend: boolean = false,
  direction: Direction = 'horizontal',
  horizontalPosition: Position['horizontal'] = 'end',
  width: number | undefined = undefined,
) => {
  const drawingAreaColumn = width ? 'auto' : '1fr';
  if (direction === 'horizontal') {
    return drawingAreaColumn;
  }

  if (hideLegend) {
    return drawingAreaColumn;
  }
  return horizontalPosition === 'start' ? `auto ${drawingAreaColumn}` : `${drawingAreaColumn} auto`;
};

const getTemplateRows = (
  hideLegend: boolean = false,
  direction: Direction = 'horizontal',
  verticalPosition: Position['vertical'] = 'top',
) => {
  const drawingAreaRow = '1fr';
  if (direction === 'vertical') {
    return drawingAreaRow;
  }

  if (hideLegend) {
    return drawingAreaRow;
  }
  return verticalPosition === 'bottom' ? `${drawingAreaRow} auto` : `auto ${drawingAreaRow}`;
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'extendVertically' && prop !== 'width',
})<{ ownerState: ChartsWrapperProps; extendVertically: boolean; width?: number }>(({
  ownerState,
  width,
}) => {
  const gridTemplateColumns = getTemplateColumns(
    ownerState.hideLegend,
    ownerState.legendDirection,
    ownerState.legendPosition?.horizontal,
    width,
  );
  const gridTemplateRows = getTemplateRows(
    ownerState.hideLegend,
    ownerState.legendDirection,
    ownerState.legendPosition?.vertical,
  );
  const gridTemplateAreas = getGridTemplateAreas(
    ownerState.hideLegend,
    ownerState.legendDirection,
    ownerState.legendPosition,
  );
  return {
    variants: [
      {
        props: { extendVertically: true },
        style: {
          height: '100%',
          minHeight: 0,
        },
      },
    ],
    flex: 1,
    display: 'grid',
    gridTemplateColumns,
    gridTemplateRows,
    gridTemplateAreas,
    [`&:has(.${chartsToolbarClasses.root})`]: {
      // Add a row for toolbar if there is one.
      gridTemplateRows: `auto ${gridTemplateRows}`,
      gridTemplateAreas: `"${gridTemplateColumns
        .split(' ')
        .map(() => 'toolbar')
        .join(' ')}"
        ${gridTemplateAreas}`,
    },
    [`& .${chartsToolbarClasses.root}`]: {
      gridArea: 'toolbar',
      justifySelf: 'center',
    },
    justifyContent: 'safe center',
    justifyItems: getJustifyItems(ownerState.legendPosition),
    alignItems: getAlignItems(ownerState.legendPosition),
  };
});

/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
const ChartsWrapper = React.forwardRef<HTMLDivElement, ChartsWrapperProps>(
  function ChartsWrapper(props, ref) {
    const { children, sx, extendVertically } = props;
    const chartRootRef = useChartRootRef();
    const handleRef = useForkRef(chartRootRef, ref);

    const store = useStore();

    const propsWidth = store.use(selectorChartPropsWidth);
    const propsHeight = store.use(selectorChartPropsHeight);

    return (
      <Root
        ref={handleRef}
        ownerState={props}
        sx={sx}
        extendVertically={extendVertically ?? propsHeight === undefined}
        width={propsWidth}
      >
        {children}
      </Root>
    );
  },
);

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
   * @default false
   */
  hideLegend: PropTypes.bool,
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
