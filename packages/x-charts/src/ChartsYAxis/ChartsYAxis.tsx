'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, styled, useTheme } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { getDefaultBaseline, getDefaultTextAnchor } from '../ChartsText/defaultTextPlacement';
import { doesTextFitInRect, ellipsize } from '../internals/ellipsize';
import { getStringSize } from '../internals/domUtils';
import { TickItemType, useTicks } from '../hooks/useTicks';
import { ChartDrawingArea, useDrawingArea } from '../hooks/useDrawingArea';
import { AxisConfig, ChartsYAxisProps } from '../models/axis';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText, ChartsTextProps, ChartsTextStyle } from '../ChartsText';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { isInfinity } from '../internals/isInfinity';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider';
import { useYAxes } from '../hooks';
import { clampAngle } from '../internals/clampAngle';

const useUtilityClasses = (ownerState: AxisConfig<any, any, ChartsYAxisProps>) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionY', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};

/* Gap between a tick and its label. */
const TICK_LABEL_GAP = 2;
/* Gap between the axis label and tick labels. */
const AXIS_LABEL_TICK_LABEL_GAP = 2;

function shortenLabels(
  visibleLabels: TickItemType[],
  drawingArea: Pick<ChartDrawingArea, 'top' | 'height' | 'bottom'>,
  maxWidth: number,
  tickLabelStyle: ChartsYAxisProps['tickLabelStyle'],
) {
  const shortenedLabels = new Map<TickItemType, string>();
  const angle = clampAngle(tickLabelStyle?.angle ?? 0);

  let topBoundModifier = 1;
  let bottomBoundModifier = 1;

  if (tickLabelStyle?.textAnchor === 'start') {
    topBoundModifier = Infinity;
    bottomBoundModifier = 1;
  } else if (tickLabelStyle?.textAnchor === 'end') {
    topBoundModifier = 1;
    bottomBoundModifier = Infinity;
  } else {
    topBoundModifier = 2;
    bottomBoundModifier = 2;
  }

  if (angle > 90 && angle < 270) {
    [topBoundModifier, bottomBoundModifier] = [bottomBoundModifier, topBoundModifier];
  }

  for (const item of visibleLabels) {
    if (item.formattedValue) {
      // That maximum width of the tick depends on its proximity to the axis bounds.
      const height = Math.min(
        (item.offset + item.labelOffset) * topBoundModifier,
        (drawingArea.top +
          drawingArea.height +
          drawingArea.bottom -
          item.offset -
          item.labelOffset) *
          bottomBoundModifier,
      );

      const doesTextFit = (text: string) =>
        doesTextFitInRect(text, {
          width: maxWidth,
          height,
          angle,
          measureText: (string: string) => getStringSize(string, tickLabelStyle),
        });

      shortenedLabels.set(item, ellipsize(item.formattedValue.toString(), doesTextFit));
    }
  }

  return shortenedLabels;
}

function invertTextAnchor(
  textAnchor: ChartsTextStyle['textAnchor'],
): ChartsTextStyle['textAnchor'] {
  switch (textAnchor) {
    case 'start':
      return 'end';
    case 'end':
      return 'start';
    default:
      return textAnchor;
  }
}

const YAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsYAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const defaultProps = {
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
 * - [ChartsYAxis API](https://mui.com/x/api/charts/charts-y-axis/)
 */
function ChartsYAxis(inProps: ChartsYAxisProps) {
  const { yAxisIds, yAxis } = useYAxes();
  const { scale: yScale, tickNumber, ...settings } = yAxis[inProps.axisId ?? yAxisIds[0]];

  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsYAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const {
    position,
    disableLine,
    disableTicks,
    label,
    labelStyle,
    tickLabelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval,
    sx,
    offset,
    width: axisWidth,
  } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const isHydrated = useIsHydrated();

  const classes = useUtilityClasses(defaultizedProps);

  const { instance } = useChartContext();
  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const yTicks = useTicks({
    scale: yScale,
    tickNumber,
    valueFormatter,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
  });

  const positionSign = position === 'right' ? 1 : -1;

  const tickFontSize = typeof tickLabelStyle?.fontSize === 'number' ? tickLabelStyle.fontSize : 12;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const defaultTextAnchor = getDefaultTextAnchor(
    (position === 'right' ? -90 : 90) - (tickLabelStyle?.angle ?? 0),
  );
  const defaultDominantBaseline = getDefaultBaseline(
    (position === 'right' ? -90 : 90) - (tickLabelStyle?.angle ?? 0),
  );

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: {
        ...theme.typography.caption,
        fontSize: tickFontSize,
        textAnchor: isRtl ? invertTextAnchor(defaultTextAnchor) : defaultTextAnchor,
        dominantBaseline: defaultDominantBaseline,
        ...tickLabelStyle,
      },
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
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
        dominantBaseline: 'auto',
        ...labelStyle,
      } as Partial<ChartsTextProps>['style'],
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const lineSlotProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square' as const,
    },
    ownerState: {},
  });

  const domain = yScale.domain();
  const ordinalAxis = isBandScale(yScale);

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is 'none'.
  if (
    (ordinalAxis && domain.length === 0) ||
    (!ordinalAxis && domain.some(isInfinity)) ||
    position === 'none'
  ) {
    return null;
  }

  const labelHeight = label ? getStringSize(label, axisLabelProps.style).height : 0;
  const labelRefPoint = {
    x: positionSign * (axisWidth - labelHeight),
    y: top + height / 2,
  };
  /* If there's an axis title, the tick labels have less space to render  */
  const tickLabelsMaxWidth = Math.max(
    0,
    axisWidth - labelHeight - tickSize - TICK_LABEL_GAP - AXIS_LABEL_TICK_LABEL_GAP,
  );

  const tickLabels = isHydrated
    ? shortenLabels(yTicks, drawingArea, tickLabelsMaxWidth, axisTickLabelProps.style)
    : new Map();

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line y1={top} y2={top + height} className={classes.line} {...lineSlotProps} />
      )}

      {yTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset, value } = item;
        const xTickLabel = positionSign * (tickSize + TICK_LABEL_GAP);
        const yTickLabel = labelOffset;
        const skipLabel =
          typeof tickLabelInterval === 'function' && !tickLabelInterval?.(value, index);

        const showLabel = instance.isPointInside({ x: -1, y: tickOffset }, { direction: 'y' });
        const tickLabel = tickLabels.get(item);

        if (!showLabel) {
          return null;
        }

        return (
          <g
            key={index}
            transform={`translate(0, ${tickOffset})`}
            className={classes.tickContainer}
          >
            {!disableTicks && (
              <Tick
                x2={positionSign * tickSize}
                className={classes.tick}
                {...slotProps?.axisTick}
              />
            )}

            {tickLabel !== undefined && !skipLabel && (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                data-testid="ChartsYAxisTickLabel"
                text={tickLabel}
                {...axisTickLabelProps}
              />
            )}
          </g>
        );
      })}
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

export { ChartsYAxis };
