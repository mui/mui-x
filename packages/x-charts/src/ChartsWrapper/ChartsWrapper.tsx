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

export interface ChartsWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The position of the legend.
   * @default { horizontal: 'center', vertical: 'bottom' }
   */
  legendPosition?: Position;
  /**
   * The direction of the legend.
   * @default 'horizontal'
   */
  legendDirection?: Direction;
  /**
   * If `true`, the legend is not rendered.
   * @default false
   */
  hideLegend?: boolean;
  /**
   * If `true`, the chart wrapper set `height: 100%`.
   * @default `false` if the `height` prop is set. And `true` otherwise.
   */
  extendVertically?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export interface ChartsWrapperOwnerState
  extends Pick<ChartsWrapperProps, 'hideLegend' | 'legendDirection' | 'legendPosition'> {}

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'extendVertically',
})<{ extendVertically: boolean }>({
  '--ChartsWrapper-chartCol': '1fr',
  flex: 1,
  display: 'grid',
  justifyContent: 'safe center',
  justifyItems: 'center',
  alignItems: 'center',
  gridTemplateRows: '1fr',
  gridTemplateColumns: 'var(--ChartsWrapper-chartCol)',
  '&[data-fixed-width]': { '--ChartsWrapper-chartCol': 'auto' },
  '&[data-layout="legend-top"]': {
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: '"legend" "chart"',
  },
  '&[data-layout="legend-bottom"]': {
    gridTemplateRows: '1fr auto',
    gridTemplateAreas: '"chart" "legend"',
  },
  '&[data-layout="chart-only"]': {
    gridTemplateAreas: '"chart"',
  },
  '&[data-layout="legend-start"]': {
    gridTemplateColumns: 'auto var(--ChartsWrapper-chartCol)',
    gridTemplateAreas: '"legend chart"',
  },
  '&[data-layout="legend-end"]': {
    gridTemplateColumns: 'var(--ChartsWrapper-chartCol) auto',
    gridTemplateAreas: '"chart legend"',
  },
  '&[data-h="start"]': { justifyItems: 'start' },
  '&[data-h="end"]': { justifyItems: 'end' },
  '&[data-v="top"]': { alignItems: 'flex-start' },
  '&[data-v="bottom"]': { alignItems: 'flex-end' },
  [`&:has(.${chartsToolbarClasses.root})`]: {
    '&[data-layout="chart-only"]': {
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: '"toolbar" "chart"',
    },
    '&[data-layout="legend-top"]': {
      gridTemplateRows: 'auto auto 1fr',
      gridTemplateAreas: '"toolbar" "legend" "chart"',
    },
    '&[data-layout="legend-bottom"]': {
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateAreas: '"toolbar" "chart" "legend"',
    },
    '&[data-layout="legend-start"]': {
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: '"toolbar toolbar" "legend chart"',
    },
    '&[data-layout="legend-end"]': {
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: '"toolbar toolbar" "chart legend"',
    },
  },
  [`& .${chartsToolbarClasses.root}`]: {
    gridArea: 'toolbar',
    justifySelf: 'center',
  },
  variants: [
    {
      props: { extendVertically: true },
      style: {
        height: '100%',
        minHeight: 0,
      },
    },
  ],
});

/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
const ChartsWrapper = React.forwardRef<HTMLDivElement, ChartsWrapperProps>(
  function ChartsWrapper(props, ref) {
    const {
      children,
      sx,
      extendVertically,
      hideLegend,
      legendDirection,
      legendPosition,
      ...other
    } = props;

    const chartRootRef = useChartRootRef();
    const handleRef = useForkRef(chartRootRef, ref);

    const store = useStore();

    const propsWidth = store.use(selectorChartPropsWidth);
    const propsHeight = store.use(selectorChartPropsHeight);

    let dataLayout: 'chart-only' | 'legend-top' | 'legend-bottom' | 'legend-start' | 'legend-end';
    if (hideLegend) {
      dataLayout = 'chart-only';
    } else if (legendDirection === 'vertical') {
      dataLayout = legendPosition?.horizontal === 'start' ? 'legend-start' : 'legend-end';
    } else {
      dataLayout = legendPosition?.vertical === 'bottom' ? 'legend-bottom' : 'legend-top';
    }

    return (
      <Root
        {...other}
        ref={handleRef}
        sx={sx}
        extendVertically={extendVertically ?? propsHeight === undefined}
        data-layout={dataLayout}
        data-h={legendPosition?.horizontal}
        data-v={legendPosition?.vertical}
        data-fixed-width={propsWidth ? '' : undefined}
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
