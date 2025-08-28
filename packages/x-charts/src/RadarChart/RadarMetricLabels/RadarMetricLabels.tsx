import * as React from 'react';
import { useRadarMetricData } from './useRadarMetricData';
import { getDefaultBaseline, getDefaultTextAnchor } from '../../ChartsText/defaultTextPlacement';
import { ChartsText } from '../../ChartsText';
import { filterAttributeSafeProperties } from '../../internals/filterAttributeSafeProperties';

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
