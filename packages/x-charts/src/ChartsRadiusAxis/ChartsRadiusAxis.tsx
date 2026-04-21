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
import { getLabelTransform } from './getLabelTransform';
import { RadialAxisLabel } from '../internals/components/RadialAxisLabel';

export interface ChartsRadiusAxisProps {
  /**
   * Id of the radius axis to render.
   * If not provided, it will use the first defined radius axis.
   */
  axisId?: AxisId;
  /**
   * The angle (in degrees) along which the tick labels are rendered.
   * By default, uses the start angle of the rotation axis.
   */
  angle?: number;
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

export function ChartsRadiusAxis(props: ChartsRadiusAxisProps) {
  const {
    axisId,
    angle: angleProp,
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

  // Angle in radians. 0 = up (north). Default to rotation axis start angle.
  const angle =
    angleProp !== undefined ? (angleProp * Math.PI) / 180 : (rotationAxis?.scale.range()[0] ?? 0);
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
        if (!isCentered && tickLabelPosition === tickPosition) {
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
            <foreignObject
              x={labelX}
              y={labelY}
              width={1}
              height={1}
              style={{ overflow: 'visible', pointerEvents: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                }}
              >
                <RadialAxisLabel
                  className={classes.tickLabel}
                  variant="caption"
                  {...getLabelTransform(dx, dy, tickLabelPosition)}
                >
                  {formattedValue}
                </RadialAxisLabel>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </g>
  );
}
