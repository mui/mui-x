'use client';
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
import { rotationAxisClasses } from './chartsRotationAxisClasses';

export interface ChartsRotationAxisComponentProps {
  /**
   * Id of the rotation axis to render.
   * If not provided, it will use the first defined rotation axis.
   */
  axisId?: AxisId;
  /**
   * Id of the radius axis used to compute the axis radius.
   * If not provided, it will use the first defined radius axis.
   */
  radiusAxisId?: AxisId;
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
   * A CSS class name applied to the root element.
   */
  className?: string;
}

const TICK_LABEL_GAP = 4;

/**
 * Return the `transform` style value for a tick label at a given position.
 * @param px The normalized x position relative to the axis center (between -1 and 1).
 * @param py The normalized y position relative to the axis center (between -1 and 1).
 * @returns The `transform` style value for the tick label.
 */
function getTransform(px: number, py: number) {
  let translateX = '-50%';
  let translateY = '-50%';
  if (px > 0.3) {
    translateX = '0';
  } else if (px < -0.3) {
    translateX = '-100%';
  }

  if (py > 0.3) {
    translateY = '0';
  } else if (py < -0.3) {
    translateY = '-100%';
  }

  return `translate(${translateX}, ${translateY})`;
}

function ChartsRotationAxis(props: ChartsRotationAxisComponentProps) {
  const { axisId, radiusAxisId, disableLine, disableTicks, tickSize = 6, className } = props;

  const theme = useTheme();
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const rotationAxis = useRotationAxis(axisId);
  const radiusAxis = useRadiusAxis(radiusAxisId);

  const ticks = useTicks({
    scale: rotationAxis?.scale as any,
    tickNumber: rotationAxis?.tickNumber ?? 5,
    tickInterval: rotationAxis?.tickInterval,
    tickSpacing: rotationAxis?.tickSpacing,
    valueFormatter: rotationAxis?.valueFormatter,
    direction: 'rotation',
  });

  if (!rotationAxis || !radiusAxis) {
    return null;
  }

  const radius = radiusAxis.scale.range()[1];
  const [startAngle, endAngle] = rotationAxis.scale.range();

  const fill = (theme.vars ?? theme).palette.text.primary;
  const stroke = (theme.vars ?? theme).palette.text.primary;

  // Convert "0 = up" convention to SVG coordinates (y-down).
  const angleToPoint = (angle: number, r: number) => ({
    x: cx + Math.sin(angle) * r,
    y: cy - Math.cos(angle) * r,
  });

  const isFullCircle = Math.abs(endAngle - startAngle) > 2 * Math.PI - 0.01;
  const sweepFlag = endAngle - startAngle >= 0 ? 1 : 0;

  const start = angleToPoint(startAngle, radius);
  const end = angleToPoint(endAngle, radius);
  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const arcPath =
    `M ${start.x} ${start.y} ` +
    `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;

  return (
    <g className={clsx(rotationAxisClasses.root, className)}>
      {!disableLine &&
        (isFullCircle ? (
          // Use circle to avoid degenerated arcs when start and end angles are the same or very close.
          <circle cx={cx} cy={cy} r={radius} stroke={stroke} fill="none" />
        ) : (
          <path d={arcPath} stroke={stroke} fill="none" />
        ))}
      {ticks.map(({ offset: angle, formattedValue }, index) => {
        if (!formattedValue) {
          return null;
        }

        // Outward radial direction at this angle.
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);

        const tx = cx + dx * radius;
        const ty = cy + dy * radius;
        const labelX = tx + dx * (tickSize + TICK_LABEL_GAP);
        const labelY = ty + dy * (tickSize + TICK_LABEL_GAP);

        return (
          <g key={index} className={rotationAxisClasses.tickContainer}>
            {!disableTicks && (
              <line
                x1={tx}
                y1={ty}
                x2={tx + dx * tickSize}
                y2={ty + dy * tickSize}
                stroke={stroke}
                shapeRendering="crispEdges"
                className={rotationAxisClasses.tick}
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
                <span
                  className={rotationAxisClasses.tickLabel}
                  style={{
                    position: 'fixed',
                    transform: getTransform(dx, dy),
                    fontSize: 12,
                    lineHeight: 1,
                    color: fill,
                    padding: '2px 4px',
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

ChartsRotationAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Id of the rotation axis to render.
   * If not provided, it will use the first defined rotation axis.
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
   * Id of the radius axis used to compute the axis radius.
   * If not provided, it will use the first defined radius axis.
   */
  radiusAxisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The size (in pixels) of the tick marks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { ChartsRotationAxis };
