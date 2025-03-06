import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useRadarMetricData } from './useRadarMetricData';
import { getDefaultBaseline, getDefaultTextAnchor } from '../../ChartsText/defaultTextPlacement';

function RadarMetricLabels() {
  const { corners } = useRadarMetricData();

  const theme = useTheme();

  return (
    <React.Fragment>
      {corners.map(({ x, y, angle, label }, i) => (
        <text
          key={i}
          x={x}
          y={y}
          fill={(theme.vars || theme).palette.text.primary}
          stroke="none"
          textAnchor={getDefaultTextAnchor(180 + angle)}
          dominantBaseline={getDefaultBaseline(180 + angle)}
        >
          {label}
        </text>
      ))}
    </React.Fragment>
  );
}

export { RadarMetricLabels };
