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
}

const TICK_LABEL_GAP = 4;

/**
 * Return the `transform` style value for a tick label at a given position.
 * @param px The normalized x position to the axis line (between -1 and 1).
 * @param py The normalized y position to the axis line (between -1 and 1).
 * @param center If true, the tick labels are centered on it's position.
 * @returns The `transform` style value for the tick label.
 */
function getTransform(px: number, py: number, center: boolean) {
  if (center) {
    return 'translate(-50%, -50%)';
  }

  let translateX = '-50%';
  let translateY = '-50%';
  if (px > 0.3) {
    translateY = '0';
  } else if (px < -0.3) {
    translateY = `-100%`;
  }

  if (py > 0.3) {
    translateX = `-100%`;
  } else if (py < -0.3) {
    translateX = '0';
  }

  return `translate(${translateX}, ${translateY})`;
}

/**
 * Renders a radius axis with tick labels along a given angle of a polar chart.
 *
 * Demos:
 *
 * - [Radar](https://mui.com/x/react-charts/radar/)
 */
function ChartsRadiusAxis(props: ChartsRadiusAxisComponentProps) {
  const {
    axisId,
    angle: angleProp,
    disableLine,
    disableTicks,
    center,
    tickSize = 6,
    className,
  } = props;

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

  const fill = (theme.vars ?? theme).palette.text.primary;
  const stroke = (theme.vars ?? theme).palette.text.primary;
  const paperBackground = (theme.vars ?? theme).palette.background.paper;

  return (
    <g className={clsx('MuiChartsRadiusAxis-root', className)}>
      {!disableLine && (
        <line
          x1={cx + dx * innerRadius}
          y1={cy + dy * innerRadius}
          x2={cx + dx * outerRadius}
          y2={cy + dy * outerRadius}
          stroke={stroke}
          strokeOpacity={0.3}
          shapeRendering="crispEdges"
        />
      )}
      {ticks.map(({ offset: radius, formattedValue }, index) => {
        if (formattedValue === undefined) {
          return null;
        }
        const tx = cx + dx * radius;
        const ty = cy + dy * radius;
        const labelX = tx + (center ? 0 : px * (tickSize + TICK_LABEL_GAP));
        const labelY = ty + (center ? 0 : py * (tickSize + TICK_LABEL_GAP));
        return (
          <g key={index}>
            {!disableTicks && (
              <line
                x1={tx}
                y1={ty}
                x2={tx + px * tickSize}
                y2={ty + py * tickSize}
                stroke={stroke}
                strokeOpacity={0.6}
                shapeRendering="crispEdges"
              />
            )}
            <circle cx={labelX} cy={labelY} r={2} fill={'red'} />
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
                <span
                  style={{
                    position: 'fixed',
                    transform: getTransform(dx, dy, Boolean(center)),
                    fontSize: 12,
                    lineHeight: 1,
                    color: fill,
                    backgroundColor: center ? paperBackground : 'transparent',
                    padding: '2px 4px',
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formattedValue}
                </span>
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
