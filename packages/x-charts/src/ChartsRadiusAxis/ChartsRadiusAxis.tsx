'use client';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useTicks } from '../hooks/useTicks';
import { useRadiusAxis, useRotationAxis } from '../hooks/useAxis';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type {
  ChartsRadiusAxisProps,
  ChartsAxisSlots,
  ChartsAxisSlotProps,
  D3Scale,
} from '../models/axis';
import { useUtilityClasses } from './chartsRadiusAxisClasses';
import { createGetLabelTextAnchors } from './createGetLabelTextAnchors';
import { getLabelTransform } from './getLabelTransform';

export interface ChartsRadiusAxisSlots extends ChartsAxisSlots {}

export interface ChartsRadiusAxisSlotProps extends ChartsAxisSlotProps {}

/* Gap between a tick and its label. */
const TICK_LABEL_GAP = 3;

const getLabelTextAnchors = createGetLabelTextAnchors(getLabelTransform);

/**
 * Get the angle to use to display the radius axis.
 * @param position The position props
 * @param rotationAxis The default rotation axis
 * @returns the angle in radians to use.
 */
function getAxisAngleInRadians(
  position: ChartsRadiusAxisProps['position'],
  rotationAxis: ReturnType<typeof useRotationAxis>,
) {
  if (position === 'start') {
    return rotationAxis?.scale.range()[0] ?? 0;
  }
  if (position === 'end') {
    return rotationAxis?.scale.range()[1] ?? 0;
  }
  if (typeof position === 'number') {
    return (position * Math.PI) / 180;
  }
  return 0;
}

function ChartsRadiusAxis(props: ChartsRadiusAxisProps) {
  const radiusAxis = useRadiusAxis(props.axisId);

  const settings = { ...radiusAxis, ...props };

  const {
    position = 'start',
    disableLine,
    disableTicks,
    disableTickLabel,
    tickLabelPosition: tickLabelPositionProp = 'auto',
    tickPosition = position === 'start' ? 'before' : 'after',
    tickSize = 6,
    className,
    classes: classesProp,
  } = settings;

  let tickLabelPosition = tickLabelPositionProp;
  if (tickLabelPosition === 'auto') {
    tickLabelPosition = position === 'start' ? 'before' : 'after';
  }
  const isCentered = tickLabelPosition === 'center';
  const classes = useUtilityClasses({ classes: classesProp, isCentered });
  const theme = useTheme();
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const rotationAxis = useRotationAxis();

  const ticks = useTicks({
    scale: radiusAxis!.scale satisfies D3Scale,
    tickNumber: radiusAxis?.tickNumber ?? 5,
    tickInterval: radiusAxis?.tickInterval,
    tickSpacing: radiusAxis?.tickSpacing,
    valueFormatter: radiusAxis?.valueFormatter,
    direction: 'radius',
  });

  if (!radiusAxis || settings.position === 'none') {
    return null;
  }

  const angle = getAxisAngleInRadians(position, rotationAxis);
  // Convert "0 = up" convention to SVG math angle (0 = right, clockwise y-down).
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  // Perpendicular offset for tick marks (rotated 90° clockwise).
  const px = -dy;
  const py = dx;

  const [innerRadius, outerRadius] = radiusAxis.scale.range();

  const stroke = (theme.vars ?? theme).palette.text.primary;

  const tickDx = (tickPosition === 'after' ? 1 : -1) * px * tickSize;
  const tickDy = (tickPosition === 'after' ? 1 : -1) * py * tickSize;

  const tickLabelGap = isCentered ? 0 : TICK_LABEL_GAP;
  const tickLabelGapDx = (tickLabelPosition === 'after' ? 1 : -1) * px * tickLabelGap;
  const tickLabelGapDy = (tickLabelPosition === 'after' ? 1 : -1) * py * tickLabelGap;

  return (
    <g className={clsx(classes.root, className)}>
      {!disableLine && (
        <line
          x1={cx + dx * innerRadius}
          y1={cy + dy * innerRadius}
          x2={cx + dx * outerRadius}
          y2={cy + dy * outerRadius}
          stroke={stroke}
          className={classes.line}
        />
      )}
      {ticks.map(({ offset: radius, labelOffset, formattedValue }, index) => {
        if (!formattedValue) {
          return null;
        }

        const tickX = cx + dx * radius;
        const tickY = cy + dy * radius;

        // Compute the label position.
        let labelX = cx + dx * (radius + labelOffset);
        let labelY = cy + dy * (radius + labelOffset);

        if (tickLabelGap !== 0) {
          labelX += tickLabelGapDx;
          labelY += tickLabelGapDy;
        }
        if (!isCentered && tickLabelPosition === tickPosition && !disableTicks) {
          // Add the size of the tick if they are in the same direction.
          labelX += tickDx;
          labelY += tickDy;
        }

        return (
          <g key={index} className={classes.tickContainer}>
            {!disableTicks && (
              <line
                x1={tickX}
                y1={tickY}
                x2={tickX + tickDx}
                y2={tickY + tickDy}
                stroke={stroke}
                className={classes.tick}
              />
            )}
            {!disableTickLabel && (
              <text
                x={labelX}
                y={labelY}
                fill={stroke}
                fontSize={12}
                className={classes.tickLabel}
                pointerEvents="none"
                {...getLabelTextAnchors(dx, dy, tickLabelPosition)}
              >
                {formattedValue}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

ChartsRadiusAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axis: PropTypes.oneOf(['radius']),
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
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the tick labels are not rendered.
   * @default false
   */
  disableTickLabel: PropTypes.bool,
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
   * The maximal radius.
   * Can be a number (in pixels), a pixel string (for example `'80px'`), or a percentage string
   * (for example `'80%'`) relative to the available radius (half the smallest side of the drawing area).
   * @default '100%'
   */
  maxRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The minimal radius.
   * Can be a number (in pixels), a pixel string (for example `'20px'`), or a percentage string
   * (for example `'20%'`) relative to the available radius (half the smallest side of the drawing area).
   * @default 0
   */
  minRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The position of the axis in polar coordinates.
   * It can be 'start', 'end', or a specific angle in degrees.
   * @default 'start'
   */
  position: PropTypes.oneOfType([PropTypes.oneOf(['end', 'none', 'start']), PropTypes.number]),
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
   * Set the position of the tick labels relative to the axis line.
   * The before/after is defined based on clockwise direction.
   * Using `'auto'` sets it to `'before'` if position is `'start'` and `'after'` otherwise.
   * @default 'auto'
   */
  tickLabelPosition: PropTypes.oneOf(['after', 'auto', 'before', 'center']),
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
   * Set the position of the tick relative to the axis line.
   * The before/after is defined based on clockwise direction.
   * @default position === 'start' ? 'before' : 'after'
   */
  tickPosition: PropTypes.oneOf(['after', 'before']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number,
  /**
   * The minimum space between ticks when using an ordinal scale. It defines the minimum distance in pixels between two ticks.
   * @default 0
   */
  tickSpacing: PropTypes.number,
} as any;

export { ChartsRadiusAxis };
