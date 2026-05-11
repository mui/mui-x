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
import type { ChartsRotationAxisProps, D3Scale } from '../models/axis';
import { useUtilityClasses } from './chartsRotationAxisClasses';
import { createGetLabelTextAnchors } from '../ChartsRadiusAxis/createGetLabelTextAnchors';
import { getLabelTransform } from './getLabelTransform';

/* Gap between a tick and its label. */
const TICK_LABEL_GAP = 3;

const getLabelTextAnchors = createGetLabelTextAnchors(getLabelTransform);

export function ChartsRotationAxis(props: ChartsRotationAxisProps) {
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
      {ticks.map(({ offset: angle, formattedValue }, index) => {
        if (!formattedValue) {
          return null;
        }

        // Convert "0 = up" convention to SVG math angle (0 = right, clockwise y-down).
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);

        const tx = cx + dx * radius;
        const ty = cy + dy * radius;

        const tickDx = (tickPosition === 'after' ? 1 : -1) * dx * tickSize;
        const tickDy = (tickPosition === 'after' ? 1 : -1) * dy * tickSize;

        const tickLabelGapDx = (tickLabelPosition === 'after' ? 1 : -1) * dx * TICK_LABEL_GAP;
        const tickLabelGapDy = (tickLabelPosition === 'after' ? 1 : -1) * dy * TICK_LABEL_GAP;

        // Compute the label position.
        let labelX = tx;
        let labelY = ty;

        labelX += tickLabelGapDx;
        labelY += tickLabelGapDy;
        if (tickLabelPosition === tickPosition && !disableTicks) {
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
