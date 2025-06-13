import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useRadarMetricData } from './useRadarMetricData';
import { getDefaultBaseline, getDefaultTextAnchor } from '../../ChartsText/defaultTextPlacement';
import { ChartsText } from '../../ChartsText';

function RadarMetricLabels() {
  const { corners } = useRadarMetricData();

  const theme = useTheme();

  return (
    <React.Fragment>
      {corners.map(({ x, y, angle, label }, i) => (
        <ChartsText
          key={i}
          x={x}
          y={y}
          fontSize={14}
          fill={(theme.vars || theme).palette.text.primary}
          stroke="none"
          text={label}
          style={{
            ...theme.typography.caption,
            fontSize: 12,
            lineHeight: 1.25,
            textAnchor: getDefaultTextAnchor(180 + angle),
            dominantBaseline: getDefaultBaseline(180 + angle),
          }}
        />
      ))}
    </React.Fragment>
  );
}

export { RadarMetricLabels };
