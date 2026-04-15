'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { useTicks } from '../hooks/useTicks';
import { useRadiusAxis, useRotationAxis } from '../hooks/useAxis';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type { AxisId } from '../models/axis';
import { type ChartsRadiusAxisClasses, useUtilityClasses } from './chartsRadiusAxisClasses';
import { getLabelTransform } from './getLabelTransform';
import { RadialAxisLabel } from '../internals/components/RadialAxisLabel';

export interface ChartsRadiusAxisComponentProps {
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
   * If `true`, the tick labels are centered on the axis line instead of being offset away from it.
   */
  center?: boolean;
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  classes?: Partial<ChartsRadiusAxisClasses>;
}

const TICK_LABEL_GAP = 4;

function ChartsRadiusAxis(props: ChartsRadiusAxisComponentProps) {
  const {
    axisId,
    angle: angleProp,
    disableLine,
    disableTicks,
    center,
    tickSize = 6,
    className,
    classes: classesProp,
  } = props;

  const classes = useUtilityClasses({ classes: classesProp, center });
  const theme = useTheme();
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const radiusAxis = useRadiusAxis(axisId);
  const rotationAxis = useRotationAxis();

  const ticks = useTicks({
    scale: radiusAxis?.scale as any,
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
        const labelX = tx + (center ? 0 : px * (tickSize + TICK_LABEL_GAP));
        const labelY = ty + (center ? 0 : py * (tickSize + TICK_LABEL_GAP));
        return (
          <g key={index} className={classes.tickContainer}>
            {!disableTicks && (
              <line
                x1={tx}
                y1={ty}
                x2={tx + px * tickSize}
                y2={ty + py * tickSize}
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
                  {...getLabelTransform(dx, dy, Boolean(center))}
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

ChartsRadiusAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The angle (in degrees) along which the tick labels are rendered.
   * By default, uses the start angle of the rotation axis.
   */
  angle: PropTypes.number,
  /**
   * Id of the radius axis to render.
   * If not provided, it will use the first defined radius axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * If `true`, the axis line is not rendered.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If `true`, the ticks are not rendered.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The size (in pixels) of the tick marks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { ChartsRadiusAxis };
