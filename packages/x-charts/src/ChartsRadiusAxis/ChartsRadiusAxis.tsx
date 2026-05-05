'use client';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { useTicks } from '../hooks/useTicks';
import { useRadiusAxis, useRotationAxis } from '../hooks/useAxis';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type { AxisId, D3Scale } from '../models/axis';
import { type ChartsRadialAxisClasses, useUtilityClasses } from './chartsRadiusAxisClasses';
import { createGetLabelTextAnchors } from './createGetLabelTextAnchors';
import { getLabelTransform } from './getLabelTransform';

export interface ChartsRadiusAxisProps {
  /**
   * Id of the radius axis to render.
   * If not provided, it will use the first defined radius axis.
   */
  axisId?: AxisId;
  /**
   * The position of the axis in polar coordinates.
   * It can be 'start', 'end', or a specific angle in degrees.
   * @default 'start'
   */
  position?: 'start' | 'end' | number;
  /**
   * If `true`, the axis line is not rendered.
   * @default false
   */
  disableLine?: boolean;
  /**
   * If `true`, the ticks are not rendered.
   * @default false
   */
  disableTicks?: boolean;
  /**
   * The size (in pixels) of the tick marks.
   * @default 6
   */
  tickSize?: number;
  /**
   * Set the position of the tick labels relative to the axis line.
   * The before/after is defined based on clockwise direction.
   * @default 'after'
   */
  tickLabelPosition?: 'center' | 'after' | 'before';
  /**
   * Set the position of the tick relative to the axis line.
   * The before/after is defined based on clockwise direction.
   * @default 'after'
   */
  tickPosition?: 'after' | 'before';
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  classes?: Partial<ChartsRadialAxisClasses>;
}

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

export function ChartsRadiusAxis(props: ChartsRadiusAxisProps) {
  const {
    axisId,
    position = 'start',
    disableLine,
    disableTicks,
    tickLabelPosition = 'after',
    tickPosition = 'after',
    tickSize = 6,
    className,
    classes: classesProp,
  } = props;

  const isCentered = tickLabelPosition === 'center';
  const classes = useUtilityClasses({ classes: classesProp, isCentered });
  const theme = useTheme();
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const radiusAxis = useRadiusAxis(axisId);
  const rotationAxis = useRotationAxis();

  const ticks = useTicks({
    scale: radiusAxis!.scale satisfies D3Scale,
    tickNumber: radiusAxis?.tickNumber ?? 5,
    tickInterval: radiusAxis?.tickInterval,
    tickSpacing: radiusAxis?.tickSpacing,
    valueFormatter: radiusAxis?.valueFormatter,
    direction: 'radius',
  });

  if (!radiusAxis) {
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
      {ticks.map(({ offset: radius, formattedValue }, index) => {
        if (!formattedValue) {
          return null;
        }

        const tx = cx + dx * radius;
        const ty = cy + dy * radius;

        // Compute the label position.
        let labelX = tx;
        let labelY = ty;

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
              {...getLabelTextAnchors(dx, dy, tickLabelPosition)}
            >
              {formattedValue}
            </text>
          </g>
        );
      })}
    </g>
  );
}
