import * as React from 'react';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useRotationScale } from '../hooks/useScale';
import { usePolarContext } from '../context/PolarProvider';

function getTextAnchor(dx: number) {
  if (dx > 0.2) {
    return 'start';
  }
  if (dx < -0.2) {
    return 'end';
  }
  return 'middle';
}

function getDominantBaseline(dy: number) {
  if (dy > 0.2) {
    return 'hanging';
  }
  if (dy < -0.2) {
    return 'auto';
  }
  return 'central';
}

function RadarLabels() {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = usePolarContext();

  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[]; // The metrics only take string for radar.

  const extraRadius = 5;
  return metrics.map((key) => {
    const angle = rotationScale(key)!;
    const r = (radiusAxis[key]!.scale.range()[1] as number) + extraRadius;

    const dx = -Math.sin(angle);
    const dy = -Math.cos(angle);
    return (
      <text
        x={cx + r * dx}
        y={cy + r * dy}
        textAnchor={getTextAnchor(dx)}
        dominantBaseline={getDominantBaseline(dy)}
        fill="white"
      >
        {radiusAxis[key].label}
      </text>
    );
  });
}

export { RadarLabels };
