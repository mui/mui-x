'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, useTheme, Theme, styled } from '@mui/material/styles';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { useTicks, TickItemType } from '../hooks/useTicks';
import { AxisDefaultized, ChartsXAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { getMinXTranslation } from '../internals/geometry';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { isInfinity } from '../internals/isInfinity';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { useXAxes } from '../hooks/useAxis';

const useUtilityClasses = (ownerState: ChartsXAxisProps & { theme: Theme }) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionX', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};

function getVisibleLabels(
  xTicks: TickItemType[],
  {
    tickLabelStyle: style,
    tickLabelInterval,
    reverse,
    measurements,
  }: Pick<ChartsXAxisProps, 'tickLabelInterval' | 'tickLabelStyle'> &
    Pick<AxisDefaultized, 'reverse'> & {
      measurements: Map<number, { width: number; height: number }>;
    },
): Set<number> {
  const visibleLabels = new Set<number>();
  if (typeof tickLabelInterval === 'function') {
    xTicks.forEach((item, index) => {
      const isLabelVisible = tickLabelInterval(item.value, index);

      if (isLabelVisible) {
        visibleLabels.add(index);
      }
    });

    return visibleLabels;
  }

  // Filter label to avoid overlap
  let currentTextLimit = 0;
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;
  xTicks.forEach((item, labelIndex) => {
    const { width, height } = measurements.get(labelIndex) ?? { width: 0, height: 0 };
    const { offset, labelOffset } = item;

    const distance = getMinXTranslation(width, height, style?.angle);
    const textPosition = offset + labelOffset;
    const gapRatio = 1.2; // Ratio applied to the minimal distance to add some margin.

    currentTextLimit = textPosition - (direction * (gapRatio * distance)) / 2;
    if (labelIndex > 0 && direction * currentTextLimit < direction * previousTextLimit) {
      // Except for the first label, we skip all label that overlap with the last accepted.
      // Notice that the early return prevents `previousTextLimit` from being updated.
      return;
    }

    visibleLabels.add(labelIndex);
    previousTextLimit = textPosition + (direction * (gapRatio * distance)) / 2;
  });

  return visibleLabels;
}

const XAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsXAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const defaultProps = {
  position: 'bottom',
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
} as const;

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsXAxis API](https://mui.com/x/api/charts/charts-x-axis/)
 */
function ChartsXAxis(inProps: ChartsXAxisProps) {
  const { xAxis, xAxisIds } = useXAxes();
  const { scale: xScale, tickNumber, reverse, ...settings } = xAxis[inProps.axisId ?? xAxisIds[0]];

  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const {
    position,
    disableLine,
    disableTicks,
    tickLabelStyle,
    label,
    labelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement,
    sx,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });
  const { left, top, width, height } = useDrawingArea();
  const { instance } = useChartContext();
  const [needsMeasuring, setNeedsMeasuring] = React.useState(true);
  const labelRefsMapRef = React.useRef(new Map<number, SVGGraphicsElement>());

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const positionSign = position === 'bottom' ? 1 : -1;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: {
        fontSize: 12,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        ...tickLabelStyle,
      },
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });
  const [prevTickLabelStyle, setPrevTickLabelStyle] = React.useState(axisTickLabelProps.style);

  const xTicks = useTicks({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
  });
  const [measurements, setMeasurements] = React.useState(
    new Map<number, { width: number; height: number }>(),
  );

  React.useLayoutEffect(
    function measureTicks() {
      if (needsMeasuring) {
        setMeasurements(
          new Map(
            xTicks.map(function measureTick(_, index) {
              const labelRef = labelRefsMapRef.current.get(index);
              const bbox = labelRef?.getBBox() ?? { width: 0, height: 0 };

              return [index, { width: bbox.width, height: bbox.height }] as const;
            }),
          ),
        );
        setNeedsMeasuring(false);
      }
    },
    [needsMeasuring, xTicks],
  );

  if (!fastObjectShallowCompare(prevTickLabelStyle ?? null, axisTickLabelProps.style ?? null)) {
    setPrevTickLabelStyle(axisTickLabelProps.style);
    setNeedsMeasuring(true);
  }

  const visibleLabels = getVisibleLabels(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    reverse,
    measurements,
  });

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * (tickSize + 22),
  };

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: {
        fontSize: 14,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        ...labelStyle,
      },
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const domain = xScale.domain();
  const ordinalAxis = isBandScale(xScale);
  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  if ((ordinalAxis && domain.length === 0) || (!ordinalAxis && domain.some(isInfinity))) {
    return null;
  }
  return (
    <XAxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height : top})`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line x1={left} x2={left + width} className={classes.line} {...slotProps?.axisLine} />
      )}

      {xTicks.map(({ formattedValue, offset, labelOffset }, index) => {
        const isLabelVisible = visibleLabels.has(index);
        const xTickLabel = labelOffset ?? 0;
        const yTickLabel = positionSign * (tickSize + 3);

        const showTick = instance.isPointInside({ x: offset, y: -1 }, { direction: 'x' });
        const showTickLabel = instance.isPointInside(
          { x: offset + xTickLabel, y: -1 },
          { direction: 'x' },
        );
        return (
          <g key={index} transform={`translate(${offset}, 0)`} className={classes.tickContainer}>
            {!disableTicks && showTick && (
              <Tick
                y2={positionSign * tickSize}
                className={classes.tick}
                {...slotProps?.axisTick}
              />
            )}

            {needsMeasuring || (formattedValue !== undefined && isLabelVisible && showTickLabel) ? (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                {...axisTickLabelProps}
                measuring={needsMeasuring}
                ref={(ref) => {
                  const labelRefsMap = labelRefsMapRef.current;

                  if (ref == null) {
                    labelRefsMap.delete(index);
                  } else {
                    labelRefsMap.set(index, ref);
                  }
                }}
                text={formattedValue?.toString() ?? ''}
              />
            ) : null}
          </g>
        );
      })}

      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </XAxisRoot>
  );
}

ChartsXAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
  /**
   * Position of the axis.
   */
  position: PropTypes.oneOf(['bottom', 'top']),
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
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: PropTypes.string,
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

export { ChartsXAxis };
