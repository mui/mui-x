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
  ChartsRotationAxisProps,
  ChartsAxisSlots,
  ChartsAxisSlotProps,
  D3Scale,
} from '../models/axis';
import { useUtilityClasses } from './chartsRotationAxisClasses';
import { createGetLabelTextAnchors } from '../ChartsRadiusAxis/createGetLabelTextAnchors';
import { getLabelTransform } from './getLabelTransform';

export interface ChartsRotationAxisSlots extends ChartsAxisSlots {}

export interface ChartsRotationAxisSlotProps extends ChartsAxisSlotProps {}

/* Gap between a tick and its label. */
const TICK_LABEL_GAP = 3;

const getLabelTextAnchors = createGetLabelTextAnchors(getLabelTransform);

function ChartsRotationAxis(props: ChartsRotationAxisProps) {
  const rotationAxis = useRotationAxis(props.axisId);

  const settings = { ...rotationAxis, ...props };
  const {
    disableLine,
    disableTicks,
    position = 'outside',
    tickLabelPosition = position === 'outside' ? 'after' : 'before',
    tickPosition = position === 'outside' ? 'after' : 'before',
    tickSize = 6,
    className,
    classes: classesProp,
  } = settings;

  const classes = useUtilityClasses({ classes: classesProp });
  const theme = useTheme();
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const radiusAxis = useRadiusAxis();

  const ticks = useTicks({
    scale: rotationAxis!.scale satisfies D3Scale,
    tickNumber: rotationAxis?.tickNumber ?? 5,
    tickInterval: rotationAxis?.tickInterval,
    tickSpacing: rotationAxis?.tickSpacing,
    valueFormatter: rotationAxis?.valueFormatter,
    direction: 'rotation',
  });

  if (!rotationAxis || !radiusAxis || settings.position === 'none') {
    return null;
  }

  const radius = radiusAxis.scale.range()[position === 'inside' ? 0 : 1];
  const [startAngle, endAngle] = rotationAxis.scale.range();

  const stroke = (theme.vars ?? theme).palette.text.primary;

  // Convert "0 = up" convention to SVG coordinates (y-down).
  const angleToPoint = (angle: number, r: number) => ({
    x: cx + Math.sin(angle) * r,
    y: cy - Math.cos(angle) * r,
  });

  const sweepFlag = endAngle - startAngle >= 0 ? 1 : 0;

  const start = angleToPoint(startAngle, radius);
  const end = angleToPoint(endAngle, radius);
  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const arcPath =
    `M ${start.x} ${start.y} ` +
    `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;

  return (
    <g className={clsx(classes.root, className)}>
      {!disableLine &&
        (rotationAxis.isFullCircle ? (
          // Use a circle to avoid degenerated arcs when start and end angles are the same or very close.
          <circle cx={cx} cy={cy} r={radius} stroke={stroke} fill="none" className={classes.line} />
        ) : (
          <path d={arcPath} stroke={stroke} fill="none" className={classes.line} />
        ))}
      {ticks.map(({ offset: angle, labelOffset, formattedValue }, index) => {
        if (!formattedValue) {
          return null;
        }

        // Convert "0 = up" convention to SVG math angle (0 = right, clockwise y-down).
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);

        const labelDx = labelOffset === 0 ? dx : Math.sin(angle + labelOffset);
        const labelDy = labelOffset === 0 ? dy : -Math.cos(angle + labelOffset);

        const tx = cx + dx * radius;
        const ty = cy + dy * radius;

        const tickDx = (tickPosition === 'after' ? 1 : -1) * dx * tickSize;
        const tickDy = (tickPosition === 'after' ? 1 : -1) * dy * tickSize;

        let tickLabelRadius = radius + (tickLabelPosition === 'after' ? 1 : -1) * TICK_LABEL_GAP;

        if (tickLabelPosition === tickPosition && !disableTicks) {
          // Add the size of the tick if they are in the same direction.
          tickLabelRadius += tickSize;
        }

        // Compute the label position.
        const labelX = cx + labelDx * tickLabelRadius;
        const labelY = cy + labelDy * tickLabelRadius;

        return (
          <g key={index} className={classes.tickContainer}>
            {!disableTicks && (
              <line
                x1={tx}
                y1={ty}
                x2={tx + tickDx}
                y2={ty + tickDy}
                stroke={stroke}
                className={classes.tick}
              />
            )}
            <text
              x={labelX}
              y={labelY}
              fill={stroke}
              fontSize={12}
              className={classes.tickLabel}
              pointerEvents="none"
              {...getLabelTextAnchors(labelDx, labelDy, tickLabelPosition)}
            >
              {formattedValue}
            </text>
          </g>
        );
      })}
    </g>
  );
}

ChartsRotationAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axis: PropTypes.oneOf(['rotation']),
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
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The end angle (in deg).
   */
  endAngle: PropTypes.number,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The gap between the axis and the label.
   */
  labelGap: PropTypes.number,
  /**
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
  /**
   * The position of the rotation axis.
   * It can be 'inside' or 'outside'.
   * @default 'outside'
   */
  position: PropTypes.oneOf(['inside', 'none', 'outside']),
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
   * The start angle (in deg).
   */
  startAngle: PropTypes.number,
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
   * `'after'` places them outside the arc, `'before'` inside.
   * @default position === 'outside' ? 'after' : 'before'
   */
  tickLabelPosition: PropTypes.oneOf(['after', 'before']),
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
   * `'after'` places them outside the arc, `'before'` inside.
   * @default position === 'outside' ? 'after' : 'before'
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

export { ChartsRotationAxis };
