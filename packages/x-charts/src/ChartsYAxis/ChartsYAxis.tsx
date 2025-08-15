'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme, styled } from '@mui/material/styles';
import { warnOnce } from '@mui/x-internals/warning';
import { ChartsYAxisProps } from '../models/axis';
import { ChartsSingleYAxis } from './ChartsSingleYAxis';
import { ChartsGroupedYAxis } from './ChartsGroupedYAxis';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { defaultProps, useUtilityClasses } from './utilities';
import { isInfinity } from '../internals/isInfinity';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { useYAxes } from '../hooks';
import { isBandScale } from '../internals/isBandScale';
import { getStringSize } from '../internals/domUtils';
import { AxisRoot } from '../internals/components/AxisSharedComponents';

const YAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsYAxis',
  slot: 'Root',
})({});

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsYAxis API](https://mui.com/x/api/charts/charts-y-axis/)
 */
function ChartsYAxis(inProps: ChartsYAxisProps) {
  const { yAxis, yAxisIds } = useYAxes();
  const drawingArea = useDrawingArea();
  const isHydrated = useIsHydrated();

  const { scale: yScale, tickNumber, reverse, ...settings } = yAxis[inProps.axisId ?? yAxisIds[0]];
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsYAxis' });
  const defaultizedProps = { ...defaultProps, ...themedProps };
  const classes = useUtilityClasses(defaultizedProps);

  const { left, top, width, height } = drawingArea;
  const theme = useTheme();

  const {
    position,
    disableLine,
    label,
    labelStyle,
    offset,
    width: axisWidth,
    sx,
    slots,
    slotProps,
  } = defaultizedProps;

  const positionSign = position === 'right' ? 1 : -1;
  const Line = slots?.axisLine ?? 'line';
  const Label = slots?.axisLabel ?? ChartsText;

  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square' as const,
    },
    ownerState: {},
  });
  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: {
        ...theme.typography.body1,
        lineHeight: 1,
        fontSize: 14,
        angle: positionSign * 90,
        textAnchor: 'middle',
        dominantBaseline: 'text-before-edge',
        ...labelStyle,
      },
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const axis = yAxis[inProps.axisId ?? yAxisIds[0]];
  if (!axis) {
    warnOnce(`MUI X Charts: No axis found. The axisId "${inProps.axisId}" is probably invalid.`);
    return null;
  }

  const domain = yScale.domain();
  const isScaleBand = isBandScale(yScale);
  const skipAxisRendering =
    (isScaleBand && domain.length === 0) ||
    (!isScaleBand && domain.some(isInfinity)) ||
    position === 'none';

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (skipAxisRendering) {
    return null;
  }

  const labelRefPoint = {
    x: positionSign * axisWidth,
    y: top + height / 2,
  };

  const axisLabelHeight = label == null ? 0 : getStringSize(label, axisLabelProps.style).height;

  const children =
    'groups' in axis && Array.isArray(axis.groups) ? (
      <ChartsGroupedYAxis {...inProps} />
    ) : (
      <ChartsSingleYAxis {...inProps} axisLabelHeight={axisLabelHeight} />
    );

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps} />}
      {children}
      {label && isHydrated && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </YAxisRoot>
  );
}

ChartsYAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axis: PropTypes.oneOf(['y']),
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Defines which ticks are displayed.
   * Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has "point" scale.
   * - an array containing the values where ticks should be displayed.
   * @see See {@link https://mui.com/x/react-charts/axis/#fixed-tick-positions}
   * @default 'auto'
   */
  tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle: PropTypes.object,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: PropTypes.number,
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: PropTypes.number,
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: PropTypes.number,
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { ChartsYAxis };
