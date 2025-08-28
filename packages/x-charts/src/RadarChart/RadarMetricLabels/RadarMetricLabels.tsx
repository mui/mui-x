import * as React from 'react';
import { useRadarMetricData } from './useRadarMetricData';
import { ChartsText } from '../../ChartsText';

function RadarMetricLabels() {
  const { corners } = useRadarMetricData();

  return (
    <React.Fragment>
      {corners.map(({ x, y, label, ...other }, i) => {
        return <ChartsText key={i} x={x} y={y} text={label} {...other} />;
      })}
    </React.Fragment>
  );
}

export { RadarMetricLabels };
