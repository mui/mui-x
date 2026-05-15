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

export interface ChartsWrapperOwnerState extends Pick<
  ChartsWrapperProps,
  'hideLegend' | 'legendDirection' | 'legendPosition'
> {}

const JUSTIFY_ITEMS: Record<string, string> = { start: 'start', end: 'end' };
const ALIGN_ITEMS: Record<string, string> = { top: 'flex-start', bottom: 'flex-end' };

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'extendVertically' && prop !== 'width',
})<{ ownerState: ChartsWrapperOwnerState; extendVertically: boolean; width?: number }>(({
  ownerState,
  width,
}) => {
  const { hideLegend, legendDirection: direction, legendPosition: position } = ownerState;
  const drawingCol = width ? 'auto' : '1fr';
  const vertical = direction === 'vertical';

  let areas: string;
  let rows: string;
  let columns: string;
  let twoColumns = false;

  if (hideLegend) {
    areas = '"chart"';
    rows = '1fr';
    columns = drawingCol;
  } else if (vertical) {
    rows = '1fr';
    twoColumns = true;
    if (position?.horizontal === 'start') {
      areas = '"legend chart"';
      columns = `auto ${drawingCol}`;
    } else {
      areas = '"chart legend"';
      columns = `${drawingCol} auto`;
    }
  } else if (position?.vertical === 'bottom') {
    areas = '"chart" "legend"';
    rows = '1fr auto';
    columns = drawingCol;
  } else {
    areas = '"legend" "chart"';
    rows = 'auto 1fr';
    columns = drawingCol;
  }

  return {
    flex: 1,
    display: 'grid',
    gridTemplateAreas: areas,
    gridTemplateRows: rows,
    gridTemplateColumns: columns,
    justifyContent: 'safe center',
    justifyItems: JUSTIFY_ITEMS[position?.horizontal ?? ''] ?? 'center',
    alignItems: ALIGN_ITEMS[position?.vertical ?? ''] ?? 'center',
    [`&:has(.${chartsToolbarClasses.root})`]: {
      gridTemplateRows: `auto ${rows}`,
      gridTemplateAreas: `${twoColumns ? '"toolbar toolbar"' : '"toolbar"'} ${areas}`,
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
  };
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

    const ownerState = React.useMemo(
      () => ({
        hideLegend,
        legendDirection,
        legendPosition,
      }),
      [hideLegend, legendDirection, legendPosition],
    );

    return (
      <Root
        ref={handleRef}
        ownerState={ownerState}
        sx={sx}
        extendVertically={extendVertically ?? propsHeight === undefined}
        width={propsWidth}
        {...other}
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
