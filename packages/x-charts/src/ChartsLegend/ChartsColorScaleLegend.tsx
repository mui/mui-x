import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { AnchorPosition, Direction } from './utils';
import { DefaultizedProps } from '../models/helpers';
import { useDrawingArea } from '../hooks';
import { useCartesianContext } from '../context/CartesianProvider';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { AxisDefaultized, AxisId } from '../models/axis';

import {
  ChartsColorScaleLegendRenderProps,
  DefaultChartsColorScaleLegend,
} from './DefaultChartsColorScaleLegend';
import { ZAxisDefaultized } from '../models/z-axis';
import { ChartsLegendClasses, getLegendUtilityClass } from './chartsLegendClasses';

export interface ChartsColorScaleLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default DefaultChartsColorScaleLegend
   */
  legend?: React.JSXElementConstructor<ChartsColorScaleLegendRenderProps>;
}

export interface ChartsColorScaleLegendSlotProps {
  legend?: Partial<ChartsColorScaleLegendRenderProps>;
}

export type ChartsColorScaleLegendProps = {
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection?: 'x' | 'y' | 'z';
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId?: AxisId;
  /**
   * The position of the legend.
   */
  position?: AnchorPosition;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLegendClasses>;
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden?: boolean;
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsColorScaleLegendSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsColorScaleLegendSlotProps;
};

type DefaultizedChartsColorScaleLegendProps = DefaultizedProps<
  ChartsColorScaleLegendProps,
  'direction' | 'position'
>;

const useUtilityClasses = (
  ownerState: DefaultizedChartsColorScaleLegendProps & { theme: Theme },
) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export function useAxis(
  direction: ChartsColorScaleLegendProps['axisDirection'],
  axisId: ChartsColorScaleLegendProps['axisId'],
): ZAxisDefaultized | AxisDefaultized {
  const { xAxis, xAxisIds, yAxis, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  switch (direction) {
    case 'x': {
      const id = typeof axisId === 'string' ? axisId : xAxisIds[axisId ?? 0];
      return xAxis[id];
    }
    case 'y': {
      const id = typeof axisId === 'string' ? axisId : yAxisIds[axisId ?? 0];
      return yAxis[id];
    }
    case 'z':
    default: {
      const id = typeof axisId === 'string' ? axisId : zAxisIds[axisId ?? 0];
      return zAxis[id];
    }
  }
}

const defaultProps = {
  position: { horizontal: 'middle', vertical: 'top' },
  direction: 'row',
  axisDirection: 'z',
} as const;

function ChartsColorScaleLegend(inProps: ChartsColorScaleLegendProps) {
  const props: DefaultizedChartsColorScaleLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiChartsColorScaleLegend',
  });

  const { axisDirection, axisId, position, direction, hidden, slots, slotProps } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const drawingArea = useDrawingArea();

  const axisItem = useAxis(axisDirection, axisId);

  const ChartLegendRender = slots?.legend ?? DefaultChartsColorScaleLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: {
      position,
      direction,
      classes,
      drawingArea,
      hidden,
      axisItem,
    },
    ownerState: {},
  });

  return <ChartLegendRender {...chartLegendRenderProps} />;
}

ChartsColorScaleLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { ChartsColorScaleLegend };
